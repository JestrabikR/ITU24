import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './Header';
import AddTrip from './Sites/AddTrip'; // Import the AddTrip component
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import dayjs from 'dayjs';
import './App.css';

function Main() {
  const [trips, setTrips] = useState([]);

  useEffect(() => {
    fetch('http://127.0.0.1:5000/trips')
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setTrips(data);
      })
      .catch((error) => console.error('Error fetching trips:', error));
  }, []);

  const today = dayjs();
  const pastTrips = trips.filter((trip) => dayjs(trip.until_date).isBefore(today)).slice(-3);
  const futureTrips = trips.filter((trip) => dayjs(trip.until_date).isAfter(today));

  return (
    <Router>
      <div className="App" style={{ minHeight: '100vh' }}>
        <Header />
        <div>
          <Routes>
            <Route path="/" element={
              <div>
                {/* Past Trips */}
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

                {/* Future Trips */}
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
            } />
            <Route path="/AddTrip" element={<AddTrip />} />
            {/* Add other routes as needed */}
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default Main;
