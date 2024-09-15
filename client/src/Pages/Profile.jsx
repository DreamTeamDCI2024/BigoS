import { useState, useEffect, useContext } from "react";
import { NavLink, Navigate, Outlet, useNavigate } from "react-router-dom";
import { useDropzone } from 'react-dropzone'; 
import axiosInstance from "../Context/axiosInstanse.jsx";
import Orders from "../Components/Profile/Orders.jsx";
import Settings from "../Components/Profile/Settings.jsx";
import { UserContext } from "../Context/UserContext.jsx";
import "./CSS/Profile.css";

const Profile = () => {
  const isActive = ({ isActive }) => ({
    backgroundColor: isActive ? "antiquewhite" : "",
  });
  const isLoggedIn = true;
  const [user, setUser] = useState(null);
  const [image, setImage] = useState("");
  const [openIndex, setOpenIndex] = useState(null);
  const { logout } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleClick = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found");

        const response = await axiosInstance.get("/api/user/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data);
        setImage(response.data.image || "");
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
    accept: "image/*",
    onDrop: async (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file) {
        try {
          const base64 = await getBase64(file);
          setImage(base64);
        } catch (error) {
          console.error("Error al convertir el archivo a base64:", error);
        }
      }
    },
    multiple: false,
  });

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div>
      <div className="user-profile">
        <div className="top-side">
          <h2>Welcome back, {user ? user.name : "User"}!</h2>
          {image ? (
            <img
              src={image}
              alt="User Avatar"
              style={{
                width: "150px",
                height: "150px",
                borderRadius: "50%",
                objectFit: "cover",
                marginBottom: "10px",
              }}
            />
          ) : (
            <div
              style={{
                width: "150px",
                height: "150px",
                borderRadius: "50%",
                backgroundColor: "#ddd",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "10px",
              }}
            >
              No Avatar
            </div>
          )}
          <div {...getRootProps()} style={{ border: "2px dashed #ccc", padding: "20px", textAlign: "center", cursor: "pointer" }}>
            <input {...getInputProps()} />
            {isDragActive ? <p>Drop the image here...</p> : <p>Drag 'n' drop an image here, or click to select one</p>}
          </div>
          <button onClick={handleLogout}>Update Photo</button>
        </div>
        <div className="credentials">
          <nav className="left-c">
            <NavLink to="/profile/orders" style={isActive}>
              My Orders
            </NavLink>
            <NavLink to="/profile/settings" style={isActive}>
              Settings
            </NavLink>
            <NavLink to="/profile/logout" style={isActive} onClick={handleLogout}>
              Logout
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
