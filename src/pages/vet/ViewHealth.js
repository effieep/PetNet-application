import Submenu from '../../components/SubMenu';
import { useState, useEffect, Fragment } from 'react';
import { Box, Typography, Autocomplete, TextField, Grid, Divider, Stack, Paper, Button } from '@mui/material';
import { useAuth } from '../../auth/AuthContext';
import { API_URL } from '../../api';
import { OwnerField, DetailRow } from '../../components/PetDetailsCard';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import { PiStethoscopeFill  } from 'react-icons/pi';
import { useNavigate } from 'react-router-dom';

const submenuItems = [
  { label: "Καταγραφή νέου Κατοικιδίου", path: "/vet/manage-pets/register-pet" },
  { label: "Kαταγραφή Ιατρικής Πράξης", path: "/vet/manage-pets/record-medical-action" },
  { label: "Καταγραφή Συμβάντος Ζωής", path: "/vet/manage-pets/record-life-event" },
  { label: "Προβολή Βιβλιαρίου Υγείας", path: "/vet/manage-pets/view-health-record" },
];

const VetViewHealthRecord = () => {
  const [pets, setPets] = useState([]);
  const [owners, setOwners] = useState([]);
  const [selectedPet, setSelectedPet] = useState(null);
  
  const navigate = useNavigate();

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

  const handleChange = (event,value) => setSelectedPet(value);

  const handleClickButton = (pet) => {

    localStorage.setItem("activePetId", pet.id);
    localStorage.setItem("viewHealthRecordFrom", "viewHealth");

    navigate('/healthRecord', { 
      state: { pet: pet } 
    });
  };

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
          Προβολή Βιβλιαρίου Υγείας Κατοικιδίου
        </Typography>
        <Typography variant="body1" sx={{ mt: 2, textAlign: 'center' }}>
          Επιλέξτε το κατοικίδιο για το οποίο θέλετε να προβάλετε το βιβλιάριο υγείας.
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
                <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                  <Paper 
                    elevation={0} 
                    sx={{
                      ml: 3, 
                      p: 4, 
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
                        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>{!selectedPet.ownerId.startsWith('FILOZ-') ? 'Στοιχεία Ιδιοκτήτη' : 'Στοιχεία Φιλοζωϊκής'}</Typography>
                        <OwnerField label={selectedPet.ownerId.startsWith('FILOZ-') ? 'Όνομα Φιλοζωϊκής Οργάνωσης' : 'Ονοματεπώνυμο'} value={selectedPet.ownerId.startsWith('FILOZ-') ? `${selectedPet.ownerId.split('FILOZ-')[1]}` : `${owner?.name || ""} ${owner?.surname || ""}`} />
                        {!selectedPet.ownerId.startsWith('FILOZ-') && (  
                        <>
                          <OwnerField label="Τηλέφωνο επικοινωνίας" value={owner?.phone || "-"} />
                          <OwnerField label="E-mail" value={owner?.email || "-"} />
                          <OwnerField label="Διεύθυνση κατοικίας" value={owner?.street ? `${owner.street} ${owner.city}, ${owner.postalCode}` : "Δεν έχει οριστεί"} />
                        </>
                        )}
                      </Grid>
                    </Grid>
                  </Paper>

                  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', ml: 4, gap: 4, flexDirection: 'column' }}>
                    <Button
                      onClick={() => handleClickButton(selectedPet)}
                      variant="contained"
                      sx={{
                        py: 2,
                        backgroundColor:'#FFD900' ,
                        color: 'black',
                        textTransform: 'none',
                        fontWeight: 'bold',
                        borderRadius: 1,
                        border: '1px solid #000',
                        '&:hover': '#ffe066'  ,
                        width: 'auto',
                      }}
                    >
                      <PiStethoscopeFill style={{ fontSize: 24, marginRight: 8 }} />
                      {'Προβολή Βιβλιαρίου Υγείας'}
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
}

export default VetViewHealthRecord;
