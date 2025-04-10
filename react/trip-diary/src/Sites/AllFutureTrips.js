/*
  Autor: Dominik Borek (xborek12)
  Stránka zobrazující všechny budoucí cesty
*/

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CircularProgress from '@mui/material/CircularProgress';
import Button from '@mui/material/Button';
import dayjs from 'dayjs';
import '../assets/App.css';
import Header from '../Header';

function AllFutureTrips() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Získání dat
  useEffect(() => {
    fetch('http://127.0.0.1:5000/trips')
      .then((response) => response.json())
      .then((data) => {
        setTrips(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching trips:', error);
        setLoading(false);
      });
  }, []);

  const today = dayjs();
  const futureTrips = trips.filter((trip) => dayjs(trip.from_date).isAfter(today));

  // Zpracování kliknutí na kartu
  const handleTripClick = (tripId) => {
    navigate(`/TripDetail/${tripId}`);
  };

  return (
    <div className="App" style={{ minHeight: '100vh' }}>
      <Header />
      {loading ? (
        <div className="loading-container">
          <CircularProgress />
        </div>
      ) : (
        <div>
          <Button
            variant="outlined"
            color="primary"
            sx={{ marginTop: 3, display: 'block', marginLeft: 'auto', marginRight: 'auto' }}
            onClick={() => navigate('/')}
          >
            Zpět na hlavní stránku
          </Button>

          <h2 className="section-title">Plánované cesty</h2>
          <div className="trips-grid">
            {futureTrips.length === 0 ? (
              <p>Žádné budoucí cesty nebyly nalezeny.</p>
            ) : (
              futureTrips.map((trip, index) => (
                <Card
                  key={index}
                  className="trip-card"
                  sx={{ borderRadius: '16px' }}
                  onClick={() => handleTripClick(trip.id)}
                >
                  <div
                    className="trip-image"
                    style={{
                      backgroundImage: `url(${trip.photos?.[0] || 'default-image.jpg'})`,
                    }}
                  >
                    <CardContent className="trip-content">
                      <h3>{trip.name}</h3>
                      <p>{trip.country || 'Neznámá země'}</p>
                      <p>
                        {dayjs(trip.from_date).format('YYYY.MM.DD')} -{' '}
                        {dayjs(trip.until_date).format('YYYY.MM.DD')}
                      </p>
                    </CardContent>
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default AllFutureTrips;
