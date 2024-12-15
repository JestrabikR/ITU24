import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from '../Header';
import '../assets/AddTrip.css';
import '../assets/App.css';
import { Modal, Box, Typography, TextField, Button } from "@mui/material";
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
        // Update existing trip
        await axios.put(`http://localhost:5000/trip/update/${id}`, trip, {
          headers: { 'Content-Type': 'application/json' },
        });
      } else {
        // Create new trip
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

  const removePhoto = (index) => {
    setTrip((prevTrip) => {
      const newPhotos = prevTrip.photos.filter((_, i) => i !== index);
      return { ...prevTrip, photos: newPhotos };
    });
  };

  const addAdvantage = () => {
    setTrip((prevTrip) => ({
      ...prevTrip,
      advantages: [...prevTrip.advantages, ''],
    }));
  };

  const removeAdvantage = (index) => {
    setTrip((prevTrip) => {
      const newAdvantages = prevTrip.advantages.filter((_, i) => i !== index);
      return { ...prevTrip, advantages: newAdvantages };
    });
  };

  const addDisadvantage = () => {
    setTrip((prevTrip) => ({
      ...prevTrip,
      disadvantages: [...prevTrip.disadvantages, ''],
    }));
  };

  const removeDisadvantage = (index) => {
    setTrip((prevTrip) => {
      const newDisadvantages = prevTrip.disadvantages.filter((_, i) => i !== index);
      return { ...prevTrip, disadvantages: newDisadvantages };
    });
  };

  // Style pro modal
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    maxHeight: '80vh', // Nastaví maximální výšku modalu (80% výšky obrazovky)
    overflowY: 'auto', // Povolení vertikálního scrollování, pokud obsah překročí maximální výšku
  };

  const customIcon = L.icon({
    iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  });

  const addSubtrip = () => {
    if (!subtripName || !selectedLocation) {
      toast.error('Prosím vyplňte název a lokaci podvýletu.');
      return;
    }
  
    const subtripData = {
      name: subtripName,
      description: subtripDescription,
      gps: selectedLocation,
      photos: images.map((image) => URL.createObjectURL(image)), // Pokud chcete base64, upravte
      favourite: false,
    };
  
    // Přidejte podvýlet do `trip.subtrips`
    setTrip((prevTrip) => ({
      ...prevTrip,
      subtrips: [...prevTrip.subtrips, subtripData],
    }));
  
    // Vymažte hodnoty modálu
    setSubtripName('');
    setSubtripDescription('');
    setSelectedLocation(null);
    setImages([]);
    setIsModalOpen(false);
  };

  const handleModalOpen = () => setIsModalOpen(true);

  const handleModalClose = () => setIsModalOpen(false);

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

  const saveSubtrip = (newSubtrip) => {
    setTrip((prevTrip) => ({
      ...prevTrip,
      subtrips: [...prevTrip.subtrips, newSubtrip],
    }));
  };
  
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
  
      onSaveSubtrip(newSubtrip); // Zavoláme funkci předanou jako prop
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
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Přidat podvýlet
          </Typography>
          <Box sx={{ mt: 2 }}>
            <MapContainer
              center={[50.0755, 14.4378]} // Výchozí souřadnice (např. Praha)
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

  return (
    <div>
      <Header />
      <div  className="trip-form-container">
      <h1 className="form-title">{id ? 'Edit Trip' : 'Create Trip'}</h1>
      <form className="trip-form" onSubmit={handleSubmit}>
        {/* Trip Name */}
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

        {/* Country */}
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

        {/* Description */}
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

        {/* Budget */}
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

        {/* Date Range */}
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

        {/* Advantages */}
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

        {/* Disadvantages */}
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
              color="secondary"
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

        {/* Zde voláte modal */}
        <AddSubtripModal
          isModalOpen={isModalOpen}
          handleClose={handleModalClose}
          onSaveSubtrip={saveSubtrip}
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
