import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './RegistrationPage.css';

const RegistrationPage = () => {
  const [eventDetails, setEventDetails] = useState(null);
  const [registeredUsers, setRegisteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const { eventId } = useParams();

  const userData = localStorage.getItem('user');
  const user = userData ? JSON.parse(userData) : null;
  const loggedUserId = user ? user.userid : null;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const eventResponse = await fetch(`http://localhost:6001/api/events/details/${eventId}`);
        const eventData = await eventResponse.json();
        setEventDetails(eventData);

        const usersResponse = await fetch(`http://localhost:6001/api/events/participants/${eventId}/${loggedUserId}`);
        const usersData = await usersResponse.json();
        setRegisteredUsers(usersData);

        // Check local storage for registration status
        const storedIsRegistered = localStorage.getItem(`eventRegistration_${eventId}`);
        if (storedIsRegistered) {
          setIsRegistered(true);
        }

        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Error fetching data. Please try again later.');
        setLoading(false);
      }
    };

    fetchData();
  }, [eventId]);

  const handleRegister = async () => {
    try {
      const response = await fetch(`http://localhost:6001/api/events/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userid: loggedUserId, 
          eventid: eventId,
        }),
      });

      if (response.ok) {
        console.log('User registered successfully');
        setIsRegistered(true);
        localStorage.setItem(`eventRegistration_${eventId}`, 'true');
      } else {
        console.error('Failed to register user');
      }
    } catch (error) {
      console.error('Error registering user:', error);
    }
  };


  const addFriend = async (friendId) => {
  try {
    const response = await fetch('http://localhost:6001/api/events/add-friends', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userid: loggedUserId, 
        eventid: eventId,
        friendUserIds: [friendId],
      }),
    });

    if (response.ok) {
      console.log('Friend added successfully');

      // Fetch updated user data after adding friends
      const updatedUsersResponse = await fetch(`http://localhost:6001/api/events/participants/${eventId}/${loggedUserId}`);
      const updatedUsersData = await updatedUsersResponse.json();
      
      // Update the state with the newly fetched data
      setRegisteredUsers(updatedUsersData);
    } else {
      console.error('Failed to add friend');
    }
  } catch (error) {
    console.error('Error adding friend:', error);
  }
};

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="registration-page-container">
      <div className="event-details-container">
        <img src={eventDetails.eventurl} alt="#" className="event-image" />
        <h2 className="event-name">{eventDetails.eventname}</h2>
        <p className="event-city">{eventDetails.city}</p>
        <p className="event-description">{eventDetails.eventdescription}</p>
        <p className="event-description">{new Date(eventDetails.eventdate).toLocaleString()}</p>
        <button
          className={`register-button ${isRegistered ? 'registered' : ''}`}
          onClick={handleRegister}
          disabled={isRegistered}>
          {isRegistered ? 'Registered' : 'Register'}
        </button>

      </div>

      <h3 className="registered-users-heading">Registered Users:</h3>
      <ul className="registered-users-list">
        {registeredUsers.map((user) => (
          <li key={user.email} className="registered-user-item">
            <span className="user-name">{user.name}</span>
            {user.id !== loggedUserId && (
                <button
                className={`add-friend-button ${user.isFriend ? 'friend' : ''}`}
                onClick={() => addFriend(user.id)}
                disabled={user.isFriend}
                >
                {user.isFriend ? 'Friend' : 'Add Friend'}
                </button>
            )}
         </li>
        ))}
      </ul>
    </div>
  );
};

export default RegistrationPage;
