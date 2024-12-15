/*
  Autor: Dominik Borek (xborek12)
  Stránka pro vytvoření/editaci cesty
*/


import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from '../Header';
import '../assets/App.css';
import { Modal, Box, Typography, TextField, Button, createTheme } from "@mui/material";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { FileUpload } from '@mui/icons-material';

function TripForm() {
  const [trip, setTrip] = useState({
    name: '',
    country: '',
    description: '',
    budget: '',
    from_date: '',
    until_date: '',
    subtrips: [],
    photos: [],
    advantages: [],
    disadvantages: [],
  });
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [subtripName, setSubtripName] = useState('');
  const [subtripDescription, setSubtripDescription] = useState('');
  const [images, setImages] = useState([]);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [subtripToEdit, setSubtripToEdit] = useState(null);


  // Propojení s api
  useEffect(() => {
    if (id) {
      axios
        .get(`http://localhost:5000/trip/${id}`)
        .then((response) => {
          if (response.status === 204) {
            navigate('/trip/form');
            return;
          }
          setTrip(response.data);
        })
        .catch((error) => {
          toast.error('Error fetching trip details');
          console.error(error);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [id, navigate, toast]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTrip((prevTrip) => ({
      ...prevTrip,
      [name]: value,
    }));
  };

  // Zpracování požadavku a ověření dat
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (trip.budget < 0) {
      toast.error('Budget cannot be less than 0');
      return;
    }

    if (new Date(trip.from_date) > new Date(trip.until_date)) {
      toast.error('Start date cannot be later than end date');
      return;
    }

    try {
      if (id) {
        await axios.put(`http://localhost:5000/trip/update/${id}`, trip, {
          headers: { 'Content-Type': 'application/json' },
        });
      } else {
        await axios.post('http://localhost:5000/trip/add', trip, {
          headers: { 'Content-Type': 'application/json' },
        });
      }
      toast.success('Trip saved successfully');
      navigate('/');
    } catch (error) {
      toast.error('Error saving trip');
      console.error(error);
    }
  };

  // Zpracování nahrané fotografie
  const handlePhotoUpload = async (e) => {
    const files = e.target.files;
    if (!files) return;

    for (let file of files) {
      const base64 = await toBase64(file);
      setTrip((prevTrip) => ({
        ...prevTrip,
        photos: [...prevTrip.photos, base64],
      }));
    }
  };

  // Odstranění fotografie
  const removePhoto = (index) => {
    setTrip((prevTrip) => {
      const newPhotos = prevTrip.photos.filter((_, i) => i !== index);
      return { ...prevTrip, photos: newPhotos };
    });
  };

  // Přidání výhod
  const addAdvantage = () => {
    setTrip((prevTrip) => ({
      ...prevTrip,
      advantages: [...prevTrip.advantages, ''],
    }));
  };

  // Odstranění výhod
  const removeAdvantage = (index) => {
    setTrip((prevTrip) => {
      const newAdvantages = prevTrip.advantages.filter((_, i) => i !== index);
      return { ...prevTrip, advantages: newAdvantages };
    });
  };

  // Přidání nevýhod
  const addDisadvantage = () => {
    setTrip((prevTrip) => ({
      ...prevTrip,
      disadvantages: [...prevTrip.disadvantages, ''],
    }));
  };

  // Odstranění nevýhod
  const removeDisadvantage = (index) => {
    setTrip((prevTrip) => {
      const newDisadvantages = prevTrip.disadvantages.filter((_, i) => i !== index);
      return { ...prevTrip, disadvantages: newDisadvantages };
    });
  };

  // Definování stylů pro sx
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    maxHeight: '80vh',
    overflowY: 'auto',
    color: '#333',
  };

  // Definice custom ikony
  const customIcon = L.icon({
    iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  });


  // Přidání podvýletu
  const addSubtrip = () => {
    if (!subtripName || !selectedLocation) {
      toast.error('Prosím vyplňte název a lokaci podvýletu.');
      return;
    }
  
    const subtripData = {
      name: subtripName,
      description: subtripDescription,
      gps: selectedLocation,
      photos: images.map((image) => URL.createObjectURL(image)),
      favourite: false,
    };
  
    setTrip((prevTrip) => ({
      ...prevTrip,
      subtrips: [...prevTrip.subtrips, subtripData],
    }));
  
    setSubtripName('');
    setSubtripDescription('');
    setSelectedLocation(null);
    setImages([]);
    setIsModalOpen(false);
  };

  // Zpracování modálního okna
  const handleModalOpen = () => setIsModalOpen(true);
  const handleModalClose = () => setIsModalOpen(false);

   // Zpracování výběru lokace
  const LocationPicker = ({ setSelectedLocation }) => {
    useMapEvents({
      click: (e) => {
        setSelectedLocation([e.latlng.lat, e.latlng.lng]);
      },
    });
  
    return null;
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  // Zpracování požadavku pro uložení podvýletu
  const saveSubtrip = (newSubtrip) => {
    setTrip((prevTrip) => ({
      ...prevTrip,
      subtrips: [...prevTrip.subtrips, newSubtrip],
    }));
  };
  
  // Vytvoření modálního okna pro podvýlet
  const AddSubtripModal = ({ isModalOpen, handleClose, onSaveSubtrip }) => {
    const [localSubtripName, setLocalSubtripName] = useState('');
    const [localSubtripDescription, setLocalSubtripDescription] = useState('');
    const [localSelectedLocation, setLocalSelectedLocation] = useState(null);
    const [localImages, setLocalImages] = useState([]);
  
    const handleImageUpload = (event) => {
      const files = Array.from(event.target.files);
      setLocalImages((prevImages) => [...prevImages, ...files]);
    };
  
    const handleSave = () => {
      if (!localSubtripName || !localSelectedLocation) {
        toast.error('Prosím vyplňte název a lokaci podvýletu.');
        return;
      }
  
      const newSubtrip = {
        name: localSubtripName,
        description: localSubtripDescription,
        gps: localSelectedLocation,
        photos: localImages.map((file) => URL.createObjectURL(file)),
        favourite: false,
      };
  
      onSaveSubtrip(newSubtrip);
      resetModalState();
      handleClose();
    };
  
    const resetModalState = () => {
      setLocalSubtripName('');
      setLocalSubtripDescription('');
      setLocalSelectedLocation(null);
      setLocalImages([]);
    };
  
    return (
      <Modal
        open={isModalOpen}
        onClose={() => {
          resetModalState();
          handleClose();
        }}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Box sx={{mt: 2}}>
            <MapContainer
              center={[50.0755, 14.4378]}
              zoom={13}
              style={{ height: '300px', width: '100%', marginBottom: '16px' }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&copy; OpenStreetMap contributors"
              />
              <LocationPicker setSelectedLocation={setLocalSelectedLocation} />
              {localSelectedLocation && (
                <Marker position={localSelectedLocation} icon={customIcon} />
              )}
            </MapContainer>
            {localSelectedLocation && (
              <Typography>
                Vybraný bod: {localSelectedLocation[0].toFixed(5)}, {localSelectedLocation[1].toFixed(5)}
              </Typography>
            )}
            <TextField
              fullWidth
              label="Název podvýletu*"
              variant="outlined"
              value={localSubtripName}
              onChange={(e) => setLocalSubtripName(e.target.value)}
              sx={{ mt: 2 }}
            />
            <TextField
              fullWidth
              label="Popis podvýletu"
              variant="outlined"
              multiline
              rows={4}
              value={localSubtripDescription}
              onChange={(e) => setLocalSubtripDescription(e.target.value)}
              sx={{ mt: 2 }}
            />
            <Button variant="contained" component="label" sx={{ mt: 2 }}>
              Přidat obrázky
              <input
                type="file"
                hidden
                accept="image/*"
                multiple
                onChange={handleImageUpload}
              />
            </Button>
            {localImages.length > 0 && (
              <Typography sx={{ mt: 1 }}>
                Počet přidaných obrázků: {localImages.length}
              </Typography>
            )}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
              <Button variant="outlined" onClick={handleClose} sx={{ mr: 2 }}>
                Zrušit
              </Button>
              <Button variant="contained" onClick={handleSave}>
                Uložit podvýlet
              </Button>
            </Box>
          </Box>
        </Box>
      </Modal>
    );
  };
  
  // Zpracování editace
  const handleEditSubtrip = (subtrip) => {
    setSubtripToEdit(subtrip);
    setEditModalOpen(true);
  };
  
  // Uložení editace
  const handleSaveEditedSubtrip = (updatedSubtrip) => {
    const updatedSubtrips = trip.subtrips.map((subtrip) =>
      subtrip === subtripToEdit ? updatedSubtrip : subtrip
    );
    setTrip((prevTrip) => ({ ...prevTrip, subtrips: updatedSubtrips }));
    setEditModalOpen(false);
  };

  // Komponenta pro editaci podvýletu
  const EditSubtripModal = ({
    isModalOpen,
    handleClose,
    subtripData,
    onSaveSubtrip,
  }) => {
    const [localSubtripName, setLocalSubtripName] = useState(subtripData.name || '');
    const [localSubtripDescription, setLocalSubtripDescription] = useState(subtripData.description || '');
    const [localSelectedLocation, setLocalSelectedLocation] = useState(subtripData.gps || null);
    const [localImages, setLocalImages] = useState(subtripData.photos || []);
  
    const handleImageUpload = (event) => {
      const files = Array.from(event.target.files);
      setLocalImages((prevImages) => [
        ...prevImages,
        ...files.map((file) => URL.createObjectURL(file)),
      ]);
    };
  
    const handleSave = () => {
      if (!localSubtripName || !localSelectedLocation) {
        toast.error('Prosím vyplňte název a lokaci podvýletu.');
        return;
      }
  
      const updatedSubtrip = {
        ...subtripData,
        name: localSubtripName,
        description: localSubtripDescription,
        gps: localSelectedLocation,
        photos: localImages,
      };
  
      onSaveSubtrip(updatedSubtrip);
      handleClose();
    };
  
    return (
      <Modal
        open={isModalOpen}
        onClose={handleClose}
        aria-labelledby="edit-subtrip-modal-title"
        aria-describedby="edit-subtrip-modal-description"
      >
        <Box sx={style}>
          <Typography id="edit-subtrip-modal-title" variant="h6">
            Upravit podvýlet
          </Typography>
          <Box sx={{ mt: 2}}>
            <TextField
              fullWidth
              label="Název podvýletu*"
              variant="outlined"
              value={localSubtripName}
              onChange={(e) => setLocalSubtripName(e.target.value)}
              sx={{ mt: 2 }}
            />
            <TextField
              fullWidth
              label="Popis podvýletu"
              variant="outlined"
              multiline
              rows={4}
              value={localSubtripDescription}
              onChange={(e) => setLocalSubtripDescription(e.target.value)}
              sx={{ mt: 2 }}
            />
            <Typography sx={{ mt: 2 }}>Klikněte na mapu pro výběr nové lokace:</Typography>
            <MapContainer
              center={localSelectedLocation || [50.0755, 14.4378]}
              zoom={13}
              style={{ height: '300px', width: '100%', marginBottom: '16px' }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&copy; OpenStreetMap contributors"
              />
              <LocationPicker setSelectedLocation={setLocalSelectedLocation} />
              {localSelectedLocation && (
                <Marker position={localSelectedLocation} icon={customIcon} />
              )}
            </MapContainer>
            {localSelectedLocation && Array.isArray(localSelectedLocation) ? (
              <Typography>
                Vybraný bod: {localSelectedLocation[0]?.toFixed(5)}, {localSelectedLocation[1]?.toFixed(5)}
              </Typography>
            ) : (
              <Typography style={{ color: 'white' }}>Klikněte na mapu pro výběr bodu</Typography>
            )}
            <Button variant="contained" component="label" sx={{ mt: 2 }}>
              Přidat obrázky
              <input
                type="file"
                hidden
                accept="image/*"
                multiple
                onChange={handleImageUpload}
              />
            </Button>
            {localImages.length > 0 && (
              <Typography sx={{ mt: 1 }}>
                Počet přidaných obrázků: {localImages.length}
              </Typography>
            )}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
              <Button variant="outlined" onClick={handleClose} sx={{ mr: 2 }}>
                Zrušit
              </Button>
              <Button variant="contained" onClick={handleSave}>
                Uložit změny
              </Button>
            </Box>
          </Box>
        </Box>
      </Modal>
    );
  };

  // Převedení obrázku na Base64
  const toBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  // View stránky
  return (
    <div>
      <Header />
      <div  className="trip-form-container">
      <h1 className="form-title">{id ? 'Edit Trip' : 'Create Trip'}</h1>
      <form className="trip-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <TextField
            fullWidth
            label="Název cesty"
            type="text"
            name="name"
            id="name"
            value={trip.name}
            variant="outlined"
            required
            onChange={handleChange}
            sx={{
              mt: 2,
              "& .MuiOutlinedInput-root": {
                color: "white",
                "& fieldset": {
                  borderColor: "white",
                },
                "&:hover fieldset": {
                  borderColor: "white",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "white",
                },
              },
              "& .MuiInputLabel-root": {
                color: "white",
              },
              "& .MuiInputLabel-root.Mui-focused": {
                color: "white",
              },
            }}
          />
        </div>

        <div className="form-group">
          <TextField
            fullWidth
            label="Země"
            type="text"
            name="country"
            id="country"
            value={trip.country}
            variant="outlined"
            onChange={handleChange}
            sx={{
              mt: 2,
              "& .MuiOutlinedInput-root": {
                color: "white",
                "& fieldset": {
                  borderColor: "white",
                },
                "&:hover fieldset": {
                  borderColor: "white",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "white",
                },
              },
              "& .MuiInputLabel-root": {
                color: "white",
              },
              "& .MuiInputLabel-root.Mui-focused": {
                color: "white",
              },
            }}
          />
        </div>

        <div className="form-group">
          <TextField
            fullWidth
            label="Popis"
            name="description"
            id="description"
            value={trip.description}
            variant="outlined"
            multiline
            rows={4}
            onChange={handleChange}
            sx={{
              mt: 2,
              "& .MuiOutlinedInput-root": {
                color: "white",
                "& fieldset": {
                  borderColor: "white",
                },
                "&:hover fieldset": {
                  borderColor: "white",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "white",
                },
              },
              "& .MuiInputLabel-root": {
                color: "white",
              },
              "& .MuiInputLabel-root.Mui-focused": {
                color: "white",
              },
            }}
          />
        </div>

        <div className="form-group">
          <TextField
            fullWidth
            label="Rozpočet"
            type="number"
            name="budget"
            id="budget"
            value={trip.budget}
            variant="outlined"
            onChange={handleChange}
            sx={{
              mt: 2,
              "& .MuiOutlinedInput-root": {
                color: "white",
                "& fieldset": {
                  borderColor: "white",
                },
                "&:hover fieldset": {
                  borderColor: "white",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "white",
                },
              },
              "& .MuiInputLabel-root": {
                color: "white",
              },
              "& .MuiInputLabel-root.Mui-focused": {
                color: "white",
              },
            }}
          />
        </div>

        <div className="form-group date-range-container" style={{ display: "flex", gap: "16px" }}>
          <TextField
            fullWidth
            label="Od"
            type="date"
            name="from_date"
            id="from_date"
            value={trip.from_date}
            variant="outlined"
            required
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            sx={{
              "& .MuiOutlinedInput-root": {
                color: "white",
                "& fieldset": {
                  borderColor: "white",
                },
                "&:hover fieldset": {
                  borderColor: "white",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "white",
                },
              },
              "& .MuiInputLabel-root": {
                color: "white",
              },
              "& .MuiInputLabel-root.Mui-focused": {
                color: "white",
              },
            }}
          />
          <TextField
            fullWidth
            label="Do"
            type="date"
            name="until_date"
            id="until_date"
            value={trip.until_date}
            variant="outlined"
            required
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            sx={{
              "& .MuiOutlinedInput-root": {
                color: "white",
                "& fieldset": {
                  borderColor: "white",
                },
                "&:hover fieldset": {
                  borderColor: "white",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "white",
                },
              },
              "& .MuiInputLabel-root": {
                color: "white",
              },
              "& .MuiInputLabel-root.Mui-focused": {
                color: "white",
              },
            }}
          />
        </div>

        <h3>Výhody</h3>
        {trip.advantages.map((advantage, index) => (
          <div key={index} className="form-group advantage-item">
            <TextField
              fullWidth
              label="Výhoda"
              value={advantage}
              variant="outlined"
              rows={1}
              onChange={(e) => {
                const newAdvantages = [...trip.advantages];
                newAdvantages[index] = e.target.value;
                setTrip((prevTrip) => ({
                  ...prevTrip,
                  advantages: newAdvantages,
                }));
              }}
              sx={{
                mt: 2,
                "& .MuiOutlinedInput-root": {
                  color: "white",
                  "& fieldset": {
                    borderColor: "white",
                  },
                  "&:hover fieldset": {
                    borderColor: "white",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "white",
                  },
                },
                "& .MuiInputLabel-root": {
                  color: "white",
                },
                "& .MuiInputLabel-root.Mui-focused": {
                  color: "white",
                },
              }}
            />
            <button className="remove-btn" type="button" onClick={() => removeAdvantage(index)}>
              Odstranit výhodu
            </button>
          </div>
        ))}
        <button className="add-btn" type="button" onClick={addAdvantage}>
          Přidat výhodu
        </button>

        <h3>Nevýhody</h3>
        {trip.disadvantages.map((disadvantage, index) => (
          <div key={index} className="form-group disadvantage-item">
            <TextField
              fullWidth
              label="Nevýhoda"
              value={disadvantage}
              variant="outlined"
              rows={1}
              onChange={(e) => {
                const newDisadvantages = [...trip.disadvantages];
                newDisadvantages[index] = e.target.value;
                setTrip((prevTrip) => ({
                  ...prevTrip,
                  disadvantages: newDisadvantages,
                }));
              }}
              sx={{
                mt: 2,
                "& .MuiOutlinedInput-root": {
                  color: "white",
                  "& fieldset": {
                    borderColor: "white",
                  },
                  "&:hover fieldset": {
                    borderColor: "white",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "white",
                  },
                },
                "& .MuiInputLabel-root": {
                  color: "white",
                },
                "& .MuiInputLabel-root.Mui-focused": {
                  color: "white",
                },
              }}
            />
            <button className="remove-btn" type="button" onClick={() => removeDisadvantage(index)}>
              Odstranit nevýhodu
            </button>
          </div>
        ))}
        <button className="add-btn" type="button" onClick={addDisadvantage}>
          Přidat nevýhodu
          </button>
          
        <h3>Podvýlety</h3>
        {trip.subtrips.map((subtrip, index) => (
          <div key={index} className="form-group subtrip-item">
            <Typography variant="h6">Podvýlet: {subtrip.name}</Typography>
            <Typography variant="body1">Popis: {subtrip.description}</Typography>
            <Typography variant="body1">
              GPS: {subtrip.gps ? `${subtrip.gps[0]}, ${subtrip.gps[1]}` : "N/A"}
            </Typography>
            <Typography variant="body1">
              Počet obrázků: {subtrip.photos.length}
            </Typography>
            <Button
              variant="outlined"
              onClick={() => handleEditSubtrip(subtrip)}
              sx={{ mr: 2 }}
            >
              Upravit podvýlet
            </Button>
            <Button
              variant="outlined"
              color="error"
              onClick={() => {
                const newSubtrips = trip.subtrips.filter((_, i) => i !== index);
                setTrip((prevTrip) => ({ ...prevTrip, subtrips: newSubtrips }));
              }}
            >
              Odstranit podvýlet
            </Button>
          </div>
        ))}
        <button className="add-btn" type="button" onClick={handleModalOpen}>
          Přidat podvýlet
        </button>

        <AddSubtripModal
          isModalOpen={isModalOpen}
          handleClose={handleModalClose}
          onSaveSubtrip={saveSubtrip}
        />

        <EditSubtripModal
          isModalOpen={editModalOpen}
          handleClose={() => setEditModalOpen(false)}
          subtripData={subtripToEdit || {}}
          onSaveSubtrip={handleSaveEditedSubtrip}
        />
          <div className="form-group">
            <h3>Obrázky</h3>
            <label htmlFor="photo-upload" className="add-photo-btn">
              <FileUpload />
              <span>Přidat obrázky</span>
              <input
                type="file"
                id="photo-upload"
                multiple
                accept="image/*"
                onChange={handlePhotoUpload}
              />
            </label>
            <div className="photos-preview">
              {trip.photos.map((photo, index) => (
                <div key={index} className="photo-item">
                  <img src={photo} alt="Trip" width={100} />
                  <button className="remove-btn" type="button" onClick={() => removePhoto(index)}>
                    Odstranit obrázek
                  </button>
                </div>
              ))}
            </div>
          </div>

        <button className="submit-btn" type="submit">Uložit</button>
        <ToastContainer />
      </form>
      </div>
    </div>
  );
}

export default TripForm;
