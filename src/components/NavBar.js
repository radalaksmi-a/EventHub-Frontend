// NavBar.js

import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../Contexts/AuthContext'; // Assume you have an AuthContext

import './NavBar.css';

const NavBar = () => {
  const { isAuthenticated, logout } = useAuth(); // Adjust based on your AuthContext
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();
  const location = useLocation();
  const currentPageUrl = location.pathname + location.search;
  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };
  

  return (
    <nav className="navbar">
      {currentPageUrl!=="/" && <ul>
        {!user && (
          <>
            <li>
            <Link to="/signup">Signup</Link>
            </li>
            <li>
            <Link to="/login">Login</Link>
            </li>
          </>
        )}
        {user && (
          <>
            <li>
              <Link to="/home">Home</Link>
            </li>
            <li>
              <Link to="/explore">Explore</Link>
            </li>
            <li>
              <Link to="/profile">Profile</Link>
            </li>
            <li>
              <Link to="/login" onClick={handleLogout}>Logout</Link>
            </li>
          </>
        )}
      </ul>}
    </nav>
  );
};

export default NavBar;