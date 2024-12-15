/*
  Autor: Dominik Borek (xborek12)
  Stránka detailu cesty
*/

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../Header';
import axios from 'axios';
import dayjs from 'dayjs';
import { MapContainer, TileLayer, Marker, Polyline, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import {
  Modal,
  Box,
  IconButton,
  Button,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import MapIcon from '@mui/icons-material/Map';
import 'react-medium-image-zoom/dist/styles.css';


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

const TripInfo = ({ trip }) => (
  <div style={{ textAlign: 'center' }}>
    <h1 style={{ margin: 0 }}>Detail cesty {trip.name}</h1>
    <h3 style={{ margin: 0 }}>
      {dayjs(trip.from_date).format("YYYY.MM.DD")} - {dayjs(trip.until_date).format("YYYY.MM.DD")}
    </h3>
    <h3 style={{ margin: 0 }}>{trip.budget} Kč</h3>
  </div>
);

const TripMap = ({ subtrips }) => (
  <div style={{ width: '80%' }}>
    <MapContainer
      center={
        subtrips[0].gps &&
        (Array.isArray(subtrips[0].gps)
          ? [subtrips[0].gps[0], subtrips[0].gps[1]]
          : [subtrips[0].gps.lat, subtrips[0].gps.lng]) 
          ? Array.isArray(subtrips[0].gps)
            ? [subtrips[0].gps[0], subtrips[0].gps[1]]
            : [subtrips[0].gps.lat, subtrips[0].gps.lng]
          : [0, 0]
      }
      zoom={6}
      style={{ height: '400px', width: '100%' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />

      {subtrips
        .filter(subtrip => subtrip.gps && (Array.isArray(subtrip.gps) ? subtrip.gps[0] && subtrip.gps[1] : subtrip.gps.lat && subtrip.gps.lng)) // Filtrujeme pouze subtrips s platnými GPS
        .map((subtrip, index) => (
          <Marker
            key={index}
            position={
              Array.isArray(subtrip.gps)
                ? [subtrip.gps[0], subtrip.gps[1]]
                : [subtrip.gps.lat, subtrip.gps.lng]
            }
            icon={customIcon}
          >
            <div>{subtrip.name}</div>
          </Marker>
        ))}

      <Polyline
        positions={subtrips
          .filter(subtrip => subtrip.gps && (Array.isArray(subtrip.gps) ? subtrip.gps[0] && subtrip.gps[1] : subtrip.gps.lat && subtrip.gps.lng))
          .map(subtrip => (Array.isArray(subtrip.gps) ? [subtrip.gps[0], subtrip.gps[1]] : [subtrip.gps.lat, subtrip.gps.lng]))}
        color="blue"
      />

      <FitBounds
        bounds={subtrips
          .filter(subtrip => subtrip.gps && (Array.isArray(subtrip.gps) ? subtrip.gps[0] && subtrip.gps[1] : subtrip.gps.lat && subtrip.gps.lng))
          .map(subtrip => (Array.isArray(subtrip.gps) ? [subtrip.gps[0], subtrip.gps[1]] : [subtrip.gps.lat, subtrip.gps.lng]))}
      />
    </MapContainer>
  </div>
);



const Gallery = ({ subtrips}) => {
  return (
    <div style={{ display: 'flex', justifyContent: 'flex-start', flexWrap: 'wrap', width: '80%' }}>
      {subtrips.map((subtrip, index) =>
        subtrip.photos.map((photo, photoIndex) => (
          <div key={photoIndex} style={{ width: 'calc(25% - 10px)', margin: '5px' }}>
            <img
              src={photo}
              alt={`Photo ${photoIndex + 1}`}
              style={{
                width: '100%',
                height: '200px',
                objectFit: 'cover',
                borderRadius: '8px',
                cursor: 'pointer',
              }}
            />
          </div>
        ))
      )}
    </div>
  );
};

const SubtripDetail = ({ subtrip, open, handleClose }) => {
  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={{ padding: 2, bgcolor: 'black', border: '2px solid #000', boxShadow: 24, borderRadius: '8px', width: '80%', maxWidth: '600px', margin: 'auto', marginTop: '100px' }}>
        <h2>{subtrip.name}</h2>
        
        {subtrip.gps && (
          Array.isArray(subtrip.gps) ? (
            subtrip.gps[0] && subtrip.gps[1] ? (
              <MapContainer center={[subtrip.gps[0], subtrip.gps[1]]} zoom={15} style={{ height: '200px', width: '100%' }}>
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <Marker position={[subtrip.gps[0], subtrip.gps[1]]} icon={customIcon} />
              </MapContainer>
            ) : (
              <p>No valid GPS data available.</p>
            )
          ) : (
            subtrip.gps.lat && subtrip.gps.lng ? (
              <MapContainer center={[subtrip.gps.lat, subtrip.gps.lng]} zoom={15} style={{ height: '200px', width: '100%' }}>
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <Marker position={[subtrip.gps.lat, subtrip.gps.lng]} icon={customIcon} />
              </MapContainer>
            ) : (
              <p>No valid GPS data available.</p> 
            )
          )
        )}

        <IconButton onClick={handleClose} sx={{ position: 'absolute', top: 10, right: 10 }}>
          <CloseIcon />
        </IconButton>
      </Box>
    </Modal>
  );
};



const AdvantagesDisadvantages = ({ advantages, disadvantages }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', width: '80%', marginTop: '20px' }}>
    <div style={{ flex: 1 }}>
      <h2 style={{ margin: '0', textAlign: 'left' }}>Výhody</h2>
      {advantages.map((advantage, index) => (
        <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
          <span style={{ color: 'green', fontSize: '20px', marginRight: '5px' }}>+</span>
          <span style={{ color: 'white' }}>{advantage}</span>
        </div>
      ))}
    </div>
    <div style={{ flex: 1 }}>
      <h2 style={{ margin: '0', textAlign: 'left' }}>Nevýhody</h2>
      {disadvantages.map((disadvantage, index) => (
        <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
          <span style={{ color: 'red', fontSize: '20px', marginRight: '5px' }}>-</span>
          <span style={{ color: 'white' }}>{disadvantage}</span>
        </div>
      ))}
    </div>
  </div>
);

function TripDetail() {
  const { id } = useParams();
  const [trip, setTrip] = useState(null);
  const [error, setError] = useState(null);
  const [subtripDetail, setSubtripDetail] = useState(null);
  const [openSubtripModal, setOpenSubtripModal] = useState(false);

  useEffect(() => {
    axios.get(`http://127.0.0.1:5000/trips`)
      .then(response => {
        const foundTrip = response.data.find(trip => trip.id === id);
        if (foundTrip) {
          setTrip(foundTrip);
        } else {
          setError('Cesta nebyla nalezena.');
        }
      })
      .catch(err => {
        console.error('Error fetching trip data:', err);
        setError('Nepodařilo se načíst data cesty.');
      });
  }, [id]);

  const photos = trip ? trip.subtrips.flatMap(subtrip => subtrip.photos) : [];

  const handleSubtripDetailOpen = (subtrip) => {
    setSubtripDetail(subtrip);
    setOpenSubtripModal(true);
  };

  return (
    <div className="App" style={{ minHeight: '100vh' }}>
      <Header />
      {error && <p>{error}</p>}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {trip ? <TripInfo trip={trip} /> : <p>Načítání...</p>}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
        {trip && trip.subtrips.length > 0 && <TripMap subtrips={trip.subtrips} />}
        {trip && trip.subtrips.length > 0 && (
          <div style={{ marginTop: '20px', width: '80%', textAlign: 'left' }}>
            <h2 style={{ margin: '0' }}>Podvýlety:</h2>
            <hr style={{border: '2px solid white'}}/>
            {trip.subtrips.map((subtrip, index) => (
              <div key={index} style={{ marginBottom: '10px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', marginBottom: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                    <Button variant="outlined" color="primary" onClick={() => handleSubtripDetailOpen(subtrip)}>
                      <MapIcon />
                    </Button>
                    <h3 style={{ margin: '10px', marginBottom: '0', marginRight: '0', marginTop: '0' }}>{subtrip.name}</h3>
                  </div>
                  <p style={{ margin: '10px', marginBottom: '0', marginRight: '0', marginTop: '0' }}>Popis: {subtrip.description}</p>
                  {subtrip.photos && subtrip.photos.length > 0 && (
                    <Gallery
                      subtrips={[subtrip]}
                    />
                  )}
                </div>
                <hr style={{color: 'white'}}/>
              </div>
            ))}
          </div>
        )}
        {trip && trip.photos && trip.photos.length > 0 && (
        <div style={{ marginTop: '20px', width: '80%', textAlign: 'left' }}>
          <h3>Ostatní fotografie</h3>
          <Gallery
            subtrips={[{ photos: trip.photos }]}
          />
        </div>
      )}
        {trip && (
          <AdvantagesDisadvantages 
            advantages={trip.advantages} 
            disadvantages={trip.disadvantages} 
          />
        )}
        {trip && (
          <div style={{ marginTop: '20px', width: '80%', textAlign: 'left' }}>
            <h2 style={{margin: '0'}}>Popis</h2>
            <p>{trip.description}</p>
          </div>
        )}
      </div>
      {subtripDetail && (
        <SubtripDetail subtrip={subtripDetail} open={openSubtripModal} handleClose={() => setOpenSubtripModal(false)} />
      )}
    </div>
  );
}

export default TripDetail;
