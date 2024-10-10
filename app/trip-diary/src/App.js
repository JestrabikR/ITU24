import React, { useEffect, useState } from 'react';
import Header from './Header';
import './App.css';

function App() {
  const [trips, setTrips] = useState([]);
  
  useEffect(() => {
    // Fetch data from the API
    fetch('http://127.0.0.1:5000/trips')
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setTrips(data);
      })
      .catch((error) => console.error('Error fetching trips:', error));
  }, []);

  return (
    <div className="App" style={{ minHeight: '100vh' }}> 
      <Header />
      <div>
      <h1>Trips</h1>
      <ul>
        {trips.map((trip, index) => (
          <li key={index}>{JSON.stringify(trip)}</li>
        ))}
      </ul>
    </div>
    </div>
  );
}

export default App;
