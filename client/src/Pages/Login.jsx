import { useState, useContext } from 'react';
import './CSS/Login.css';
import { UserContext } from '../Context/UserContext.jsx';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-regular-svg-icons';
import TermsOfuse from '../Components/TermsOfuse/TermsOfuse.jsx';

const Login = () => {
    const [state, setState] = useState("Login");
    const [formData, setFormData] = useState({ name: "", password: "", email: "", confirmPassword: "" });
    const [error, setError] = useState("");
    const { login, signUp } = useContext(UserContext);
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [showTermsModal, setShowTermsModal] = useState(false);
    const [agreeTerms, setAgreeTerms] = useState(false);
    
    const navigate = useNavigate();

    const changeHandler = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (state === "Sign Up") {
            // Check if terms are agreed to
            if (!agreeTerms) {
                setError("Please agree to the terms of use & privacy policy");
                return;
            }
            // Check if passwords match
            if (formData.password !== formData.confirmPassword) {
                setError("Passwords do not match");
                return;
            }
        }
        try {
            if (state === "Login") {
                await login(formData.email, formData.password);
                console.log("Login successful");
                navigate('/profile');
            } else if (state === "Sign Up") {
                await signUp(formData.name, formData.email, formData.password, formData.confirmPassword);
                console.log("Sign-up successful");
                navigate('/profile');
            }
        } catch (error) {
            console.error(`${state} error`, error);
            if (error.response) {
                setError(error.response.data.message || `${state} failed: ${error.response.status}`);
            } else if (error.request) {
                setError(`${state} failed: No response received from server`);
            } else {
                setError(`${state} failed: ${error.message}`);
            }
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
                    {state === "Sign Up" && (
                        <div>
                            <input
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={changeHandler}
                                type={passwordVisible ? 'text' : 'password'}
                                placeholder="Confirm Password"
                                required
                            />
                        </div>
                    )}
                </div>
                <button onClick={handleSubmit}>Continue</button>
                {state === "Sign Up"
                    ? <p className="loginsignup-login">Already have an account? <span onClick={() => setState("Login")}>Login</span></p>
                    : <p className="loginsignup-login">Create an account? <span onClick={() => setState("Sign Up")}>Click here</span></p>}
                {state === "Sign Up" && (
                    <div className="loginsignup-agree">
                        <input 
                            type="checkbox" 
                            checked={agreeTerms}
                            onChange={(e) => setAgreeTerms(e.target.checked)}
                        />
                        <p>By continuing, I agree to the <span onClick={() => setShowTermsModal(true)} style={{ color: 'blue', cursor: 'pointer' }}>terms of use & privacy policy</span></p>
                    </div>
                )}
                {error && <p className="error">{error}</p>}
            </div>
            <TermsOfuse show={showTermsModal} onClose={() => setShowTermsModal(false)} title="Terms of Use">
                
            </TermsOfuse>
        </div>
    );
};

export default Login;

/*
import { useState, useContext } from 'react';
import './CSS/Login.css';
import { UserContext } from '../Context/UserContext.jsx';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-regular-svg-icons';
import TermsOfuse from '../Components/TermsOfuse/TermsOfuse.jsx';

const Login = () => {
    const [state, setState] = useState("Login");
    const [formData, setFormData] = useState({ name: "", password: "", email: "" });
    const [error, setError] = useState("");
    const { login, signUp } = useContext(UserContext);
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [showTermsModal, setShowTermsModal] = useState(false);
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
                    <p>By continuing, I agree to the <span onClick={() => setShowTermsModal(true)} style={{ color: 'blue', cursor: 'pointer' }}>terms of use & privacy policy</span></p>
                </div>
                {error && <p className="error">{error}</p>}
            </div>
            <TermsOfuse show={showTermsModal} onClose={() => setShowTermsModal(false)} title="Terms of Use">
                <p>[Insert your Terms of Use content here]</p>
            </TermsOfuse>
        </div>
    );
}

export default Login;*/