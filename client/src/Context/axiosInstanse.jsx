import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:4000/',
    timeout: 10000
});
// Add a request interceptor
axios.interceptors.request.use(
    (config) => {
      // Get the token from localStorage
      const token = localStorage.getItem('token');
      
      // If token exists, add it to the headers
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
      
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

export default axiosInstance;