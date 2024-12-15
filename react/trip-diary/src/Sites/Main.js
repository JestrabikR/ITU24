/*
  Autor: Dominik Borek (xborek12)
  Hlavní stránka s kartami
*/

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../Header';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import '../assets/App.css';
import dayjs from 'dayjs';

function Main() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mapView, setMapView] = useState(false);
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
  const pastTrips = trips.filter((trip) => dayjs(trip.until_date).isBefore(today));
  const futureTrips = trips.filter((trip) => dayjs(trip.from_date).isAfter(today));
  const currentTrips = trips.filter(
    (trip) => dayjs(trip.from_date).isBefore(today) && dayjs(trip.until_date).isAfter(today)
  );

  // Zpracování kliknutí na kartu
  const handleTripClick = (tripId) => {
    navigate(`/TripDetail/${tripId}`);
  };

  // Zpracování kliknutí na tlačítko pro zobrazení všech minulých cest
  const handleViewAllPastClick = () => {
    navigate('/AllPastTrips');
  };

  // Zpracování kliknutí na tlačítko pro zobrazení všech budoucích cest
  const handleViewAllFutureClick = () => {
    navigate('/AllFutureTrips');
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
          {currentTrips.length > 0 && (
            <>
              <div className="title-container">
                <h2 className="section-title">Právě probíhající cesta</h2>
                <button className="allMapButton" onClick={() => navigate('/AllTripsMap')}>
                  Zobrazení mapy výletů
                </button>
              </div>
              <div className="trips-grid">
                <Card
                  className="trip-card"
                  sx={{ borderRadius: '16px' }}
                  onClick={() => handleTripClick(currentTrips[0].id)}
                >
                  <div
                    className="trip-image"
                    style={{
                      backgroundImage: `url(${currentTrips[0].photos?.[0] || 'default-image.jpg'})`,
                    }}
                  >
                    <CardContent className="trip-content">
                      <h3>{currentTrips[0].name}</h3>
                      <p>{currentTrips[0].country || 'Neznámá země'}</p>
                      <p>
                        {dayjs(currentTrips[0].from_date).format('YYYY.MM.DD')} -{' '}
                        {dayjs(currentTrips[0].until_date).format('YYYY.MM.DD')}
                      </p>
                    </CardContent>
                  </div>
                </Card>
              </div>
            </>
          )}

          <h2 className="section-title">Plánované cesty</h2>
          <Button
            variant="outlined"
            color="primary"
            sx={{ marginTop: 3, display: 'block', marginLeft: 'auto', marginRight: 'auto' }}
            onClick={handleViewAllFutureClick}
          >
            Zobrazit všechny →
          </Button>
          <div className="trips-grid">
            {futureTrips.slice(0, 3).map((trip, index) => (
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
            ))}
          </div>

          <h2 className="section-title">Minulé cesty</h2>
          <Button
            variant="outlined"
            color="primary"
            sx={{ marginTop: 3, display: 'block', marginLeft: 'auto', marginRight: 'auto' }}
            onClick={handleViewAllPastClick}
          >
            Zobrazit všechny →
          </Button>
          <div className="trips-grid">
            {pastTrips.slice(-3).map((trip, index) => (
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
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Main;
