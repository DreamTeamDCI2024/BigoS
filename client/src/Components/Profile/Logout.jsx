import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import './Profile.css';
import { UserContext } from "../../Context/UserContext.jsx";

export default function Logout() {
    const {logout} = useContext(UserContext);
    const navigate = useNavigate();
    const handleLogout = () => {
        logout();
        navigate('/login');
    };
    return (
        
    <div className="logout">
        <button onClick={handleLogout}>Logout</button>
    </div>
)
}