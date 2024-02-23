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

            {/* Login form container */}
            <div className="login-Center">
                <h2>Login Page</h2>
                <form>
                    {/* Input for email or username */}
                    <label htmlFor="email">Email or Username:</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    /><br />
                    {/* Input for password */}
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                <Link to = "/forget-password">
                    {/* Forget password link */}
                    <p id="forget-password">Forget password</p>
                </Link>
                    {/* Display error message if there is an error */}
                    {error && <p className="error-message">{error}</p>}
                    {/* Display confirmation message if sign-in is successful */}
                    {confirmMessage && <p className="confirm-message">{confirmMessage}</p>}
                    {/* Container for login and create account buttons */}
                    <div className="buttonContainer">
                    <Link to = "/">
                        {/* Login button */}
                        <button className="button" onClick={handleSignIn}>Login</button>
                    </Link>
                        {/* Link to create account page */}
                        <Link to="/create-account">
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
