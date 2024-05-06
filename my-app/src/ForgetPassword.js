import React, { useState } from "react";
import './ForgetPassword.css'; // Importing CSS styles
import { sendPasswordResetEmail } from "firebase/auth";
import { useHistory } from "react-router-dom"; // Importing useHistory hook for navigation
import { database } from "./FirebaseConfig";
// Functional component for ForgetPassword
function ForgetPassword (){
 
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
    // const handleSubmit = async(e)=>{
    //     e.preventDefault();
    //     try{
    //         await sendPasswordResetEmail(getAuth(), getAuth().currentUser.email);
    //         alert("Check your email for password reset instructions.");

    //         //Update firestore document with new password and confirmpassword
    //         const currentUserEmail = getAuth().currentUser.email;
    //         await db.collection("Users").doc(currentUserEmail).update({
    //             passwordResetRequested: true,
    //         });

    //         history('/login-page');
    //     }catch(error){
    //         alert(error.code);
    //     }
    // };

    // JSX returned by the component
    return (
        <div className="mainContainer">
            <div className="header-Container">
                <img src="MemoryLaneB.png" alt="Brain" className="logo1" /> {/* Logo */}
            </div>
            <div className="Input-Container">
                <p><b>Please enter your information to reset your password</b></p>
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
