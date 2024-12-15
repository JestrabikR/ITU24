/*
  Autor: Dominik Borek (xborek12)
  Stránka zobrazující mapu všech cest
*/

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Polyline, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import Button from '@mui/material/Button';
import Header from '../Header';
import GridViewIcon from '@mui/icons-material/GridView';
const customIcon = new L.Icon({
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
  shadowSize: [41, 41],
});

const FitBounds = ({ bounds }) => {
  const map = useMap();
  useEffect(() => {
    if (bounds.length) {
      const paddedBounds = L.latLngBounds(bounds).pad(0.2);
      map.fitBounds(paddedBounds);
    }
  }, [bounds, map]);
  return null;
};

const AllTripsMap = () => {
  const [trips, setTrips] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://127.0.0.1:5000/trips')
      .then((response) => response.json())
      .then((data) => setTrips(data))
      .catch((error) => console.error('Error fetching trips:', error));
  }, []);

  const getTripData = () => {
    return trips.map((trip, tripIndex) => {
      const gpsPoints = trip.subtrips
        .filter((subtrip) => subtrip.gps)
        .map((subtrip) =>
          Array.isArray(subtrip.gps) ? subtrip.gps : [subtrip.gps.lat, subtrip.gps.lng]
        );

      const color = `hsl(${(tripIndex * 360) / trips.length}, 70%, 50%)`;

      return { gpsPoints, color, trip };
    });
  };

  const tripData = getTripData();
  const allGpsPoints = tripData.flatMap(({ gpsPoints }) => gpsPoints);

  return (
    <div>
      <Header />
      <div style={{ minHeight: '100vh', textAlign: 'center' }}>
        <h1>Mapa všech cest</h1>
        <button className="allMapButton" onClick={() => navigate('/')}>
          <GridViewIcon />
        </button>
        <br/>
        <MapContainer center={[50, 10]} zoom={3} style={{ height: '80vh', width: '100%' }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {tripData.map(({ gpsPoints, color, trip }, tripIndex) => (
            <React.Fragment key={tripIndex}>
              {trip.subtrips.map((subtrip, subIndex) => {
                const gps = subtrip.gps
                  ? Array.isArray(subtrip.gps)
                    ? subtrip.gps
                    : [subtrip.gps.lat, subtrip.gps.lng]
                  : null;
                return gps ? (
                  <Marker key={`${tripIndex}-${subIndex}`} position={gps} icon={customIcon}>
                    <Popup>
                      <div style={{ textAlign: 'center' }}>
                        <strong>{subtrip.name}</strong>
                        <br />
                        <Button
                          variant="text"
                          color="primary"
                          onClick={() => navigate(`/TripDetail/${trip.id}`)}
                        >
                          Zobrazit výlet: {trip.name}
                        </Button>
                      </div>
                    </Popup>
                  </Marker>
                ) : null;
              })}
              <Polyline positions={gpsPoints} color={color} weight={4} />
            </React.Fragment>
          ))}
          <FitBounds bounds={allGpsPoints} />
        </MapContainer>
      </div>
    </div>
  );
};

export default AllTripsMap;
