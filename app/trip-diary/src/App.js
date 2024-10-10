import React, { useEffect, useState } from 'react';
import Header from './Header';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
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

  return (
    <div className="App" style={{ minHeight: '100vh' }}>
      <Header />
      <div>
        <h1>Trips</h1>
        <div className="trips-grid">
          {trips.map((trip, index) => (
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
                  <p>{trip.from_date} - {trip.until_date}</p>
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
