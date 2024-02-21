import React, { useState } from "react";
import './LoginPage.css';
import { useHistory } from 'react-router-dom'; // Import useNavigate
import { Link } from 'react-router-dom';

const Login = () => {
    // State variables to manage email, password, error, and confirmation messages
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [confirmMessage, setConfirmMessage] = useState(null);
    // Variable to store user ID
    var uid;

    // Use the useHistory hook to navigate to different pages
    const history = useHistory();

    // Function to handle the sign-in process
    const handleSignIn = async () => {
        try {
            // Display a success message
            setConfirmMessage('Sign-in successful!');
            // Use history to redirect to the homepage
            history.push('/');
        } catch (error) {
            // Handle any errors during the sign-in process
            setError(error.message);
        }
    }

    return (
        <div>
            {/* Header container with logo and title */}
            <div className="header-Container">
                <img src="MemoryLane.jpeg" alt="Brain" className="logo" />
                <h1>Memory Lane</h1>
            </div>

        <div className="login-Center">
            <h2>Login Page</h2>
            <form>
                <label hmtmlFor="email">Email or Username:</label>
                <input
                 type="email"
                 id="email"
                 name="email"
                 value={email}
                 onChange={(e) => setEmail(e.target.value)}
                 required
                /><br/>
                <label htmlFor="password">Password:</label>
                <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                />
                <p id="forget-password">Forget password</p>
                {error && <p className="error-message">{error}</p>}
                {confirmMessage && <p className="confirm-message">{confirmMessage}</p>}
                <div className="buttonContainer">
                    <button className="button">Login</button>
                    <Link to = "/create-account">
                        <button type='button' className='sign-up-btn'>Create Account</button>
                    </Link>
                </div>
            </form>
        </div>

            {/* Cover image */}
            <img src="CCL Diary.jpg" alt="Diary with pen" className="cover-image" />
        </div>
    );
}

export default Login;
