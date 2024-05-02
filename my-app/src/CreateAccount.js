import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import './CreateAccount.css'; // Importing CSS file for styling
import firebase from './firebase';
import 'firebase/compat/firestore';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // Importing FontAwesomeIcon component
import { faUser, faLock, faEnvelope, faArrowRight, faVenusMars } from '@fortawesome/free-solid-svg-icons'; // Importing FontAwesome icons
import { initializeApp } from "firebase/app"; // Importing Firebase initialization function
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth"; // Importing Firebase authentication functions


// Functional component for creating an account
const CreateAccount = () => {
  const db = firebase.firestore();
  const history = useHistory(); // Using useHistory hook from react-router-dom for navigation
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    gender: ''
  });

  // Function to handle form submission
  const handleCreateAccount = (e) => {
    const { name, value } = e.target;
    setFormData(previousData => ({
      ...previousData,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault(); // Prevent the form submitting that refreshes the page
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    // Access all the form data as an object in 'formData' state variable
    console.log(formData);
    // Call the signup function to handle user registration
    signUp();
  };

  const signUp = async () => {
    formData.userName = formData.email.split('@')[0]; // Use part before @ in email address to set default userName
    console.log("Username: ", formData.userName);

    try {
      const userCredential = await firebase.auth().createUserWithEmailAndPassword(formData.email, formData.password);
      const userUid = userCredential.user.uid;
      console.log("Printing from signup: ", userUid);
      console.log("Starting to add doc ", userUid);

      // Use uid as document id in the firestore database
      const docRef = db.collection('Users').doc(userUid);

      // Create a new object with the fields to be added to Firestore
      const userData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        gender: formData.gender,
        userName: formData.userName,
        uid: userUid // Store the UID in Firestore
      };

      // Add a new document to Firestore
      await docRef.set(userData);

      // Alert when registration is successful
      alert("Registered Successfully");

      console.log('Document written with ID: ', docRef.id);

      // Redirect the user to the app after successful signup
      history.push('/app');
    } catch (error) {
      console.error('Error signing up: ', error.message);
      // Handle error here
      // For example, show error message to the user
      alert("Error occurred: " + error.message);
    }
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
            name="firstName"
            placeholder="First Name"
            value={formData.firstName}
            onChange={handleCreateAccount}
          />
        </div>

        {/* Input fields for last name */}
        <div className="input-group">
          <FontAwesomeIcon icon={faUser} />
          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            value={formData.lastName}
            onChange={handleCreateAccount}
          />
        </div>

        {/* Input fields for email */}
        <div className="input-group">
          <FontAwesomeIcon icon={faEnvelope} />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleCreateAccount}
          />
        </div>

        {/* Input fields for password */}
        <div className="input-group">
          <FontAwesomeIcon icon={faLock} />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleCreateAccount}
          />
        </div>

        {/* Input fields for confirm password */}
        <div className="input-group">
          <FontAwesomeIcon icon={faLock} />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleCreateAccount}
          />
        </div>

        {/* Input fields for gender */}
        <div className="input-group">
          <FontAwesomeIcon icon={faVenusMars} />
          <select
            name="gender"
            value={formData.gender}
            onChange={handleCreateAccount}
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>

        {/* Button to submit the form */}
        <button onClick={handleSubmit}>
          <FontAwesomeIcon icon={faArrowRight} />
          Create Account
        </button>
      </div>
    </div>
  );
};

export default CreateAccount;
