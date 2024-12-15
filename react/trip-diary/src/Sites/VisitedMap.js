/*
  Autor: Dominik Borek (xborek12)
  Stránka s mapou navštívených zemí
*/

import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';
import countriesGeoJson from '../countries.geo.json';
import { FormControlLabel, Switch, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import Header from '../Header';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import L from 'leaflet';

const visitedColor = '#4dff00';
const wantedColor = '#ff0000';

function VisitedMap() {
  const [countries, setCountries] = useState([]);
  const [toggleMode, setToggleMode] = useState('visited');
  const [visitedCountries, setVisitedCountries] = useState([]);
  const [wantedCountries, setWantedCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('');
  const mapRef = useRef(null);

  // Získání dat
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await axios.get('http://localhost:5000/countries');
        setCountries(response.data);
        setVisitedCountries(response.data.filter(c => c.visited));
        setWantedCountries(response.data.filter(c => c.wanted));
      } catch (error) {
        console.error('Chyba při načítání zemí:', error);
      }
    };

    fetchCountries();
  }, []);

  // Vybarvení států
  const getCountryStyle = (feature) => {
    const country = countries.find((c) => c.code === feature.id);

    if (country?.visited) {
      return {
        color: visitedColor,
        weight: 2,
        fillColor: visitedColor,
        fillOpacity: 0.5,
      };
    }
    if (country?.wanted) {
      return {
        color: wantedColor,
        weight: 2,
        fillColor: wantedColor,
        fillOpacity: 0.5,
      };
    }
    return { fillColor: '#D3D3D3', weight: 1, color: '#777', fillOpacity: 0.5 };
  };

  // Zpracování kliknutí
  const onEachCountry = (feature, layer) => {
    const countryCode = feature.id;
    const countryData = countries.find((c) => c.code === countryCode);

    let color = '#ffffff';
    if (countryData) {
      if (countryData.visited) {
        color = visitedColor;
      } else if (countryData.wanted) {
        color = wantedColor;
      }
    }

    layer.setStyle({
      fillColor: color,
      fillOpacity: 0.7,
      color: '#000',
      weight: 1,
    });

    layer.on('click', () => {
      const isCurrentlyMarked =
        toggleMode === 'visited'
          ? countryData?.visited
          : countryData?.wanted;

      updateCountryStatus(countryCode, !isCurrentlyMarked);
    });
  };

  // Přidání do api
  const addCountry = (countryCode, countryName) => {
    const newCountry = {
      code: countryCode,
      name: countryName,
      visited: toggleMode === 'visited',
      wanted: toggleMode === 'wanted',
    };

    axios.post('http://127.0.0.1:5000/country/add', newCountry, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => {
        console.log('Country added:', response.data);
        setCountries(prevData => [...prevData, newCountry]);
        if (newCountry.visited) {
          setVisitedCountries(prev => [...prev, newCountry]);
        }
        if (newCountry.wanted) {
          setWantedCountries(prev => [...prev, newCountry]);
        }
      })
      .catch(error => {
        console.error('Error adding country:', error);
      });
  };

  // odstranění z api
  const removeCountry = (countryCode) => {
    axios
      .delete(`http://127.0.0.1:5000/country/del/${countryCode}`)
      .then(() => {
        setCountries(prevCountries => prevCountries.filter(country => country.code !== countryCode));
        setVisitedCountries(prev => prev.filter(country => country.code !== countryCode));
        setWantedCountries(prev => prev.filter(country => country.code !== countryCode));
      })
      .catch((error) => console.error('Chyba při odstraňování země:', error));
  };

  const updateCountryStatus = (countryCode, isAdding) => {
    const countryData = countriesGeoJson.features.find(
      (feature) => feature.id === countryCode || feature.properties.code === countryCode
    );

    if (!countryData) {
      console.error(`Země s kódem ${countryCode} nebyla nalezena.`);
      return;
    }

    if (isAdding) {
      addCountry(countryCode, countryData.properties.name);
    } else {
      removeCountry(countryCode);
    }
  };

  const totalCountries =180;
  const visitedPercentage = (visitedCountries.length / totalCountries) * 100;

  // Legenda
  const addLegend = (map) => {
    const legend = L.control({ position: 'bottomright' });
  
    legend.onAdd = function () {
      const div = L.DomUtil.create('div', 'info legend');
      div.style.backgroundColor = 'white';
      div.style.padding = '10px';
      div.style.borderRadius = '8px';
      div.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.2)';
      div.style.fontSize = '14px';
      div.innerHTML = '<h4>Legenda</h4>';
  
      const grades = ['Navštíveno', 'Chci navštívit'];
      const colors = [visitedColor, wantedColor];
  
      grades.forEach((label, index) => {
        div.innerHTML += `
          <i style="background: ${colors[index]}; width: 18px; height: 18px; display: inline-block; margin-right: 8px; border-radius: 4px;"></i>
          ${label}<br>`;
      });
  
      return div;
    };
  
    legend.addTo(map);
  };

  return (
    <div className="App" style={{ minHeight: '100vh' }}>
      <Header />
      <div className='container'>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ width: '200px' }}>
            <CircularProgressbar
              value={visitedPercentage}
              text={`${visitedCountries.length} / ${totalCountries}`}
              styles={{
                path: { stroke: visitedColor },
                text: { fill: visitedColor, fontSize: '16px' },
              }}
            />
          </div>
          <FormControlLabel
            control={
              <Switch
                checked={toggleMode === 'wanted'}
                onChange={() =>
                  setToggleMode(toggleMode === 'visited' ? 'wanted' : 'visited')
                }
              />
            }
            label={`${toggleMode === 'visited' ? 'Navštíveno' : 'Chci navštívit'}`}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
          <FormControl style={{ width: '48%' }}>
            <InputLabel style={{ color: 'green' }}>Seznam navštívených zemí</InputLabel>
            <Select
              value={selectedCountry}
              style={{
                color: 'white',
                borderColor: 'white',
                backgroundColor: '#333',
              }}
              MenuProps={{
                PaperProps: {
                  style: {
                    backgroundColor: '#333',
                    color: 'white',
                  }
                }
              }}
            >
              {visitedCountries.map((country) => (
                <MenuItem 
                  key={country.code} 
                  value={country.name} 
                  style={{ color: 'white' }}
                >
                  {country.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl style={{ width: '48%' }}>
            <InputLabel style={{ color: 'red' }}>Wanted Countries</InputLabel>
            <Select
              value={selectedCountry}
              style={{
                color: 'white',
                borderColor: 'white',
                backgroundColor: '#333',
              }}
              MenuProps={{
                PaperProps: {
                  style: {
                    backgroundColor: '#333',
                    color: 'white',
                  }
                }
              }}
            >
              {wantedCountries.map((country) => (
                <MenuItem key={country.code} value={country.name} style={{ color: 'white' }}>
                  {country.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
      </div>
      <div className="VisitedMap">
        <MapContainer
          center={[20, 0]}
          zoom={3}
          minZoom={2}
          style={{ height: '80vh', width: '100%' }}
          whenCreated={(mapInstance) => {
            mapRef.current = mapInstance;
            addLegend(mapRef.current);
          }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {countries.length > 0 && (
            <GeoJSON
              key={JSON.stringify(countries)}
              data={countriesGeoJson}
              onEachFeature={onEachCountry}
              style={getCountryStyle}
            />
          )}
        </MapContainer>
      </div>
    </div>
  );
}

export default VisitedMap;
