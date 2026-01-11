import Submenu from '../../components/SubMenu';
import { useState, useEffect, Fragment, useRef } from 'react';
import { Box, Typography, Autocomplete, TextField, Grid, Divider, Stack, Paper, Button } from '@mui/material';
import { useAuth } from '../../auth/AuthContext';
import { API_URL } from '../../api';
import { OwnerField, DetailRow } from '../../components/PetDetailsCard';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import { TbVaccine } from 'react-icons/tb';
import { FaEyeDropper } from 'react-icons/fa';
import { LiaNotesMedicalSolid } from 'react-icons/lia';
import { LuPillBottle } from 'react-icons/lu';
import { PiScissorsBold, PiStethoscopeFill  } from 'react-icons/pi';
import { useNavigate } from 'react-router-dom';

const submenuItems = [
  { label: "Καταγραφή νέου Κατοικιδίου", path: "/vet/manage-pets/register-pet" },
  { label: "Kαταγραφή Ιατρικής Πράξης", path: "/vet/manage-pets/record-medical-action" },
  { label: "Καταγραφή Συμβάντος Ζωής", path: "/vet/manage-pets/record-life-event" },
  { label: "Προβολή Βιβλιαρίου Υγείας", path: "/vet/manage-pets/view-health-record" },
];

const RegisterMedical = () => {
  const [pets, setPets] = useState([]);
  const [owners, setOwners] = useState([]);
  const [selectedPet, setSelectedPet] = useState(null);
  const buttonRefs = useRef([]);
  const [maxButtonWidth, setMaxButtonWidth] = useState(0);
  
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

  useEffect(() => {
    const widths = buttonRefs.current.map(btn => btn?.offsetWidth || 0);
    setMaxButtonWidth(Math.max(...widths));
  }, [selectedPet]);

  const handleChange = (event, value) => setSelectedPet(value);

  const handleClickButton = (pet, idx) => {

    localStorage.setItem("activePetId", pet.id);
    
    if(idx === 0) {
      navigate('/vet/manage-pets/record-medical-action/record-vaccine', { state: { pet: pet } });
    }
    else if(idx === 1) {
      navigate('/vet/manage-pets/record-medical-action/record-deworming', { state: { pet: pet } });
    }
    else if(idx === 2) {
      navigate('/vet/manage-pets/record-medical-action/record-diagnostic-test', { state: { pet: pet } });
    }
    else if(idx === 3) {
      navigate('/vet/manage-pets/record-medical-action/record-treatment', { state: { pet: pet } });
    }
    else if(idx === 4) {
      navigate('/vet/manage-pets/record-medical-action/record-surgery', { state: { pet: pet } });
    }
    else if(idx === 5) {
      localStorage.setItem("viewHealthRecordFrom", "registerEvent");

      navigate('/healthRecord', { 
        state: { pet: pet } 
      });
    }
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
          Καταγραφή Ιατρικής Πράξης
        </Typography>
        <Typography variant="body1" sx={{ mt: 2, textAlign: 'center' }}>
          Εδώ μπορείτε να ενημερώσετε κατάλληλα το βιβλιάριο υγείας ενός κατοικιδίου
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
                        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>Στοιχεία Ιδιοκτήτη</Typography>
                        <OwnerField label="Ονοματεπώνυμο" value={`${owner?.name || ""} ${owner?.surname || ""}`} />
                        <OwnerField label="Τηλέφωνο επικοινωνίας" value={owner?.phone || "-"} />
                        <OwnerField label="E-mail" value={owner?.email || "-"} />
                        <OwnerField label="Διεύθυνση κατοικίας" value={owner?.street ? `${owner.street} ${owner.city}, ${owner.postalCode}` : "Δεν έχει οριστεί"} />
                      </Grid>
                    </Grid>
                  </Paper>

                  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', ml: 4, gap: 4, flexDirection: 'column' }}>
                    {[ [TbVaccine, 'Εμβολιασμός'], [FaEyeDropper, 'Αποπαρασίτωση'], [LiaNotesMedicalSolid, 'Διαγνωστικό Τεστ'], [LuPillBottle, 'Θεραπεία'], [PiScissorsBold, 'Χειρουργείο'], [PiStethoscopeFill , 'Βιβλιάριο Υγείας'] ].map((btn, idx) => {
                      const Icon = btn[0];
                      const label = btn[1];
                      return (
                        <Button
                          onClick={() => handleClickButton(selectedPet, idx)}
                          key={idx}
                          variant="contained"
                          ref={el => buttonRefs.current[idx] = el}
                          sx={{
                            py: 2,
                            backgroundColor: (idx === 5 )? '#FFD900' : '#9FCD95',
                            color: 'black',
                            textTransform: 'none',
                            fontWeight: 'bold',
                            borderRadius: 1,
                            border: '1px solid #000',
                            '&:hover': { backgroundColor: (idx === 5) ? '#ffe066' : '#bbe0b2' },
                            width: maxButtonWidth ? `${maxButtonWidth}px` : 'auto',
                          }}
                        >
                          <Icon style={{ fontSize: 24, marginRight: 8 }} />
                          {label}
                        </Button>
                      );
                    })}
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

export default RegisterMedical;
