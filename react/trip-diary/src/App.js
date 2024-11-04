import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Main from './Sites/Main';
import AddTrip from './Sites/AddTrip';
import Visited from './Sites/VisitedMap';
import TripDetail from './Sites/TripDetail';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/AddTrip" element={<AddTrip />} />
        <Route path="/Visited" element={<Visited />} />
        <Route path="/TripDetail/:id" element={<TripDetail />} />
        {/* Přidejte další trasy podle potřeby */}
      </Routes>
    </Router>
  );
}

export default App;
