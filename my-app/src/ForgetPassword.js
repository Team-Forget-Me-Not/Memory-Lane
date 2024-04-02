import React from "react";
import './ForgetPassword.css'; // Importing CSS styles
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { useHistory } from "react-router-dom"; // Importing useHistory hook for navigation
import { database } from "./FirebaseConfig";

// Functional component for ForgetPassword
function ForgetPassword (){
    // const auth = getAuth(firebase); //get the auth object from firebase

    // const history = useHistory();
    // const handleSubmit = async(e) =>{
    //     e.preventDefault();
    //     const emailVal = e.target.email.value;
        
    //     try{
    //         await sendPasswordResetEmail(auth, emailVal);
    //         alert("Check your email!");
    //         history.push('/login-page')
    //     }catch(error){
    //         alert(error.code);
    //     }
    // };
    const history = useHistory();
    const handleSubmit = async(e)=>{
        e.preventDefault();
        const emailVal = e.target.email.value;
        sendPasswordResetEmail(database, emailVal).then(data=>{
            alert("Check your email!");
            history("/login-page");
        }).catch(err=>{
            alert(err.code);
        })
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
                <form onSubmit={(e)=>handleSubmit(e)}>
                    <label htmlFor="email"><b>Email:</b></label>
                    {/* Input field for email */}
                    <input
                        name="email"
                        required/><br/>
                    {/* Button to reset password */}
                    <button type="submit">Reset Password</button>
                </form>
            </div>
        </div>
    )
};

export default ForgetPassword; // Exporting the ForgetPassword component
