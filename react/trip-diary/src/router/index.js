import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Main from '../Sites/Main'; // Vaše hlavní stránka
import TripDetail from '../Sites/TripDetail'; // Detaily cesty
import NotFound from '../Sites/NotFound'; // 404 stránka
import AllTripsMap from '../components/AllTripsMap';
import AllPastTrips from '../Sites/AllPastTrips';
import AllFutureTrips from '../Sites/AllFutureTrips';
import AddTrip from '../Sites/AddTrip';
import Gallery from '../Sites/Gallery';
import Visited from '../Sites/VisitedMap';
// import AllTrips from '../Sites/AllTrips'; // Stránka se všemi cestami
// import TripForm from '../Sites/TripForm'; // Formulář cesty
// import SubtripForm from '../Sites/SubtripForm'; // Formulář pro část cesty

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

        {/* Stránka se všemi cestami */}
        {/* <Route path="/trips" element={<AllTrips />} /> */}

        {/* Formulář cesty (vytvoření/úprava) */}
        {/* <Route path="/form/trip/:id?" element={<TripForm />} /> */}

        {/* Formulář části cesty */}
        {/* <Route path="/form/subtrip/:id?" element={<SubtripForm />} /> */}

        {/* 404 stránka */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
