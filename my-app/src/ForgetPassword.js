import React, {useState} from "react";
import './ForgetPassword.css';
import { useHistory } from "react-router-dom/cjs/react-router-dom";
import {Link} from 'react-router-dom';

const ForgetPassword = () =>{
    const[email, setEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    

    return(
        <div className="mainContainer">
             <div className="header-Container">
            <img src = "MemoryLane.jpeg" alt = "Brain" className = "logo"/>
            <h1>Memory Lane</h1>
        </div>
        <div className="Input-Container">
            <p><b>Please enter in your email address:</b></p>
            <form>
            <label hmtmlFor="email"><b>Email:</b></label>
                <input
                 type="email"
                 id="email"
                 name="email"
                 value={email}
                 onChange={(e) => setEmail(e.target.value)}
                 required
                /><br/>
            </form>
        </div>
        </div>
    )
};

export default ForgetPassword;