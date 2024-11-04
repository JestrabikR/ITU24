import Header from '../Header';
import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, GeoJSON, useMapEvents } from 'react-leaflet';
import countriesGeoJson from 'countries.geo.json';
import L from 'leaflet';
import '../App.css';
import { alignProperty } from '@mui/material/styles/cssUtils';

const visitedColor = '#8ac43f';
const wantToVisitColor = '#f51d57';

// const visitedStyle = {
//   color: visitedColor,
//   weight: 2,
//   fillColor: visitedColor,
//   fillOpacity: 0.5
// };

// const watedToVisitStyle = {
//   color: wantToVisitColor,
//   weight: 2,
//   fillColor: wantToVisitColor,
//   fillOpacity: 0.5,
// };

// function VisitedMap(){
//   const [visitedCountriesData, setVisitedCountriesData] = useState([]);  

//   useEffect(() => {
//     axios.get('http://127.0.0.1:5000/countries')
//       .then(response => {
//         setSelectedCountries(response.data);
//       })
//       .catch(error => console.error('Error fetching data:', error));
//   }, []);

//   const highlightFeature = (e) => {
//     const layer = e.target;
//     layer.setStyle({
//         weight: 5,
//         color: layer.options.color, // Zachová původní barvu
//         dashArray: '',
//         fillOpacity: 0.7,
//     });
//     layer.bringToFront();
//   };

  
// }

function VisitedMap() {
  const [visitedCountriesData, setVisitedCountriesData] = useState([]);

  useEffect(() => {
    fetch('http://127.0.0.1:5000/countries')
      .then(response => response.json())
      .then(data => setVisitedCountriesData(data))
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  const onEachCountry = (country, layer) => {
    const countryCode = country.properties.ISO_A2;
    const visitedCountry = visitedCountriesData.find(c => c.code === countryCode);

    if (visitedCountry) {
      const color = visitedCountry.visited ? visitedColor : visitedCountry.wanted ? wantToVisitColor : '#ffffff';

      layer.setStyle({
        fillColor: color,
        fillOpacity: 0.5,
        color: color
      });
    }

    layer.on({
      click: () => {
        alert(country.properties.name);
      },
    });
  };

  return (
    <div className="App" style={{ minHeight: '100vh'}}>
      <Header />
      <h1>Map</h1>
      <div style={{padding: 50}}>
      <MapContainer center={[20, 0]} zoom={3} minZoom={2} style={{ height: "100vh", width: "calc(2/3 * 100%)"}}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <GeoJSON
          data={countriesGeoJson}
          onEachFeature={onEachCountry}
        />
      </MapContainer>
      </div>
    </div>
  );
}

export default VisitedMap;