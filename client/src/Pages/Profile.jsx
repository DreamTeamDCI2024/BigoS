import { useState, useEffect  } from "react";
import { NavLink, Navigate, Outlet } from "react-router-dom";
import "./CSS/Profile.css";
import FileBase64 from 'react-file-base64';
import axiosInstance from "../Context/axiosInstanse.jsx";

const Profile = () => {
    
  const isActive = ({isActive}) => (
    {backgroundColor: isActive ? "antiquewhite" : "" }
  );
  const isLoggedIn = true;
  const [user, setUser] = useState(null); //for storing user data
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
              'Authorization': `Bearer ${token}`
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

  const putRequestHandler = async (e) => {
    e.preventDefault();

    const data = { image };
    const token = localStorage.getItem('token');
    try {
      const response = await axiosInstance.put(
        "/user/update",
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
            <h2>Welcome back, {user ? user.name : "User"}!</h2>
          {image ? (
            <img 
              src={image} 
              alt="User Avatar" 
              style={{ width: '150px', height: '150px', borderRadius: '50%', objectFit: 'cover', marginBottom: '10px' }} 
            />
          ) : (
            <div style={{ width: '150px', height: '150px', borderRadius: '50%', backgroundColor: '#ddd', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '10px' }}>
              No Avatar
            </div>
          )}
          
          <div className="input">
            < FileBase64 
                type="file"
                multiple={false}
                onDone={({base64}) => {
                setImage(base64);
          }}
          />
          <button onClick={putRequestHandler}>Update</button>
          </div>
        </div>
        <div className="credentials">
          <nav className="left-c">
            <NavLink to="/profile/orders" style={isActive}>
              My Orders
            </NavLink>
            <NavLink to="/profile/settings" style={isActive}>
              Settings
            </NavLink>
            
            <NavLink to="/profile/logout" style={isActive}>
              Logout
            </NavLink>
          </nav>
          <div className="right-c">
          <Outlet context={user}/>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;