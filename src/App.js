// App.js

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Explore from './components/Explore';
import Profile from './components/Profile';
import WelcomePage from './components/WelcomePage.js';
import Signup from './components/SignUp';
import Login from './components/Login'; 
import NavBar from './components/NavBar';
import EventRegistrationPage from './components/RegistrationPage';
import { AuthProvider } from './Contexts/AuthContext'; 
import './App.css';
const App = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="app-container">
          <header>
            <div className="header-content">
              <h1>EventHub</h1>
              <NavBar />
            </div>
          </header>
          <main>
            <Routes>
              <Route path="/" element={<WelcomePage />} />
              <Route path="/home" element={<Home />} />
              <Route path="/explore" element={<Explore />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/registration/:eventId" element={<EventRegistrationPage />} />

              <Route path="/signup" element={<Signup/>} />
              <Route path="/login" element={<Login />} />
               
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
};
export default App;
