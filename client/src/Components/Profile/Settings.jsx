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
      '/user/update',
      formData,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );

    console.log('Response:', response.data);
    alert('Profile updated successfully!');
  } catch (error) {
    console.error('Error updating profile:', error.response?.data || error.message);
    alert('Failed to update profile. Check console for details.');
  }
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
        <form onSubmit={handleSubmit}>
        <label htmlFor="Name">
          Name<input type="text" placeholder="Name" name='name' value={formData.name || ""} onChange={handleChange}/>
          
        </label>
        <label htmlFor="">
          Email<input type="text" placeholder="email" name='email' value={formData.email || ""} onChange={handleChange}/>
          
        </label>
        <label htmlFor="">
          Phone<input type="text" placeholder="Phone number" name='phone' value={formData.phone || ""} onChange={handleChange}/>
         
        </label>
        <label htmlFor="country">
          Country<input type="text" placeholder="Country" name='country' value={formData.country || ""} onChange={handleChange}/>
          
        </label>
        <label htmlFor="">
          City<input type="text" placeholder="City" name='city' value={formData.city || ""} onChange={handleChange}/>
          
        </label>
        <label htmlFor="street">
          Street<input type="text" placeholder="Street" name='street' value={formData.street || ""} onChange={handleChange}/>
          
        </label>
        <label htmlFor="">
          House №<input type="text" placeholder="House number" name='apartment' value={formData.apartment || ""} onChange={handleChange}/>
          
        </label>
        <label htmlFor="">
          ZIP<input type="text" placeholder="ZIP code" name='zip' value={formData.zip || ""} onChange={handleChange}/>
        
        </label>
        <button type="submit" className='settings-update-btn'>Update</button>
        </form>
    </div>
  )
}

export default Settings;