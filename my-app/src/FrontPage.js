import React from 'react';
import { Link } from 'react-router-dom';
import './FrontPage.css'; // Import external CSS file for styling

const FrontPage = () => {
  return (
    // Main container for the front page content
    <div className="front-page-container">
      {/* Header text welcoming users */}
      <h2 className="welcome-text">Welcome to Memory Lane!</h2>

      {/* Container for buttons */}
      <div className="button-container">
        {/* Link to the login page */}
        <Link to="/login-page" className="login-button">
          Login
        </Link>

        {/* Link to the create account page */}
        <Link to="/create-account" className="create-account-button">
          Create Account
        </Link>
      </div>
    </div>
  );
};

// Export the FrontPage component as the default export
export default FrontPage;
