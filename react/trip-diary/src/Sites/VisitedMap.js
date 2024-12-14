import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';
import countriesGeoJson from '../countries.geo.json'; // Upravte cestu k vašemu GeoJSON souboru
import { FormControlLabel, Switch, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import Header from '../Header'; // Volitelné, pokud používáte vlastní hlavičku
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import L from 'leaflet'; // Importujte Leaflet pro legendu

const visitedColor = '#8ac43f'; // Zelená pro navštívené
const wantedColor = '#f51d57'; // Červená pro požadované

function VisitedMap() {
  const [countries, setCountries] = useState([]);
  const [toggleMode, setToggleMode] = useState('visited'); // 'visited' nebo 'wanted'
  const [visitedCountries, setVisitedCountries] = useState([]);
  const [wantedCountries, setWantedCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('');
  const mapRef = useRef(null);

  useEffect(() => {
    // Načítání dat o zemích z API
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
    return { fillColor: '#D3D3D3', weight: 1, color: '#777', fillOpacity: 0.5 }; // Default style
  };

  const onEachCountry = (feature, layer) => {
    const countryCode = feature.id;
    const countryData = countries.find((c) => c.code === countryCode);

    let color = '#ffffff'; // Defaultní bílá
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

      updateCountryStatus(countryCode, !isCurrentlyMarked); // Pokud není označena, přidáme ji, pokud je, odstraníme
    });
  };

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

  const totalCountries = 190;
  const visitedPercentage = (visitedCountries.length / totalCountries) * 100;

  // Funkce pro přidání legendy do mapy
  const addLegend = (map) => {
    const legend = L.control({ position: 'topright' });

    legend.onAdd = function () {
      const div = L.DomUtil.create('div', 'info legend');
      const grades = [0, 1];
      const labels = ['Navštíveno', 'Chci navštívit'];
      const colors = [visitedColor, wantedColor];

      for (let i = 0; i < grades.length; i++) {
        div.innerHTML +=
          `<i style="background: ${colors[i]}"></i> ${labels[i]}<br>`;
      }

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
            <InputLabel style={{ color: 'white' }}>Visited Countries</InputLabel>
            <Select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              style={{
                color: 'white', // Nastavení barvy textu
                borderColor: 'white', // Nastavení barvy okrajů
                backgroundColor: '#333', // Nastavení pozadí
              }}
              MenuProps={{
                PaperProps: {
                  style: {
                    backgroundColor: '#333', // Nastavení pozadí pro dropdown
                    color: 'white', // Barva textu v dropdownu
                  }
                }
              }}
            >
              {visitedCountries.map((country) => (
                <MenuItem key={country.code} value={country.name} style={{ color: 'white' }}>
                  {country.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl style={{ width: '48%' }}>
            <InputLabel style={{ color: 'white' }}>Wanted Countries</InputLabel>
            <Select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              style={{
                color: 'white', // Nastavení barvy textu
                borderColor: 'white', // Nastavení barvy okrajů
                backgroundColor: '#333', // Nastavení pozadí
              }}
              MenuProps={{
                PaperProps: {
                  style: {
                    backgroundColor: '#333', // Nastavení pozadí pro dropdown
                    color: 'white', // Barva textu v dropdownu
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
            addLegend(mapRef.current); // Přidání legendy do mapy
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
