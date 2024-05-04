import React, { useState } from "react";
import './LoginPage.css'; // Ensure your CSS file is imported
import { useHistory, Link } from 'react-router-dom';
import firebase from "./firebase";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse } from '@fortawesome/free-solid-svg-icons';


const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [confirmMessage, setConfirmMessage] = useState(null);
    const history = useHistory();

    const handleSignIn = async (e) => {
        e.preventDefault();
        try {
            await firebase.auth().signInWithEmailAndPassword(email, password);
            setConfirmMessage('Sign-in successful!');
            history.push('/app');
        } catch (error) {
            setError('Email/username or password incorrect');
        }
    };

    return (
        <div className="login-body"> 
            {/* Header container with logo and title */}
            <div className="header-Container">
                <img src="MemoryLaneB.png" alt="Brain" className="logo" />
                <h1>Memory Lane</h1>
                <Link to="/Front-page" style={{ textDecoration: 'none' }}>
            <FontAwesomeIcon icon={faHouse} /> Home
        </Link>
            </div>

            {/* Login form container with background image */}
            <div className="login-Center">
                <h2>Login</h2>
                <form onSubmit={handleSignIn}>
                    <label htmlFor="email">Email Address</label>
                    <input type="email" id="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    <label htmlFor="password">Password</label>
                    <input type="password" id="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    <Link to="/forget-password">
                        <p id="forget-password">Forget password</p>
                    </Link>
                    {error && <p className="error-message">{error}</p>}
                    {confirmMessage && <p className="confirm-message">{confirmMessage}</p>}
                    <div className="buttonContainer">
                        <button type="submit" className="button">Enter</button>
                        <Link to="/create-account">
                            <button type='button' className='sign-up-btn'>Don't have an account?</button>
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Login;
