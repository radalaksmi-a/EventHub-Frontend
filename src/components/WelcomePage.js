import React from 'react';
import './WelcomePage.css';
import { Link } from 'react-router-dom';

const WelcomePage = () => {
  return (
    <div className="welcome-container">
      <div className="background-image"></div>
      <div className="content">
        <h1>Welcome to EventHub</h1>
        <div className="button-container">
          <Link to="/login" className="login-button">Login</Link>
          <Link to="/signup" className="signup-button">Signup</Link>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;
