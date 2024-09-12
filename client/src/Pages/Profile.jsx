import { useState, useEffect, useContext  } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import "./CSS/Profile.css";
import FileBase64 from 'react-file-base64';
import axiosInstance from "../Context/axiosInstanse.jsx";
import Orders from '../Components/Profile/Orders.jsx';
import Settings from "../Components/Profile/Settings.jsx";
import {UserContext} from '../Context/UserContext.jsx'

const Profile = () => {
    
  const isLoggedIn = true;
  const [user, setUser] = useState(null); //for storing user data
  const [image, setImage] = useState("");
  const [openIndex, setOpenIndex] = useState(null);
  const {logout} = useContext(UserContext);
  const navigate = useNavigate();
  
  const handleLogout = () => {
        logout();
        navigate('/login');
    };

  const handleClick = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

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

  const putRequestHandler = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    const data = { image };
    try {
      setUser({...user, image});
      console.log('Image before request:', image);
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
      console.log('Updated image after request:', response.data.image);
      
      alert("Profile photo updated successfully!");
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
          <button onClick={putRequestHandler}>Update Photo</button>
          </div>
        </div>
        <div className="credentials">
      <ul>
        <li onClick={() => handleClick(0)}>
          My Orders
          <hr />
          <div className={`credentials-info ${openIndex === 0 ? 'open' : ''}`}>
            <Orders />
          </div>
        </li>
        <li onClick={() => handleClick(1)}>
          My Information
          <hr />
          <div className={`credentials-info ${openIndex === 1 ? 'open' : ''}`}>
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