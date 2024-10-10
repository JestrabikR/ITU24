import React, { useEffect, useState } from 'react';
import Header from './Header';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import dayjs from "dayjs";
import './App.css';

function App() {
  const [trips, setTrips] = useState([]);
  
  useEffect(() => {
    // Fetch data from the API
    fetch('http://127.0.0.1:5000/trips')
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setTrips(data);
      })
      .catch((error) => console.error('Error fetching trips:', error));
  }, []);

  const today = dayjs();
  const pastTrips = trips.filter(trip => dayjs(trip.until_date).isBefore(today)).slice(-3); // Minulé cesty, max 3
  const futureTrips = trips.filter(trip => dayjs(trip.until_date).isAfter(today)); // Plánované cesty

  return (
    <div className="App" style={{ minHeight: '100vh' }}> 
      <Header />
      <div>
        {/* Minulé cesty */}
        <h2>Minulé cesty</h2>
        <div className="trips-grid">
          {pastTrips.map((trip, index) => (
            <Card key={index} className="trip-card" sx={{ borderRadius: '16px' }}>
              <div
                className="trip-image"
                style={{
                  backgroundImage: `url(${trip.photos.length ? `data:image/jpeg;base64,${trip.photos[0]}` : 'default-image.jpg'})`,
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

        {/* Plánované cesty */}
        <h2>Plánované cesty</h2>
        <div className="trips-grid">
          {futureTrips.map((trip, index) => (
            <Card key={index} className="trip-card" sx={{ borderRadius: '16px' }}>
              <div
                className="trip-image"
                style={{
                  backgroundImage: `url(${trip.photos.length ? `data:image/jpeg;base64,${trip.photos[0]}` : 'default-image.jpg'})`,
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

export default App;
