import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import './CreateAccount.css'; // Importing CSS file for styling
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // Importing FontAwesomeIcon component
import { faUser, faLock, faEnvelope, faArrowRight, faVenusMars } from '@fortawesome/free-solid-svg-icons'; // Importing FontAwesome icons
import { initializeApp } from "firebase/app"; // Importing Firebase initialization function
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth"; // Importing Firebase authentication functions

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCxGAfivTx5MkI23kLvQMJrCL4CNYwew0Y",
  authDomain: "memory-lane-8d7b0.firebaseapp.com",
  databaseURL: "https://memory-lane-8d7b0-default-rtdb.firebaseio.com",
  projectId: "memory-lane-8d7b0",
  storageBucket: "memory-lane-8d7b0.appspot.com",
  messagingSenderId: "951803202921",
  appId: "1:951803202921:web:0a5e7c466706b1537301f8"
};

// Initialize Firebase app with the provided configuration
const app = initializeApp(firebaseConfig);

// Functional component for creating an account
const CreateAccount = () => {
  const history = useHistory(); // Using useHistory hook from react-router-dom for navigation

  // State variables for form inputs
  const [firstName, setFirstName] = useState(''); // State variable for first name input
  const [lastName, setLastName] = useState(''); // State variable for last name input
  const [email, setEmail] = useState(''); // State variable for email input
  const [password, setPassword] = useState(''); // State variable for password input
  const [confirmPassword, setConfirmPassword] = useState(''); // State variable for confirm password input
  const [gender, setGender] = useState(''); // State variable for gender input

  // Function to handle form submission
  const handleCreateAccount = (e) => {
    e.preventDefault();

    // Checking if password and confirm password match
    if (password !== confirmPassword) {
      console.error("Passwords do not match"); // Logging error if passwords don't match
      return;
    }

    // Creating a new user with email and password using Firebase authentication
    const auth = getAuth();
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        history.push('/app'); // Redirecting to '/app' route after successful account creation
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error(errorCode, errorMessage); // Logging error details if account creation fails
      });
  };

  return (
    <div className="create-account-page">
      <h1>Create Account</h1>
      <div className="create-account-form">
        {/* Input fields for first name */}
        <div className="input-group">
          <FontAwesomeIcon icon={faUser} />
          <input
            type="text"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </div>

        {/* Input fields for last name */}
        <div className="input-group">
          <FontAwesomeIcon icon={faUser} />
          <input
            type="text"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>

        {/* Input fields for email */}
        <div className="input-group">
          <FontAwesomeIcon icon={faEnvelope} />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* Input fields for password */}
        <div className="input-group">
          <FontAwesomeIcon icon={faLock} />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {/* Input fields for confirm password */}
        <div className="input-group">
          <FontAwesomeIcon icon={faLock} />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        {/* Input fields for gender */}
        <div className="input-group">
          <FontAwesomeIcon icon={faVenusMars} />
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>

        {/* Button to submit the form */}
        <button onClick={handleCreateAccount}>
          <FontAwesomeIcon icon={faArrowRight} />
          Create Account
        </button>
      </div>
    </div>
  );
};

export default CreateAccount;
