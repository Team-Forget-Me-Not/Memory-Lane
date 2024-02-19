import React from 'react';
import { Link } from 'react-router-dom';
import './FrontPage.css'; // Create a new CSS file for styling

const FrontPage = () => {
  return (
    <div className="front-page-container">
      <h2 className="welcome-text">Welcome to Memory Lane!</h2>
      <div className="button-container">
        <Link to="/login-page" className="login-button">
          Login
        </Link>
        <Link to="/create-account" className="create-account-button">
          Create Account
        </Link>
      </div>
    </div>
  );
};

export default FrontPage;
