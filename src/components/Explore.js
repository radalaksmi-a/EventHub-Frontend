import React, { useEffect, useState } from 'react';
import './Explore.css';

const UserCard = ({ user, onAddFriend, onShowInterests }) => {
  const [showInterests, setShowInterests] = useState(false);
  const [userInterests, setUserInterests] = useState([]);

  const handleAddFriend = async () => {
    try {
      await onAddFriend(user.userid);
      console.log('Friend added successfully!');
    } catch (error) {
      console.error('Error adding friend:', error);
    }
  };
  
  const handleShowInterests = async () => {
    try {
      // Fetch interests of the user with userId
      const interestsResponse = await fetch(`http://localhost:6001/api/users/getall-interest/${user.userid}`);
      if (!interestsResponse.ok) {
        throw new Error(`HTTP error! Status: ${interestsResponse.status}`);
      }
      const userInterest = await interestsResponse.json();
      
      setUserInterests(userInterest);
      setShowInterests(true);
    } catch (error) {
      console.error(`Error fetching interests of user ${user.userid}:`, error);
    }
  };  

  return (
    <div className="user-card">
      <h3>{`${user.firstname} ${user.lastname}`}</h3>
      <div className="user-actions">
        <button onClick={handleAddFriend}>Add Friend</button>
        <button onClick={handleShowInterests}>Interests</button>
      </div>
      {showInterests && (
        <div className="user-interests">
          <ul>
            {userInterests && Array.isArray(userInterests) ? (
              userInterests.map((interest) => (
                <li key={interest.interestid}>{interest.interestname}</li>
              ))
            ) : (
              <li>No interests available</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};


const Explore = () => {
  const [usersWithSimilarInterests, setUsersWithSimilarInterests] = useState([]);

  const userData = localStorage.getItem('user');
  const user = userData ? JSON.parse(userData) : null;
  const loggedInUserId = user ? user.userid : null;

  useEffect(() => {
    const fetchUsersWithSimilarInterests = async () => {
      try {
        // Fetch users who have at least one similar interest
        const similarInterestsResponse = await fetch(`http://localhost:6001/api/explore?userId=${loggedInUserId}`);
        if (!similarInterestsResponse.ok) {
          throw new Error(`HTTP error! Status: ${similarInterestsResponse.status}`);
        }
        const usersWithSimilarInterests = await similarInterestsResponse.json();
        setUsersWithSimilarInterests(usersWithSimilarInterests);
      } catch (error) {
        console.error('Error fetching users with similar interests:', error);
      }
    };
    fetchUsersWithSimilarInterests();
  }, [loggedInUserId]);

  const handleAddFriend = async (friendUserId) => {

  };

  const handleShowInterests = async (userId) => {

  };

  return (
    <div className="explore-container">
      <h2>Users with Similar Interests</h2>
      {Array.isArray(usersWithSimilarInterests) && usersWithSimilarInterests.map((user) => (
        <UserCard
          key={user.userid}
          user={user}
          onAddFriend={handleAddFriend}
          onShowInterests={handleShowInterests}
        />
      ))}
    </div>
  );
};

export default Explore;
