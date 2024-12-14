import React, { useState, useEffect } from 'react';
import PhotoGallery from 'react-photo-gallery';
import Lightbox from 'react-images';
import 'bootstrap/dist/css/bootstrap.min.css'; 
import '../assets/App.css';
import Header from '../Header';

// Gallery komponenta
const Gallery = ({ tripData }) => {
  const [currentImage, setCurrentImage] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  const openLightbox = (event, { photo, index }) => {
    setCurrentImage(index);
    setIsOpen(true);
  };

  const closeLightbox = () => {
    setCurrentImage(0);
    setIsOpen(false);
  };

  const goToNext = () => setCurrentImage(currentImage + 1);
  const goToPrevious = () => setCurrentImage(currentImage - 1);

  const renderPhotos = (photos, isSubtrip = false) => {
    const photoData = photos.map((photo, index) => {
      if (isSubtrip) {
        return {
          src: photo,
          width: 1.33,
          height: 1,
        };
      } else {
        return {
          src: photo,
          width: 0.2,
          height: 0.2,
        };
      }
    });
  
    return (
      <div className={`mt-3 ${isSubtrip ? "photo-gallery" : "smaller-photo"}`}>
        <PhotoGallery photos={photoData} />
      </div>
    );
  };
  
  return (
    <div className="container mt-5">
      <h1>{tripData.name}</h1>
      <p><strong>Date:</strong> {tripData.from_date} - {tripData.until_date}</p>
      <div className="row">
        <div>
          {renderPhotos(tripData.photos, false)}
        </div>

        {tripData.subtrips && tripData.subtrips.length > 0 && (
          <div>
            {tripData.subtrips.map((subtrip, subIndex) => (
              subtrip.photos && subtrip.photos.length > 0 && (
                <div key={subIndex} className="mt-4">
                  <h3>{subtrip.name}</h3>
                  {renderPhotos(subtrip.photos, true)}
                </div>
              )
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Hlavní komponenta
const TripsPage = () => {
  const [trips, setTrips] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Mock dat nebo fetch ze serveru
    const fetchTrips = async () => {
      try {
        const response = await fetch('http://localhost:5000/trips'); // Endpoint API
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setTrips(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchTrips();
  }, []);

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  if (trips.length === 0) {
    return <p>Loading trips...</p>;
  }

  return (
    <div className='body'>
      <Header />
      <div className="container mt-5">
        {trips.map((trip) => (
          <div key={trip.id} className="mb-5">
            <Gallery tripData={trip} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default TripsPage;
