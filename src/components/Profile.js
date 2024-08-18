// Profile.js

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MyEvents from './ProfileComponents/MyEvents';
import Interests from './ProfileComponents/Interests';
import AccountSettings from './ProfileComponents/AccountSettings';
import DeleteUser from './ProfileComponents/DeleteUser';
import './Profile.css';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [userDeleted, setUserDeleted] = useState(false);
  const navigate = useNavigate();

  const userData = localStorage.getItem('user');
  const getUserId = userData ? JSON.parse(userData) : null;
  const userId = getUserId ? getUserId.userid : null;

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);


  const handleDeleteUser = () => {
    setUserDeleted(true);
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="profile-container">
      <div className="user-info">
        <h2 className="welcome-text">Welcome, {user?.firstname}!</h2>
        <p className="email-text">Email: {user?.email}</p>
      </div>
      <MyEvents />
      <Interests />
      <AccountSettings />
      {!userDeleted && <DeleteUser to="/login" onDeleteUser={handleDeleteUser} userId={`${userId}`} />}
    </div>
  );
};

export default Profile;
