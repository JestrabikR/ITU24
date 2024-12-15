/*
  Autor: Dominik Borek (xborek12)
  Componenta zahrnující header
*/

import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Button, IconButton, Dialog, DialogActions, DialogContent, DialogTitle, Drawer, List, ListItem, ListItemText } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DeleteIcon from '@mui/icons-material/Delete';
import MenuIcon from '@mui/icons-material/Menu';
import logo from './logo.svg';
import './assets/App.css';
import { useNavigate, useLocation, useParams } from "react-router-dom";

function Header() {
  const [selectedTab, setSelectedTab] = useState('Trips');
  const [openModal, setOpenModal] = useState(false);
  const [tripIdToDelete, setTripIdToDelete] = useState(null);
  const [openDrawer, setOpenDrawer] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();

  const goToNewTrip = () => {
    if (id) {
      navigate(`/trip/form/${id}`);
    } else {
      navigate("/trip/form");
    }
  };

  const goToTrips = () => {
    navigate("/");
  };

  const goToVisited = () => {
    navigate("/Visited");
  };

  const goToGallery = () => {
    navigate("/Gallery");
  };

  const handleTabChange = (tab) => {
    setSelectedTab(tab);
  };

  const isFormPage = location.pathname.startsWith('/trip/form');
  const isTripDetailPage = location.pathname.startsWith('/TripDetail/');

  const handleBackClick = () => {
    navigate(-1);
  };

  const openDeleteModal = (id) => {
    setTripIdToDelete(id);
    setOpenModal(true);
  };

  const closeDeleteModal = () => {
    setOpenModal(false);
  };

  const deleteTrip = async () => {
    try {
      if (tripIdToDelete) {
        const response = await fetch(`http://127.0.0.1:5000/trip/del/${tripIdToDelete}`, { method: 'DELETE' });
        if (response.ok) {
          console.log("Trip Deleted");
          setOpenModal(false);
          navigate("/");
        } else {
          console.error("Failed to delete trip");
        }
      } else {
        console.error("Error deleting trip");
      }
    } catch (error) {
      console.error("Error deleting trip:", error);
    }
  };

  return (
    <AppBar position="static" style={{ backgroundColor: '#282c34', boxShadow: 'none' }}>
      <Toolbar>
        <IconButton onClick={goToTrips} edge="start" color="inherit" aria-label="logo">
          <img src={logo} alt="Logo" className="App-logo" />
        </IconButton>

        <Button onClick={goToTrips} sx={{ fontSize: '24px', color: 'white', fontFamily: 'Nunito-Bold', display: { xs: 'none', md: 'block' } }}>
          Výlety
        </Button>
        <Button onClick={goToVisited} sx={{ fontSize: '24px', color: 'white', fontFamily: 'Nunito-Bold', display: { xs: 'none', md: 'block' } }}>
          Navštívené země
        </Button>
        <Button onClick={goToGallery} sx={{ fontSize: '24px', color: 'white', fontFamily: 'Nunito-Bold', display: { xs: 'none', md: 'block' } }}>
          Galerie
        </Button>

        <IconButton color="inherit" onClick={() => setOpenDrawer(true)} sx={{ display: { xs: 'block', md: 'none' } }}>
          <MenuIcon />
        </IconButton>

        <div style={{ flexGrow: 1 }} />

        {isFormPage && (
          <IconButton color="inherit" aria-label="back" onClick={handleBackClick}>
            <ArrowBackIcon style={{ color: '#1976d2', fontSize: 40 }} />
          </IconButton>
        )}

        {!isFormPage && isTripDetailPage ? (
          <>
            <IconButton color="inherit" aria-label="edit" onClick={goToNewTrip}>
              <EditIcon style={{ color: '#1976d2', fontSize: 40 }} />
            </IconButton>
            <IconButton color="inherit" aria-label="delete" onClick={() => openDeleteModal(id)}>
              <DeleteIcon style={{ color: 'red', fontSize: 40 }} />
            </IconButton>
          </>
        ) : !isFormPage && (
          <IconButton color="inherit" aria-label="add" onClick={goToNewTrip}>
            <AddIcon style={{ color: '#1976d2', fontSize: 40 }} />
          </IconButton>
        )}
      </Toolbar>

      <Drawer anchor="left" open={openDrawer} onClose={() => setOpenDrawer(false)} sx={{
          '& .MuiDrawer-paper': {
            backgroundColor: '#333',
          },
        }}>
        <List sx={{ width: 250 }}>
          <ListItem button onClick={goToTrips}>
            <ListItemText primary="Výlety" />
          </ListItem>
          <ListItem button onClick={goToVisited}>
            <ListItemText primary="Navštívené země" />
          </ListItem>
          <ListItem button onClick={goToGallery}>
            <ListItemText primary="Galerie" />
          </ListItem>
        </List>
      </Drawer>

      <Dialog open={openModal} onClose={closeDeleteModal}>
        <DialogTitle style={{ backgroundColor: '#333', color: 'white' }}>
          Opravdu si přejete odstranit výlet?
        </DialogTitle>
        <DialogContent style={{ backgroundColor: '#333', color: 'white' }}>
          Pokud odstraníte tento výlet, nelze to vrátit zpět
        </DialogContent>
        <DialogActions style={{ backgroundColor: '#333', color: 'white' }}>
          <Button onClick={closeDeleteModal} style={{ color: 'blue', backgroundColor: 'white' }}>
            Ne
          </Button>
          <Button onClick={deleteTrip} style={{ color: 'red', backgroundColor: 'white' }}>
            Ano
          </Button>
        </DialogActions>
      </Dialog>
    </AppBar>
  );
}

export default Header;
