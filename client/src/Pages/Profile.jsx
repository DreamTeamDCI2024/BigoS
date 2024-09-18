import { useState, useEffect } from "react";
import { NavLink, Navigate, Outlet } from "react-router-dom";
import "./CSS/Profile.css";
import { useDropzone } from 'react-dropzone';
import axiosInstance from "../Context/axiosInstanse.jsx";

const Profile = () => {

  const isActive = ({ isActive }) => (
    { backgroundColor: isActive ? "antiquewhite" : "" }
  );
  const isLoggedIn = true;
  const [user, setUser] = useState(null); // for storing user data
  const [image, setImage] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No token found');
        }
        const response = await axiosInstance.get('/api/user/profile', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          }
        });

        setUser(response.data); // Store user data in state
        setImage(response.data.image || ""); // Set initial image from user data
      } catch (error) {
        if (error.response && error.response.status === 401) {
          alert("Unauthorized: Please log in again.");
        } else {
          alert("An error occurred while fetching your profile.");
        }
      }
    };
    fetchUserData();
  }, []);

  const getBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': []
    },
    onDrop: async (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file) {
        try {
          const base64 = await getBase64(file);
          setImage(base64);
        } catch (error) {
          console.error('Error al convertir el archivo a base64:', error);
        }
      }
    },
    multiple: false,
  });

  const putRequestHandler = async (e) => {
    e.preventDefault();

    const data = { image };
    const token = localStorage.getItem('token');
    try {
      const response = await axiosInstance.put(
        "/api/user/update",
        data,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      setUser(response.data); // Update user data in state
      setImage(response.data.image); // Update image in state
    } catch (error) {
      if (error.response && error.response.status === 401) {
        alert("Unauthorized: Please log in again.");
      } else {
        alert("An error occurred while updating your profile.");
      }
    }
  };

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div>
      <div className="user-profile">
        <div className="top-side">
          <h2>¡Bienvenido de nuevo, {user ? user.name : "Usuario"}!</h2>
          {image ? (
            <img
              src={image}
              alt="User Avatar"
              style={{ width: '150px', height: '150px', borderRadius: '50%', objectFit: 'cover', marginBottom: '10px' }}
            />
          ) : (
            <div style={{ width: '150px', height: '150px', borderRadius: '50%', backgroundColor: '#ddd', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '10px' }}>
              Sin Avatar
            </div>
          )}

          <div className="input">
            <div {...getRootProps()} style={{ border: '2px dashed #ccc', padding: '20px', textAlign: 'center', cursor: 'pointer' }}>
              <input {...getInputProps()} />
              {isDragActive ? (
                <p>Suelta la imagen aquí...</p>
              ) : (
                <p>Arrastra y suelta una imagen aquí, o haz clic para seleccionar una</p>
              )}
            </div>
            <button onClick={putRequestHandler}>Actualizar</button>
          </div>
        </div>
        <div className="credentials">
          <nav className="left-c">
            <NavLink to="/profile/orders" style={isActive}>
              Mis Órdenes
            </NavLink>
            <NavLink to="/profile/settings" style={isActive}>
              Configuración
            </NavLink>
            <NavLink to="/profile/logout" style={isActive}>
              Cerrar Sesión
            </NavLink>
          </nav>
          <div className="right-c">
            <Outlet context={user} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
