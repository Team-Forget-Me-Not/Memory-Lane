import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import './CreateAccount.css'; // Importing CSS file for styling
import firebase from './firebase';
import 'firebase/compat/firestore';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // Importing FontAwesomeIcon component
import { faUser, faLock, faEnvelope, faArrowRight, faVenusMars } from '@fortawesome/free-solid-svg-icons'; // Importing FontAwesome icons
import { initializeApp } from "firebase/app"; // Importing Firebase initialization function
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth"; // Importing Firebase authentication functions

//Firebase configuration
// const firebaseConfig = {
//   apiKey: "AIzaSyCxGAfivTx5MkI23kLvQMJrCL4CNYwew0Y",
//   authDomain: "memory-lane-8d7b0.firebaseapp.com",
//   databaseURL: "https://memory-lane-8d7b0-default-rtdb.firebaseio.com",
//   projectId: "memory-lane-8d7b0",
//   storageBucket: "memory-lane-8d7b0.appspot.com",
//   messagingSenderId: "951803202921",
//   appId: "1:951803202921:web:0a5e7c466706b1537301f8"
// };

// const app = initializeApp(firebaseConfig);
// const db = getFirestore(app);

// Functional component for creating an account
const CreateAccount = () => {
  const db = firebase.firestore();
  const history = useHistory(); // Using useHistory hook from react-router-dom for navigation
  // State variables for form inputs
  // const [firstName, setFirstName] = useState(''); // State variable for first name input
  // const [lastName, setLastName] = useState(''); // State variable for last name input
  // const [email, setEmail] = useState(''); // State variable for email input
  // const [password, setPassword] = useState(''); // State variable for password input
  // const [confirmPassword, setConfirmPassword] = useState(''); // State variable for confirm password input
  // const [gender, setGender] = useState(''); // State variable for gender input
  //Storing form data with User's fields
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


    

    // // Checking if password and confirm password match

    // Creating a new user with email and password using Firebase authentication
    // const auth = getAuth();
    // createUserWithEmailAndPassword(auth, email, password)
    //   .then((userCredential) => {
    //     const user = userCredential.user;
    //     history.push('/app'); // Redirecting to '/app' route after successful account creation
    //   })
    //   .catch((error) => {
    //     const errorCode = error.code;
    //     const errorMessage = error.message;
    //     console.error(errorCode, errorMessage); // Logging error details if account creation fails
    //   });


  const handleSubmit = (event) => {
    event.preventDefault();//Prevent the form submitting that refreshes the page
    history.push('/app');
    //Access all the form data as an object in 'formData' state variable
    console.log(formData)
    //call the signup function to handle user registration
    signUp();
  };


  const signUp = async () => {
    formData.userName = (formData.email).split('@')[0]; //Use part before @ in email address to set default userName
    console.log("Username: ", formData.userName);

    firebase.auth().createUserWithEmailAndPassword(formData.email, formData.password)
      .then((userCredential) => {
        const userUid = userCredential.user.uid;
        console.log("Printing from signup: ", userUid);
        console.log("Starting to add doc ", userUid);

        //Use uid as document id in the firestore database
        const docRef = db.collection('Users').doc(userUid);

        //Add a new document to Firestore
        docRef.set(formData)
        .then(() =>{
          if(userUid){
            //alert when registration is successful
            alert("Register Successfully");
          } else{
            alert("Error Occurred")
          }
          console.log('Document written with ID: ', docRef.id);
        })
        .catch((error) => {
          console.error('Error adding document: ', error);
        });
      })
      .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
      })
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
            name ="email"
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
