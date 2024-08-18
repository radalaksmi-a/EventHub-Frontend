import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import './Home.css';

const HomePage = () => {
  const [searchCity, setSearchCity] = useState('');
  const [events, setEvents] = useState([]);
  const [userInterests, setUserInterests] = useState([]);
  const navigate = useNavigate(); 

  const userData = localStorage.getItem('user');
  const user = userData ? JSON.parse(userData) : null;
  const userId = user ? user.userid : null;

  useEffect(() => {
    // Fetch logged-in user's interests
    const fetchUserInterests = async () => {
      try {
        const response = await fetch(`http://localhost:6001/api/users/getall-interest/${userId}`);
        const data = await response.json();
        console.log(data);
        if (Array.isArray(data)) {
          // Update userInterests with user's interests
          setUserInterests(data.map((interest) => interest.interestid));
        } else {
          console.error(`Invalid response format from /api/users/getall-interest/${userId}:`, data);
        }
      } catch (error) {
        console.error('Error fetching user interests:', error);
      }
    };

    fetchUserInterests();
  }, []); // Fetch user interests on component mount

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        // If the user has interests, fetch events for each interest
        // console.log("UserInterest : ", userInterests);
        if (userInterests.length > 0) {
          const eventsPromises = userInterests.map(async (interestId) => {
            const response = await fetch(`http://localhost:6001/api/events/by-interest/${interestId}`);
            const data = await response.json();
            return data;
          });

          const eventsData = await Promise.all(eventsPromises);
          // Combine events from different interests into a single array
          const combinedEvents = eventsData.reduce((acc, curr) => [...acc, ...curr], []);
          setEvents(combinedEvents);
        } else {
          // If the user has no interests, fetch all events
          const response = await fetch('http://localhost:6001/api/events/all');
          const data = await response.json();
          setEvents(data);
        }
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    fetchEvents();
  }, [userInterests]); // Fetch events whenever userInterests change

  // Filter events based on the entered city
  const filteredEvents = Array.isArray(events)
    ? searchCity
      ? events.filter((event) => event.city.toLowerCase().includes(searchCity.toLowerCase()))
      : events
    : [];

  // Function to handle card click and navigate to registration page
  const handleCardClick = (eventId) => {
    // console.log(eventId);
    navigate(`/registration/${eventId}`);
  };

  return (
    <Container>
      <TextField
        label="Filter by City"
        variant="outlined"
        fullWidth
        value={searchCity}
        onChange={(e) => setSearchCity(e.target.value)}
        style={{ marginBottom: '16px', marginTop: '16px' }}
      />

      <Grid container spacing={3}>
        {filteredEvents.map((event) => (
          <Grid item key={event?.eventid} xs={12} sm={6} md={4} lg={3}>
            {event?.eventid !== undefined && (
              <Card
                className="card"
                style={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.3s',
                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                  borderRadius: '8px',
                  overflow: 'hidden',
                }}
                onClick={() => handleCardClick(event?.eventid)}
              >
                <CardMedia
                  component="img"
                  height="140"
                  image={`${event.eventurl}`}
                  style={{ objectFit: 'cover' }}
                />
                <CardContent style={{ flexGrow: 1, padding: '16px' }}>
                  <Typography variant="h6" component="div">
                    {event?.eventname}
                  </Typography>
                  <Typography variant="body1" color="textSecondary" paragraph>
                    {event?.city}
                  </Typography>
                  <Typography variant="subtitle1" color="textSecondary">
                    {event?.eventdescription}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" paragraph>
                    {event?.description}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {new Date(event?.eventdate).toLocaleString()}
                  </Typography>
                </CardContent>
              </Card>
            )}
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default HomePage;