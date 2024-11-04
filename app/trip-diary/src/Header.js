import React, { useState } from 'react';
import { AppBar, Toolbar, Button, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import logo from './logo.svg';
import './App.css';
import { useNavigate } from "react-router-dom";

function Header() {
  const [selectedTab, setSelectedTab] = useState('Trips');
  const navigate = useNavigate();

  const goToNewTrip = () => {
    navigate("/AddTrip"); 
  };

  const goToTrips = () => {
    navigate("/");
  }

  const goToVisited = () => {
    navigate("/Visited");
  }

  const handleTabChange = (tab) => {
    setSelectedTab(tab);
  };

  return (
    <AppBar position="static" style={{ backgroundColor: '#282c34', boxShadow: 'none' }}>
      <Toolbar>
        {/* Logo vedle tlačítek */}
        <IconButton onClick={goToTrips} edge="start" color="inherit" aria-label="logo">
          <img src={logo} alt="Logo" className="App-logo" />
        </IconButton>
        
        {/* Tlačítko "Trips" */}
        <Button
          onClick={goToTrips}
          sx={{ fontSize: '24px', color: 'white', fontFamily: 'Nunito-Bold' }}
        >
          Trips
        </Button>

        {/* Tlačítko "Visited" */}
        <Button
          onClick={goToVisited}
          sx={{ fontSize: '24px', color: 'white', fontFamily: 'Nunito-Bold' }}
        >
          Visited
        </Button>

        <div style={{ flexGrow: 1 }} />

        {/* Tlačítko "+" */}
        <IconButton color="inherit" aria-label="add" onClick={goToNewTrip}>
          <AddIcon style={{ color: '#1976d2', fontSize: 40 }} />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
