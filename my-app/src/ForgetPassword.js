import React, { useState } from "react";
import './ForgetPassword.css'; // Importing CSS styles
import { useHistory } from "react-router-dom"; // Importing useHistory hook for navigation
import { Link } from 'react-router-dom'; // Importing Link component for routing

// Functional component for ForgetPassword
const ForgetPassword = () => {
    const [email, setEmail] = useState(''); // State for email input
    const [newPassword, setNewPassword] = useState(''); // State for new password input
    const [phoneNumber, setPhoneNumber] = useState(''); // State for phone number input
    const history = useHistory(); // Getting history object for navigation

    // Function to handle resetting password
    const handleResetPassword = (e) => {
        e.preventDefault(); // Preventing default form submission behavior
        console.log("Email:", email); // Logging email input
        console.log("New Password:", newPassword); // Logging new password input
        console.log("Phone Number:", phoneNumber); // Logging phone number input
        // Redirecting the user to a confirmation page
        history.push("/reset-confirmation");
    }

    // JSX returned by the component
    return (
        <div className="mainContainer">
            <div className="header-Container">
                <img src="MemoryLane.jpeg" alt="Brain" className="logo1" /> {/* Logo */}
            </div>
            <div className="Input-Container">
                <p><b>Please enter your information to reset your password:</b></p>
                {/* Form for resetting password */}
                <form onSubmit={handleResetPassword}>
                    <label htmlFor="email"><b>Email:</b></label>
                    {/* Input field for email */}
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    /><br />
                    <label htmlFor="newPassword"><b>New Password:</b></label>
                    {/* Input field for new password */}
                    <input
                        type="password"
                        id="newPassword"
                        name="newPassword"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                    /><br />
                    {/* Button to reset password */}
                    <button type="submit">Reset Password</button>
                </form>
            </div>
        </div>
    )
};

export default ForgetPassword; // Exporting the ForgetPassword component
