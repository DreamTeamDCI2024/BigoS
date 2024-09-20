import {useState, useEffect} from 'react';
import { useOutletContext } from 'react-router-dom';
import axiosInstance from '../../Context/axiosInstanse.jsx';

const Settings = () => {
  const user = useOutletContext();
  
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    city: user?.city || "",
    zip: user?.zip || "",
    country: user?.country || "",
    street: user?.street || "",
    apartment: user?.apartment || "",
  });

  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  try {
    
    const token = localStorage.getItem('token');

    if (!token) {
      throw new Error('No token found');
    }

    const response = await axiosInstance.put(
      '/api/user/update',
      formData,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );

    console.log('Response:', response.data);
    setAlertMessage('Profile updated successfully!');
    setShowAlert(true);
  } catch (error) {
    setAlertMessage('Failed to update profile.');
    setShowAlert(true);
    console.error('Error updating profile:', error.response?.data || error.message);
    }
    setTimeout(() => {
      setShowAlert(false);
      setAlertMessage('');
    }, 3000);
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
            'Authorization': `Bearer ${token}`
          }
        });
        console.log("settings2", response);
        
        setFormData({
          name: response.data.name,
          email: response.data.email,
          phone: response.data.phone,
          city: response.data.city,
          zip: response.data.zip,
          country: response.data.country,
          street: response.data.street,
          apartment: response.data.apartment,
        });
      } catch (error) {
        console.error('Error fetching user data:', error.response?.data || error.message);
      }
    };
  
    fetchUserData();
  }, []);
  
  return (
    <div className='settings'>
      {showAlert && (
        <div className="alert-message">
          {alertMessage}
        </div>
      )}
        <form onSubmit={handleSubmit} className="settings-form">
    <div className="form-group">
    <div className='label'><label htmlFor="name">Name</label></div>
    <input
      type="text"
      placeholder="Name"
      name="name"
      value={formData.name || ""}
      onChange={handleChange}
    />
  </div>

  <div className="form-group">
    <div className='label'><label htmlFor="email">Email</label></div>
    <input
      type="email"
      placeholder="Email"
      name="email"
      value={formData.email || ""}
      onChange={handleChange}
    />
  </div>

  <div className="form-group">
    <div className='label'><label htmlFor="phone">Phone</label></div>
    <input
      type="tel"
      placeholder="Phone number"
      name="phone"
      value={formData.phone || ""}
      onChange={handleChange}
    />
  </div>

  <div className="form-group">
    <div className='label'><label htmlFor="country">Country</label></div>
    <input
      type="text"
      placeholder="Country"
      name="country"
      value={formData.country || ""}
      onChange={handleChange}
    />
  </div>

  <div className="form-group">
    <div className='label'><label htmlFor="city">City</label></div>
    <input
      type="text"
      placeholder="City"
      name="city"
      value={formData.city || ""}
      onChange={handleChange}
    />
  </div>

  <div className="form-group">
    <div className='label'><label htmlFor="street">Street</label></div>
    <input
      type="text"
      placeholder="Street"
      name="street"
      value={formData.street || ""}
      onChange={handleChange}
    />
  </div>

  <div className="form-group">
    <div className='label'><label htmlFor="apartment">House №</label></div>
    <input
      type="text"
      placeholder="House number"
      name="apartment"
      value={formData.apartment || ""}
      onChange={handleChange}
    />
  </div>

  <div className="form-group">
    <div className='label'><label htmlFor="zip">ZIP</label></div>
    <input
      type="text"
      placeholder="ZIP code"
      name="zip"
      value={formData.zip || ""}
      onChange={handleChange}
    />
  </div>

  <button type="submit" className="settings-update-btn">Update</button>
</form>
    </div>
  )
}

export default Settings;