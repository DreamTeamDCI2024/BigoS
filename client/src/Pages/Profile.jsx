import { useState, useEffect, useContext } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useDropzone } from 'react-dropzone'; 
import axiosInstance from "../Context/axiosInstanse.jsx";
import Orders from "../Components/Profile/Orders.jsx";
import Settings from "../Components/Profile/Settings.jsx";
import { UserContext } from "../Context/UserContext.jsx";
import "./CSS/Profile.css";

const Profile = () => {
  
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
          navigate("/login"); // Redirect to login page
        } else {
          alert("An error occurred while fetching your profile.");
        }
      }
    };
    fetchUserData();
  }, [navigate]);

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

  const putRequestHandler = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    const data = { image };
    try {
      setUser({ ...user, image });
      console.log("Image before request:", image);
      const response = await axiosInstance.put("/api/user/update", data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      setUser(response.data); // Update user data in state
      setImage(response.data.image); // Update image in state
      console.log("Updated image after request:", response.data.image);

      alert("Profile photo updated successfully!");
    } catch (error) {
      if (error.response && error.response.status === 401) {
        alert("Unauthorized: Please log in again.");
        navigate("/login");
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
            {isDragActive ? <p>Drop the image here...</p> : <p style={{fontSize: "16px"}}>Drag and drop an image here, or click to select one</p>}
          </div>
          <button onClick={putRequestHandler}>Update Photo</button>
        </div>
        <div className="credentials">
          <ul>
            <li onClick={() => handleClick(0)}>
              My Orders
              <hr />
              <div
                className={`credentials-info ${openIndex === 0 ? "open" : ""}`}
              >
                <Orders />
              </div>
            </li>
            <li onClick={() => handleClick(1)}>
              My Information
              <hr />
              <div
                className={`credentials-info ${openIndex === 1 ? "open" : ""}`}
              >
                <div onClick={(e) => e.stopPropagation()}>
                  <Settings />
                </div>
              </div>
            </li>
            <li className="logout-item" onClick={handleLogout}>
              Logout
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Profile;
