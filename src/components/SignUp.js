// Signup.js

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SignUp.css';


const Signup = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignup = async () => {
    try {
      // Perform API call to store user information in the database
      const response = await fetch('http://localhost:6001/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstname: firstName,
          lastname: lastName,
          email: email,
          password: password,
        }),
      });

      if (response.ok) {
        // Assuming the server sends back a JSON response with authentication status
        const data = await response.json();
  
        if (data.success) {
          console.log('Signup successful!');
          navigate('/login');
        } else {
          console.error('Invalid credentials.');
          setError(data.message || 'Invalid details.');
        }
      } else {
        console.error('Invalid credentials.');
        const data = await response.json();
        setError(data.message || 'Invalid credentials.');
      }
    } catch (error) {
      console.error('Error during signup:', error);
      setError('An error occurred during signup.');
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        <h2>Signup</h2>
        {error && <p className="error-message">{error}</p>}
        <form>
          <div className="label-container">
            <label>First Name:</label>
          </div>
          <div className="input-container">
            <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
          </div>
          <div className="label-container">
            <label>Last Name:</label>
          </div>
          <div className="input-container">
            <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} />
          </div>
          <div className="label-container">
            <label>Email:</label>
          </div>
          <div className="input-container">
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="label-container">
            <label>Password:</label>
          </div>
          <div className="input-container">
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <button type="button" onClick={handleSignup} className="signup-button">
            Signup
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;