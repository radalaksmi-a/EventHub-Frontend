import React, { useEffect, useState } from 'react';
import './MyEvents.css';

const MyEvents = () => {
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const userData = localStorage.getItem('user');
  const user = userData ? JSON.parse(userData) : null;
  const userId = user ? user.userid : null;

  useEffect(() => {
    const fetchRegisteredEvents = async () => {
      try {
        const response = await fetch(`http://localhost:6001/api/events/registered/${userId}`);
        const userData = await response.json();
        console.log(userData); 
        // Extract registered events from user data
        setRegisteredEvents(userData || []);
      } catch (error) {
        console.error('Error fetching registered events:', error);
      }
    };

    fetchRegisteredEvents();
  }, [userId]);

  const handleCancelRegistration = async (eventId) => {
    try {
      // Call the API to cancel registration
      const response = await fetch(`http://localhost:6001/api/events/cancel-registration`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userid: userId,
          eventid: eventId,
        }),
      });

      if (response.ok) {
        console.log('Registration canceled successfully');
        // Remove the canceled event from the state
        setRegisteredEvents((prevEvents) => prevEvents.filter((event) => event.eventid !== eventId));
      } else {
        console.error('Failed to cancel registration');
      }
    } catch (error) {
      console.error('Error canceling registration:', error);
    }
  };

  return (
    <div className="my-events-container">
      <h2>My Events</h2>
      {registeredEvents.map((event) => (
        <div key={event.eventid} className="event-card">
          <div className="event-details">
            <h3>{event.eventname}</h3>
            <p>{new Date(event.eventdate).toLocaleString()}</p>
          </div>
          <button onClick={() => handleCancelRegistration(event.eventid)} className="cancel-button">
            Cancel Registration
          </button>
        </div>
      ))}
    </div>
  );
};

export default MyEvents;
