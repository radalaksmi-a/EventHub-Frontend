// DeleteUser.js
import React from 'react';
import './DeleteUser.css';

const DeleteUser = ({ onDeleteUser, userId }) => {
  const handleDeleteUser = async () => {
    try {
      const response = await fetch(`http://localhost:6001/api/users/delete-user/${userId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        onDeleteUser();
        console.log(data.message);
      } else {
        const data = await response.json();
        console.error(data.error || 'Error deleting user');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  return (
    <div className="delete-user-container">
      <h2>Delete Account</h2>
      <p>Are you sure you want to delete your account? This action cannot be undone.</p>
      <button onClick={handleDeleteUser} className="delete-user-button">
        Delete Account
      </button>
    </div>
  );
};

export default DeleteUser;
