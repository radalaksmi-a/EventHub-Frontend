import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Contexts/AuthContext';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();
  const handleLogin = async () => {
    try {

      // API call to check user credentials
      const response = await fetch('http://localhost:6001/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

     // Handle response as needed
    if (response.ok) {
      // Assuming the server sends back a JSON response with authentication status
      const data = await response.json();

      if (data.success) {
        console.log('Login successful!');
        localStorage.setItem("user",JSON.stringify(data.user));
        // Redirect to home page or perform other actions
        navigate('/home');
      } else {
        console.error('Invalid credentials.');
        setError(data.message || 'Invalid email or password.');
      }
    } else {
      console.error('Invalid credentials.');
      const data = await response.json();
      setError(data.message || 'Invalid credentials.');
    }
  } catch (error) {
    console.error('Error during login:', error);
    setError('An error occurred during login.');
  }
};


  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Login</h2>
        {error && <p className="error-message">{error}</p>}
        <form>
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
          <button type="button" onClick={handleLogin} className="login-button">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
