import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../Header';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import dayjs from 'dayjs';
import '../App.css';

function Main() {
  const [trips, setTrips] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://127.0.0.1:5000/trips')
      .then((response) => response.json())
      .then((data) => {
        setTrips(data);
      })
      .catch((error) => console.error('Error fetching trips:', error));
  }, []);

  const today = dayjs();
  const pastTrips = trips.filter((trip) => dayjs(trip.until_date).isBefore(today)).slice(-3);
  const futureTrips = trips.filter((trip) => dayjs(trip.until_date).isAfter(today));

  // Pass the trip ID when a card is clicked
  const handleTripClick = (tripId) => {
    navigate(`/TripDetail/${tripId}`); // Navigate to TripDetail with trip ID
  };

  return (
    <div className="App" style={{ minHeight: '100vh' }}>
      <Header />
      <div>
        {/* Past Trips */}
        <h2>Minulé cesty</h2>
        <div className="trips-grid">
          {pastTrips.map((trip, index) => (
            <Card 
              key={index} 
              className="trip-card" 
              sx={{ borderRadius: '16px' }}
              onClick={() => handleTripClick(trip.id)} // Pass trip ID on click
            >
              <div
                className="trip-image"
                style={{
                  backgroundImage: `url(${trip.photos.length ? `${trip.photos[0]}` : 'default-image.jpg'})`,
                }}
              >
                <CardContent className="trip-content">
                  <h3>{trip.name}</h3>
                  <p>{trip.country || 'Unknown country'}</p>
                  <p>{dayjs(trip.from_date).format("YYYY.MM.DD")} - {dayjs(trip.until_date).format("YYYY.MM.DD")}</p>
                </CardContent>
              </div>
            </Card>
          ))}
        </div>

        {/* Future Trips */}
        <h2>Plánované cesty</h2>
        <div className="trips-grid">
          {futureTrips.map((trip, index) => (
            <Card 
              key={index} 
              className="trip-card" 
              sx={{ borderRadius: '16px' }}
              onClick={() => handleTripClick(trip.id)} // Pass trip ID on click
            >
              <div
                className="trip-image"
                style={{
                  backgroundImage: `url(${trip.photos.length ? `${trip.photos[0]}` : 'default-image.jpg'})`,
                }}
              >
                <CardContent className="trip-content">
                  <h3>{trip.name}</h3>
                  <p>{trip.country || 'Unknown country'}</p>
                  <p>{dayjs(trip.from_date).format("YYYY.MM.DD")} - {dayjs(trip.until_date).format("YYYY.MM.DD")}</p>
                </CardContent>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Main;
