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
  Icon,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import InfoIcon from '@mui/icons-material/Info';
import 'react-medium-image-zoom/dist/styles.css';
import Zoom from 'react-medium-image-zoom';
import AddIcon from '@mui/icons-material/Add';


//TODO: edit datum, budget, přídání podvýletu, odstranění podvýletu, přidání/oddělání podvýletu jako favourite,
//TODO:  přidání/oddělání fotky do galerie, přidání/úprava/odstranění výhod a nevýhod, úprava popisu, změnit ikonu + na x, který vrátí na předchozí stránku

const customIcon = new L.Icon({
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
  shadowSize: [41, 41],
});

// Komponenta pro automatické přizpůsobení mapy
const FitBounds = ({ bounds }) => {
  const map = useMap();
  useEffect(() => {
    if (bounds.length) {
      const paddedBounds = L.latLngBounds(bounds).pad(0.2); // Oříznout mapu o 20% z každé strany
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
          ? [subtrips[0].gps[0], subtrips[0].gps[1]] // Pokud GPS je pole [lat, lng]
          : [subtrips[0].gps.lat, subtrips[0].gps.lng]) // Pokud GPS je objekt { lat, lng }
          ? Array.isArray(subtrips[0].gps)
            ? [subtrips[0].gps[0], subtrips[0].gps[1]]
            : [subtrips[0].gps.lat, subtrips[0].gps.lng]
          : [0, 0] // Pokud první subtrip nemá GPS, nastavíme výchozí hodnoty
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

      {/* Filtrujeme a vykreslujeme Polyline pouze pro subtrips s platnými GPS */}
      <Polyline
        positions={subtrips
          .filter(subtrip => subtrip.gps && (Array.isArray(subtrip.gps) ? subtrip.gps[0] && subtrip.gps[1] : subtrip.gps.lat && subtrip.gps.lng))
          .map(subtrip => (Array.isArray(subtrip.gps) ? [subtrip.gps[0], subtrip.gps[1]] : [subtrip.gps.lat, subtrip.gps.lng]))}
        color="blue"
      />

      {/* FitBounds pouze pro subtrips s platnými GPS */}
      <FitBounds
        bounds={subtrips
          .filter(subtrip => subtrip.gps && (Array.isArray(subtrip.gps) ? subtrip.gps[0] && subtrip.gps[1] : subtrip.gps.lat && subtrip.gps.lng))
          .map(subtrip => (Array.isArray(subtrip.gps) ? [subtrip.gps[0], subtrip.gps[1]] : [subtrip.gps.lat, subtrip.gps.lng]))}
      />
    </MapContainer>
  </div>
);



const Gallery = ({ subtrips, openModal, setOpenModal, currentPhotoIndex, setCurrentPhotoIndex }) => {
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
              onClick={() => {
                setCurrentPhotoIndex(photoIndex);
                setOpenModal(true);
              }}
            />
          </div>
        ))
      )}
    </div>
  );
};



// Modified Modal with ZoomableImage to handle image enlarging
const ZoomableImage = ({ src, alt, onPrev, onNext, isDisabledPrev, isDisabledNext }) => {
  return (
    <Box sx={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <IconButton
        sx={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)' }}
        onClick={onPrev}
        disabled={isDisabledPrev}
      >
        <ArrowBackIosIcon />
      </IconButton>

      <Zoom>
        <img
          src={src}
          alt={alt}
          style={{
            width: '100%',
            height: 'auto',
            maxWidth: '90%',
            maxHeight: '80vh',
            borderRadius: '8px',
            cursor: 'zoom-in',
          }}
        />
      </Zoom>

      <IconButton
        sx={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)' }}
        onClick={onNext}
        disabled={isDisabledNext}
      >
        <ArrowForwardIosIcon />
      </IconButton>
    </Box>
  );
};

const SubtripDetail = ({ subtrip, open, handleClose }) => {
  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={{ padding: 2, bgcolor: 'black', border: '2px solid #000', boxShadow: 24, borderRadius: '8px', width: '80%', maxWidth: '600px', margin: 'auto', marginTop: '100px' }}>
        <h2>{subtrip.name}</h2>
        
        {/* Kontrola a destrukturalizace GPS */}
        {subtrip.gps && (
          Array.isArray(subtrip.gps) ? (
            subtrip.gps[0] && subtrip.gps[1] ? ( // Pokud GPS je pole [lat, lng]
              <MapContainer center={[subtrip.gps[0], subtrip.gps[1]]} zoom={15} style={{ height: '200px', width: '100%' }}>
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <Marker position={[subtrip.gps[0], subtrip.gps[1]]} icon={customIcon} />
              </MapContainer>
            ) : (
              <p>No valid GPS data available.</p> // Pokud pole neobsahuje platné souřadnice
            )
          ) : (
            subtrip.gps.lat && subtrip.gps.lng ? ( // Pokud GPS je objekt {lat, lng}
              <MapContainer center={[subtrip.gps.lat, subtrip.gps.lng]} zoom={15} style={{ height: '200px', width: '100%' }}>
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <Marker position={[subtrip.gps.lat, subtrip.gps.lng]} icon={customIcon} />
              </MapContainer>
            ) : (
              <p>No valid GPS data available.</p> // Pokud objekt nemá platné souřadnice
            )
          )
        )}

        {/* Zavření modálního okna */}
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
  const [openModal, setOpenModal] = useState(false);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
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

  const handleClose = () => setOpenModal(false);

  const handleNext = () => {
    setCurrentPhotoIndex((prevIndex) => (prevIndex + 1) % (trip.subtrips.flatMap(subtrip => subtrip.photos).length));
  };

  const handlePrev = () => {
    setCurrentPhotoIndex((prevIndex) => (prevIndex - 1 + trip.subtrips.flatMap(subtrip => subtrip.photos).length) % (trip.subtrips.flatMap(subtrip => subtrip.photos).length));
  };

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
        {/* Přidání Podvýlety */}
        {trip && trip.subtrips.length > 0 && (
          <div style={{ marginTop: '20px', width: '80%', textAlign: 'left' }}>
            <h2 style={{ margin: '0' }}>Podvýlety:</h2>
            {trip.subtrips.map((subtrip, index) => (
              <div key={index} style={{ marginBottom: '10px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', marginBottom: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                    <Button variant="outlined" color="primary" onClick={() => handleSubtripDetailOpen(subtrip)}>
                      <InfoIcon /> {/* Ikona pro detail */}
                    </Button>
                    <h3 style={{ margin: '10px', marginBottom: '0', marginRight: '0', marginTop: '0' }}>{subtrip.name}</h3>
                  </div>
                  <p style={{ margin: '10px', marginBottom: '0', marginRight: '0', marginTop: '0' }}>Popis: {subtrip.description}</p>
                  {/* Zobrazení obrázků pod názvem podvýletu */}
                  {subtrip.photos && subtrip.photos.length > 0 && (
                    <Gallery
                      subtrips={[subtrip]} // Pass single subtrip for its photos
                      openModal={openModal}
                      setOpenModal={setOpenModal}
                      currentPhotoIndex={currentPhotoIndex}
                      setCurrentPhotoIndex={setCurrentPhotoIndex}
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
        {/*TODO: Nezařazené fotografie: budou se zobrazovat fotografie výletu a ne podvýletů */}
        {trip && trip.photos && trip.photos.length > 0 && (
        <div style={{ marginTop: '20px', width: '80%', textAlign: 'left' }}>
          <h3>Ostatní fotografie</h3>
          <Gallery
            subtrips={[{ photos: trip.photos }]} // Pass photos directly from the trip
            openModal={openModal}
            setOpenModal={setOpenModal}
            currentPhotoIndex={currentPhotoIndex}
            setCurrentPhotoIndex={setCurrentPhotoIndex}
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

      <Modal open={openModal} onClose={handleClose} aria-labelledby="modal-title" aria-describedby="modal-description">
        <Box sx={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center', bgcolor: 'black', border: '2px solid #000', boxShadow: 24, p: 4 }}>
          <IconButton
            sx={{ position: 'absolute', top: 10, right: 10 }}
            onClick={handleClose}
          >
            <CloseIcon />
          </IconButton>
          <IconButton
            sx={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)' }}
            onClick={handlePrev}
            disabled={photos.length <= 1}
          >
            <ArrowBackIosIcon />
          </IconButton>
          <img src={photos[currentPhotoIndex]} alt={`Photo ${currentPhotoIndex + 1}`} style={{ width: '100%', height: 'auto', maxWidth: '90%', maxHeight: '80vh', borderRadius: '8px' }} />
          <IconButton
            sx={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)' }}
            onClick={handleNext}
            disabled={photos.length <= 1}
          >
            <ArrowForwardIosIcon />
          </IconButton>
        </Box>
      </Modal>
      {/* Modální okno pro detail podvýletu */}
      {subtripDetail && (
        <SubtripDetail subtrip={subtripDetail} open={openSubtripModal} handleClose={() => setOpenSubtripModal(false)} />
      )}
    </div>
  );
}

export default TripDetail;
