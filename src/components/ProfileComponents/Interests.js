import React, { useState, useEffect } from 'react';
import './Interests.css';

const Interests = () => {
  const [allInterests, setAllInterests] = useState([]);
  const [selectedInterest, setSelectedInterest] = useState('');
  const [userInterestsList, setUserInterestsList] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const userData = localStorage.getItem('user');
  const user = userData ? JSON.parse(userData) : null;
  const userId = user ? user.userid : null;

  useEffect(() => {
    const fetchAllInterests = async () => {
      try {
        const response = await fetch('http://localhost:6001/api/get-interests');
        const data = await response.json();

        if (Array.isArray(data.interests)) {
          const interests = data.interests.map((interest) => ({
            id: interest.interestId,
            name: interest.interestName,
          }));

          setAllInterests(interests);
          setLoading(false); // Set loading to false once interests are fetched
        } else {
          console.error('Invalid response format from /api/get-interests:', data);
          setLoading(false); // Set loading to false even if there's an error
        }
      } catch (error) {
        console.error('Error fetching interests:', error);
        setLoading(false); // Set loading to false in case of an error
      }
    };

    fetchAllInterests();
  }, []);

  useEffect(() => {
    const fetchUserInterests = async () => {
      try {
        const response = await fetch(`http://localhost:6001/api/users/getall-interest/${userId}`);
        const data = await response.json();
        console.log("data", data);
        if (Array.isArray(data)) {
          // Update userInterestsList with user's interests
          setUserInterestsList(data.map((interest) => interest.interestname));
        } else {
          console.error(`Invalid response format from /api/users/getall-interest/${userId}:`, data);
        }
      } catch (error) {
        console.error('Error fetching user interests:', error);
      }
    };

    fetchUserInterests();
  }, []); // Fetch user interests on component mount

  const handleRemoveInterest = async (interestToRemove) => {
    try {
      const interestId = allInterests.find((interest) => interest.name === interestToRemove)?.id;

      // Remove interest from the server using interest ID
      await fetch(`http://localhost:6001/api/users/remove-interest/${userId}/${interestId}`, {
        method: 'PUT',
      });

      // Update userInterestsList locally
      const updatedInterests = userInterestsList.filter((interest) => interest !== interestToRemove);
      setUserInterestsList(updatedInterests);
    } catch (error) {
      console.error('Error removing interest:', error);
    }
  };

  const handleAddInterest = async () => {
    if (selectedInterest && !userInterestsList.includes(selectedInterest)) {
      try {
        // Find the corresponding interest ID
        const interestId = allInterests.find((interest) => interest.name === selectedInterest)?.id;

        // Add interest to the server using interest ID
        await fetch(`http://localhost:6001/api/users/add-interests/${userId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            interest: interestId,
          }),
        });

        // Update userInterestsList locally
        setUserInterestsList((prevInterests) => [...prevInterests, selectedInterest]);
        setSelectedInterest('');
      } catch (error) {
        console.error('Error adding interest:', error);
      }
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="interests-container">
      <h2>Interests</h2>
      <div className="user-interests">
        {userInterestsList.map((interest) => (
          <div key={`${interest}-${Date.now()}`} className="interest">
            <span>{interest}</span>
            <button onClick={() => handleRemoveInterest(interest)} className="remove-button">
              X
            </button>
          </div>
        ))}
      </div>

      <div className="add-interest-container">
        <select value={selectedInterest} onChange={(e) => setSelectedInterest(e.target.value)}>
          <option value="" disabled>
            Select Interest
          </option>
          {allInterests.map((interest) => (
            <option key={interest.id} value={interest.name}>
              {interest.name}
            </option>
          ))}
        </select>
        <button onClick={handleAddInterest} className="add-button">
          Add Interest
        </button>
      </div>
    </div>
  );
};

export default Interests;
