import PropTypes from 'prop-types';
import axiosInstance from "./axiosInstanse.jsx";
import { createContext, useState, useEffect } from "react";

export const UserContext = createContext();

export function UserContextProvider({children}) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const response = await axiosInstance.get('/api/user/profile', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                console.log("User profile response:", response.data);
                setUser(response.data);
                setIsAuthenticated(true);
            } catch (error) {
                console.error("Error fetching user profile:", error);
                setIsAuthenticated(false);
            } finally {
                setLoading(false); 
            }
        }

        if(localStorage.getItem('token')) {
            fetchUserProfile();
        } 
        else {
            setLoading(false);
            setIsAuthenticated(false);
        }
    }, []);

    const login = async (email, password) => {
        try {
            const response = await axiosInstance.post('/api/user/login', { email, password });
            localStorage.setItem('token', response.data.token);
            setUser(response.data.user); // Assuming the response includes user data
            setIsAuthenticated(true);
            setLoading(false);
        } catch (error) {
            if (error.response) {
                // Server responded with a status other than 2xx
                console.error('Error response:', error.response.data);
                if (error.response.status === 404) {
                    console.error('Endpoint not found. Please check the URL.');
                }
            } else if (error.request) {
                // Request was made but no response was received
                console.error('No response received:', error.request);
            } else {
                // Something happened in setting up the request
                console.error('Error setting up request:', error.message);
            }
            throw error; // Re-throw the error so it can be caught by the UI or logged
        }
    };
    const signUp = async (name, email, password, confirmPassword)=>{
        setLoading(true);
        
        // Check if password and confirmPassword match
        if (password !== confirmPassword) {
        setLoading(false);
        throw new Error("Passwords do not match.");
        }
        try {
            const response = await axiosInstance.post('/api/user/signup', { name, email, password });
            localStorage.setItem('token', response.data.token);
            setUser(response.data.user);
            setIsAuthenticated(true);
        } catch (error) {
            console.error("Error during sign-up:", error);
            throw error; // Re-throw so UI can handle the error    
        } finally {
            setLoading(false);
        }
    }

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        setIsAuthenticated(false);
        setLoading(false);
    };

    return (
        <UserContext.Provider value={{user, setUser, loading, login, logout, signUp, isAuthenticated}}>
            {children}
        </UserContext.Provider>
    )
}
UserContextProvider.propTypes = {
    children: PropTypes.node.isRequired,
};
