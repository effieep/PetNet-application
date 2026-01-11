import Submenu from '../../components/SubMenu';
import { useState, useEffect, Fragment } from 'react';
import { Box, Typography, Autocomplete, TextField, Grid, Divider, Stack, Paper, MenuItem, Button } from '@mui/material';
import { useAuth } from '../../auth/AuthContext';
import { API_URL } from '../../api';
import { OwnerField, DetailRow } from '../../components/PetDetailsCard';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import { useNavigate } from 'react-router-dom';

const submenuItems = [
  { label: "Καταγραφή νέου Κατοικιδίου", path: "/vet/manage-pets/register-pet" },
  { label: "Kαταγραφή Ιατρικής Πράξης", path: "/vet/manage-pets/record-medical-action" },
  { label: "Καταγραφή Συμβάντος Ζωής", path: "/vet/manage-pets/record-life-event" },
  { label: "Προβολή Βιβλιαρίου Υγείας", path: "/vet/manage-pets/view-health-record" },
];

const RegisterEvent = () => {
  const navigate = useNavigate();
  const [pets, setPets] = useState([]);
  const [action, setAction] = useState('');
  const [owners, setOwners] = useState([]);
  const [selectedPet, setSelectedPet] = useState(null);

  const handleClickButton = () => {
    if(action === '') return;
    if(action === 'adoption') {
      navigate('/vet/manage-pets/record-life-event/adoption', { state: { pet: selectedPet } });
      return;
    }
  };

  const handleActionChange = (event) => {
    setAction(event.target.value);
  };
  
  const handleChange = (event, value) => {
    if(value === null || value === undefined || value === '') {
      setAction('');
    }
    setSelectedPet(value)
  };

  useEffect(() => {
    const fetchPets = async () => {
      try {
        const response = await fetch(`${API_URL}/pets`);
        const data = await response.json();
        setPets(data);
      } catch (error) {
        console.error('Error fetching pets:', error);
      }
    };
    const fetchOwners = async () => {
      try {
        const response = await fetch(`${API_URL}/users?role=owner`);
        const data = await response.json();
        setOwners(data);
      } catch (error) {
        console.error('Error fetching owners:', error);
      }
    };
    fetchOwners();
    fetchPets();
  }, []);

  const { isLoggedIn, user } = useAuth();

  if (!(isLoggedIn && user?.role === 'vet')) {
    return (
      <Typography variant="h6" color="error" textAlign="center" sx={{ mt: 10 }}>
        Παρακαλώ συνδεθείτε ως Κτηνίατρος για να συνεχίσετε.
      </Typography>
    );
  }

  return (
    <Box sx={{ display: 'flex', p: 2, flexDirection: 'row' }}>
      <Submenu submenuItems={submenuItems} />
      <Box sx={{ width: '75vw', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center' }}>
        <Typography variant="h4" sx={{ color: '#000000', fontWeight: 'bold' }}>
          Καταγραφή Συμβάντος Ζωής Κατοικιδίου
        </Typography>
        <Typography variant="body1" sx={{ mt: 2, textAlign: 'center' }}>
          Εδώ μπορείτε να καταγράψετε ένα συμβάν ζωής για το κατοικίδιο.
        </Typography>
        <Autocomplete
          disablePortal
          id="combo-box-pets"
          options={pets}
          onChange={handleChange}
          getOptionLabel={(option) => `${option.microchip} ${option.name}`}
          sx={{ width: 300, mt: 4 }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Επιλέξτε Κατοικίδιο"
              sx={{ backgroundColor: '#fff', borderRadius: 1 }}
            />
          )}
        />
        <Fragment>
          {selectedPet && (() => {
            const owner = owners.find(o => o.id === selectedPet?.ownerId);
            return (
              <>
                <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-start' }}>
                  <Paper 
                    elevation={0} 
                    sx={{ 
                      p: 4, 
                      ml: 2,
                      maxWidth: 900,
                      backgroundColor: '#F1D77A', 
                      borderRadius: '20px', 
                      border: '1px solid #000',
                      mt: 3
                    }}
                  >
                    <Grid container spacing={4}>
                      <Grid item xs={12} md={7} sx={{ display: 'flex', gap: 3 }}>
                        <Box sx={{ textAlign: 'center' }}>
                          <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2 }}>{selectedPet.name}</Typography>
                          <Box sx={{ width: 120, height: 120, border: '1px solid #000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <CameraAltIcon sx={{ fontSize: 40 }} />
                          </Box>
                        </Box>

                        <Box sx={{ flex: 1, minWidth: '250px', backgroundColor: 'rgba(255,255,255,0.2)', p: 2, borderRadius: '15px' }}>
                          <Stack spacing={3}>
                            <DetailRow label="Microchip:" value={selectedPet.microchip} />
                            <DetailRow label="Είδος:" value={selectedPet.species} />
                            <DetailRow label="Φύλο:" value={selectedPet.gender || "Μη ορισμένο"} />
                            <DetailRow label="Φυλή:" value={selectedPet.breed || "Ημίαιμο"} />
                            <DetailRow label="Ημ/νία Γέννησης:" value={selectedPet.birthDate || "-"} />
                            <DetailRow label="Βάρος:" value={selectedPet.weight || "-"} />
                            <DetailRow label="Χρώμα:" value={selectedPet.color || "-"} />
                          </Stack>
                        </Box>
                      </Grid>

                      <Divider orientation="vertical" flexItem sx={{ borderColor: '#000', display: { xs: 'none', md: 'block' }, mx: 2 }} />

                      <Grid item xs={12} md={4}>
                        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>Στοιχεία Ιδιοκτήτη</Typography>
                        <OwnerField label="Ονοματεπώνυμο" value={`${owner?.name || ""} ${owner?.surname || ""}`} />
                        <OwnerField label="Τηλέφωνο επικοινωνίας" value={owner?.phone || "-"} />
                        <OwnerField label="E-mail" value={owner?.email || "-"} />
                        <OwnerField label="Διεύθυνση κατοικίας" value={owner?.street ? `${owner.street} ${owner.city}, ${owner.postalCode}` : "Δεν έχει οριστεί"} />
                      </Grid>
                    </Grid>
                  </Paper>
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      ml: 4,
                      height: '100%',
                      py: 2,
                    }}
                  >
                    <TextField
                      select
                      value={action}
                      name="action"
                      onChange={handleActionChange}
                      label="Περιγραφή Συμβάντος"
                      multiline
                      rows={4}
                      variant="outlined"
                      sx={{
                        mt: 4,
                        ml: 2,
                        width: '15vw',
                        backgroundColor: '#fff',
                        borderRadius: 1,
                      }}
                    >
                      <MenuItem value="adoption">Υιοθεσία</MenuItem>
                      <MenuItem value="transfer">Μεταβίβαση</MenuItem>
                      <MenuItem value="foster">Αναδοχή</MenuItem>
                      <MenuItem value="death">Θάνατος</MenuItem>
                    </TextField>

                    <Button
                      disabled={action === '' ? true : false}
                      onClick={handleClickButton}
                      sx={{
                        py: 1.5,
                        mt: 2,
                        ml: 2,
                        width: '15vw',
                        color: '#fff',
                        fontWeight: 'bold',
                        borderRadius: 2,
                        backgroundColor: '#787047',
                        bottom: 20,
                        '&:hover': {
                          backgroundColor: '#5e5b36',
                        },
                      }}
                    >
                      Καταχώρηση Συμβάντος
                    </Button>
                  </Box>
                </Box>
              </>
            );
          })()}
        </Fragment>
      </Box>
    </Box>
  );
};

export default RegisterEvent;