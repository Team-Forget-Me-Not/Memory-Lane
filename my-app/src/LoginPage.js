import React, { useEffect } from "react";
import { useHistory } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { ui } from './firebase'; // Adjust the path as necessary
import { EmailAuthProvider } from 'firebase/auth';


const Login = () => {
    const history = useHistory();

    useEffect(() => {
        const uiConfig = {
            signInOptions: [
                EmailAuthProvider.PROVIDER_ID
            ],
            callbacks: {
                signInSuccessWithAuthResult: function(authResult, redirectUrl) {
                    // User successfully signed in.
                    // Redirect to the Calendar page.
                    window.location.href = '/calendar'; // Adjust the path as necessary
                    return false; // Prevent the default redirect behavior
                },
                uiShown: function() {
                    // The widget is rendered.
                    // Hide the loader.
                    document.getElementById('loader').style.display = 'none';
                }
            },
            signInFlow: 'popup',
        };
    
        ui.start('#firebaseui-auth-container', uiConfig);
    
        return () => {
            ui.reset();
        };
    }, []);
    return (
        <div>
            <h2>Login Page</h2>
            <div id="firebaseui-auth-container"></div>
            <div id="loader">Loading...</div>
        </div>
    );
};

export default Login;