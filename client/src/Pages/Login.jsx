import { useState, useContext } from 'react';
import './CSS/Login.css';
import { UserContext } from '../Context/UserContext.jsx';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-regular-svg-icons';

const Login = () => {
    const [state, setState] = useState("Login");
    const [formData, setFormData] = useState({ name: "", password: "", email: "" });
    const [error, setError] = useState("");
    const { login, signUp } = useContext(UserContext);
    const [passwordVisible, setPasswordVisible] = useState(false);
    const navigate = useNavigate();

    const changeHandler = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (state === "Login") {
                await login(formData.email, formData.password);
                console.log("Login successful");
                navigate('/profile');
            } else if (state === "Sign Up") {
                await signUp(formData.name, formData.email, formData.password);
                console.log("Sign-up successful");
                navigate('/profile');
            }
        } catch (error) {
            console.error(`${state} error`, error.response.data);
            setError(error.response.data.message || `${state} failed`);
        }
    }

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };


    return (
        <div className="loginsignup" onSubmit={handleSubmit}>
            <div className="loginsignup-container">
                <h1>{state}</h1>
                <div className="loginsignup-fields">
                    {state === "Sign Up" && <input name="name" value={formData.name} onChange={changeHandler} type="text" placeholder="Name" />}
                    <input name="email" value={formData.email} onChange={changeHandler} type="email" placeholder="Email" />
                    <div style={{ position: 'relative' }}>
                        <input 
                            name="password" 
                            value={formData.password} 
                            onChange={changeHandler} 
                            type={passwordVisible ? 'text' : 'password'} 
                            placeholder="Password" 
                        />
                        <span
                            onClick={togglePasswordVisibility}
                            style={{
                                position: 'absolute',
                                right: '10px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                cursor: 'pointer',
                            }}
                        >
                            {passwordVisible ? <FontAwesomeIcon icon={faEyeSlash} /> : <FontAwesomeIcon icon={faEye} />}
                        </span>
                    </div>
                </div>
                <button onClick={handleSubmit}>Continue</button>
                {state === "Sign Up"
                    ? <p className="loginsignup-login">Already have an account? <span onClick={() => setState("Login")}>Login</span></p>
                    : <p className="loginsignup-login">Create an account? <span onClick={() => setState("Sign Up")}>Click here</span></p>}
                <div className="loginsignup-agree">
                    <input type="checkbox" name='' id='' />
                    <p>By continuing, I agree to the terms of use & privacy policy</p>
                </div>
                {error && <p className="error">{error}</p>}
            </div>
        </div>
    );
}

export default Login;