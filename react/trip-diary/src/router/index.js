/*
  Autor: Dominik Borek (xborek12)
  Routy
*/

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Main from '../Sites/Main';
import TripDetail from '../Sites/TripDetail';
import NotFound from '../Sites/NotFound';
import AllPastTrips from '../Sites/AllPastTrips';
import AllFutureTrips from '../Sites/AllFutureTrips';
import AddTrip from '../Sites/AddTrip';
import Gallery from '../Sites/Gallery';
import Visited from '../Sites/VisitedMap';
import AllTripsMap from '../Sites/AllTripsMap';

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        {/* Domovská stránka */}
        <Route path="/" element={<Main />} />
        
        {/* Detaily cesty */}
        <Route path="/TripDetail/:id" element={<TripDetail />} />

        {/* Všechny minulé cesty */}
        <Route path="/AllPastTrips" element={<AllPastTrips />} />

        {/* Všechny budoucí cesty */}
        <Route path="/AllFutureTrips" element={<AllFutureTrips />} />

        {/* Vytvoří novou cestu */}
        <Route path="/trip/form/:id?" element={<AddTrip />} />

        {/* Galerie */}
        <Route path="gallery" element={<Gallery />} />

        {/* Navštívené země */}
        <Route path="/visited" element={<Visited />} />

        {/* Mapa se všemi cestami */}
        <Route path="/AllTripsMap" element={<AllTripsMap />} />

        {/* 404 stránka */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
