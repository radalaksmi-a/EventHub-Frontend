// AccountSettings.js
import React, { useState } from 'react';
import './AccountSettings.css';

const AccountSettings = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');

  const userData = localStorage.getItem('user');
  const user = userData ? JSON.parse(userData) : null;
  const userId = user ? user.userid : null;

  const handleChangePassword = async () => {
    if (!userId) {
      console.error('User ID not found.');
      return;
    }

    try {
      const response = await fetch(`http://localhost:6001/api/users/change-password/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setMessage(data.message);
      } else {
        const data = await response.json();
        setMessage(data.message);
      }
    } catch (error) {
      console.error('Error changing password:', error);
    }
  };

  return (
    <div className="account-settings-container">
      <h2>Account Settings</h2>
      <div className="change-password-section">
        <h3>Change Password</h3>
        <div className="password-fields">
          <label htmlFor="current-password">Current Password:</label>
          <input
            type="password"
            id="current-password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
          <label htmlFor="new-password">New Password:</label>
          <input
            type="password"
            id="new-password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>
        <button onClick={handleChangePassword} className="change-password-button">
          Change Password
        </button>
        {message && <p className="password-change-message">{message}</p>}
      </div>
    </div>
  );
};

export default AccountSettings;
