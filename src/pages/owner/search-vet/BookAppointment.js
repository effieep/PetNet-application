import { TextField, Typography, Button, Box, Stack, MenuItem, Stepper, Step, StepLabel, Divider } from '@mui/material';
import { Calendar, Stethoscope, MapPin } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { API_URL } from '../../../api';
import { useAuth } from '../../../auth/AuthContext.jsx';
import PetPreviewCard from '../../../components/PetPreviewCard';
import PetDetailsCard from '../../../components/PetDetailsCard';
import { LuClipboardPen } from 'react-icons/lu';

const textStyle = {
  fontWeight: 700,
  letterSpacing: '0.025em',
  color: '#1a1a1a',
  fontSize: { xs: '1.1rem', sm: '1.25rem' }
};

const headerBoxStyle = {
  border: '1px solid #1a1a1a',
  py: 1,
  px: 4,
  textAlign: 'center',
  mb: 4,
  display: 'inline-block',
};

const headerTextStyle = {
  ...textStyle,
  fontSize: { xs: '1.1rem', sm: '1.25rem' },
};

const getDayAsString = (dateStr, timeStr) => {
  const [day, month, year] = dateStr.split('/');
  const [hours, minutes] = timeStr.split(':');
  const date = new Date(year, month - 1, day, hours, minutes);
  const numDay = date.getDay();
  const daysOfWeek = ['Κυριακή', 'Δευτέρα', 'Τρίτη', 'Τετάρτη', 'Πέμπτη', 'Παρασκευή', 'Σάββατο'];
  const dayName = daysOfWeek[numDay];
  const monthNames = ['Ιανουαρίου', 'Φεβρουαρίου', 'Μαρτίου', 'Απριλίου', 'Μαΐου', 'Ιουνίου', 'Ιουλίου', 'Αυγούστου', 'Σεπτεμβρίου', 'Οκτωβρίου', 'Νοεμβρίου', 'Δεκεμβρίου'];
  const monthName = monthNames[parseInt(month, 10) - 1];
  return `${dayName}, ${day} ${monthName} ${year} στις ${timeStr}`;
};

const steps = ['Επιλογή Ραντεβού', 'Επιλογή Κατοικιδίου', 'Σύνοψη & Επιβεβαίωση'];

const BookAppointment = () => {

  const { isLoggedIn, user } = useAuth();
  const [errorMessage, setErrorMessage] = useState('');
  const [pets, setPets] = useState([]);
  const location = useLocation();
  const { vetId, slotId } = location.state || {};
  const [vetData, setVetData] = useState(null);
  const [slotData, setSlotData] = useState(null);
  const [appointmentType, setAppointmentType] = useState('');
  const [activeStep, setActiveStep] = useState(0);
  const [selectedPetId, setSelectedPetId] = useState(null);
  const [previewPetId, setPreviewPetId] = useState(null);

  const handleSelectPet = (pet) => {
    setSelectedPetId(pet.id);
    setPreviewPetId(pet.id);
  };

  const handlePreviewPet = (pet) => {
    setPreviewPetId(pet.id);
  };


  const changeAppointmentType = (event) => setAppointmentType(event.target.value);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchVet = async () => {
      try {
        const response = await fetch(`${API_URL}/users/${vetId}`);
        const data = await response.json();
        setVetData(data);
        setSlotData(data?.availability?.find(slot => slot.id === slotId) || null);
      } catch (error) {
        console.error('Error fetching vet data:', error);
      }
    };
    fetchVet();

    const fetchPets = async () => {
      try {
        const response = await fetch(`${API_URL}/pets?ownerId=${user.id}`);
        const data = await response.json();
        setPets(data);
      } catch (error) {
        console.error('Error fetching pets:', error);
      }
    };
    if(isLoggedIn) {
      fetchPets();
    }
  }, [vetId, slotId, isLoggedIn, user]);

  const handleNext = async () => {
    if(activeStep === steps.length - 1) {
      try{
        const response = await fetch(`${API_URL}/users/${vetId}/`);
        if (!response.ok) {
          throw new Error('Αποτυχία λήψης δεδομένων κτηνιάτρου.');
        }
        const vetData = await response.json();

        const updatedAvailability = vetData.availability.filter(slot => slot.id !== slotId);

        const updatedResponse = await fetch(`${API_URL}/users/${vetId}/`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ availability: updatedAvailability }),
        });

        if (!updatedResponse.ok) {
          throw new Error('Αποτυχία ενημέρωσης διαθεσιμότητας κτηνιάτρου.');
        }
        
        const appointmentResponse = await fetch(`${API_URL}/appointments/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ownerId: user.id,
            petId: selectedPetId,
            vetId: vetId,
            date: slotData.date.replace(/\//g, '-'),
            time: slotData.time,
            status: 'PENDING',
            reason: appointmentType,
            reviewed: false,
          }),
        });

        if(!appointmentResponse.ok) {
          throw new Error('Αποτυχία δημιουργίας ραντεβού.');
        }
      } catch (error) {
        console.error('Error booking appointment:', error);
        setErrorMessage('Αποτυχία δημιουργίας ραντεβού. Παρακαλώ δοκιμάστε ξανά αργότερα. Λάθος: ' + error.message);
      }
      setActiveStep(prev => prev + 1);
      setTimeout(() => {
        window.location.href = '/owner/search-vet';
      }, 4000);
      return;

    }
    window.scrollTo(0, 0);
    setActiveStep(prev => prev + 1);
  };
  const handleBack = () => {
    if(activeStep === 0) return;
    window.scrollTo(0, 0);
    if(activeStep === 1) {
      setSelectedPetId(null);
      setPreviewPetId(null);
    }
    setActiveStep(prev => prev - 1);
  };

  const renderStepContent = () => {
    switch(activeStep) {
      case 0:
        return (
          <Box 
            sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              flexDirection: 'column',
              position: 'relative',
              pt: 8,
              p: 4,
              mb: 6
            }}
          > 
            <Box>
              <TextField
                select
                onChange={changeAppointmentType}
                value={appointmentType}
                label="Τύπος Ραντεβού"
                variant="outlined"
                placeholder="Αναζήτηση Κτηνιάτρου"
                sx={{ flex: 1, mb: 4, alignSelf: 'flex-start', backgroundColor: '#FFFFFF', width: '20vw' }}
              >
                <MenuItem value="Απλή Επίσκεψη">Απλή Επίσκεψη</MenuItem>
                <MenuItem value="Εμβολιασμός">Εμβολιασμός</MenuItem>
                <MenuItem value="Στειρώση">Στειρώση</MenuItem>
                <MenuItem value="Διαγνωστικές Εξετάσεις">Διαγνωστικές Εξετάσεις</MenuItem>
                <MenuItem value="Θεραπεία">Θεραπεία</MenuItem>
                <MenuItem value="Χειρουργική Επέμβαση">Χειρουργική Επέμβαση</MenuItem>
                <MenuItem value="Άλλο">Άλλο</MenuItem>

              </TextField>
              <Button
                disabled={!appointmentType}
                onClick={handleNext}
                variant="contained"
                color="primary"
                sx={{ fontSize: '1.2rem', mb: 1, py: 2, position: 'absolute', right: 35, textTransform: 'none', backgroundColor: '#250056', '&:hover': { backgroundColor: '#3b007a' }, fontWeight: 'bold', borderRadius: 2 }}
              >
                Συνέχεια
              </Button>
              <Box 
                sx={{ 
                  flex: 1,
                  width: '70vw', 
                  bgcolor: '#FFFDF5', 
                  borderRadius: 2, 
                  p: { xs: 4, sm: 6 },
                  boxShadow: 1
                }}
              >
                
                <Stack spacing={4}>
                  
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 3 }}>
                    <Box sx={{ mt: 0.5 }}>
                      <Calendar size={28} color="#1a1a1a" strokeWidth={2} />
                    </Box>
                    <Typography sx={textStyle}>
                      {`${slotData ? getDayAsString(slotData.date, slotData.time) : ''}`}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 3 }}>
                    <Box sx={{ mt: 0.5 }}>
                      <Stethoscope size={28} color="#1a1a1a" strokeWidth={2} />
                    </Box>
                    <Typography sx={textStyle}>
                      {`Κτηνίατρος : ${vetData?.name} ${vetData?.surname}`}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 3 }}>
                    <Box sx={{ mt: 0.5, position: 'relative' }}>
                      <MapPin size={28} color="#1a1a1a" fill="#1a1a1a" />
                      <Box 
                        sx={{ 
                          position: 'absolute', 
                          top: '8px', 
                          left: '10px', 
                          width: '8px', 
                          height: '8px', 
                          bgcolor: '#FFFDF5', 
                          borderRadius: '50%' 
                        }} 
                      />
                    </Box>
                    <Typography sx={textStyle}>
                      {`Διεύθυνση Κλινικής: ${vetData?.clinicAddress}, ${vetData?.clinicCity}, ${vetData?.clinicZip}`}
                    </Typography>
                  </Box>

                </Stack>

                <Box
                  component="iframe"
                  sx={{
                    width: "100%",
                    borderRadius: "12px",
                    height: "50vh",
                    mt: 4,
                    border: "2px solid #000000",
                  }}
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(vetData?.clinicAddress + " " + vetData?.clinicCity + " " + vetData?.clinicZip)}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                />
                </Box>
              </Box>

            </Box>
        );
      case 1:
        return (
          <Box
            sx={{
              boxShadow: 3,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              gap: 3,
              backgroundColor: '#9a9b6ac9',
              p: 4,
              borderRadius: 2,
              width: '100%',
              position: 'relative',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                gap: 3,
                flexWrap: 'nowrap',
                overflowX: 'auto',
                width: '100%',
                py: 2,
                '&::-webkit-scrollbar': {
                  height: '8px',
                },
                '&::-webkit-scrollbar-thumb': {
                  backgroundColor: '#888',
                  borderRadius: '4px',
                },
              }}
            >
              {pets.map((pet) => (
                <Box
                  key={pet.id}
                  sx={{
                    flex: "0 0 auto",
                    width: {
                      xs: "100%",
                      sm: "calc((100% - 24px) / 2)",
                      md: "calc((100% - 48px) / 3)",
                    },
                  }}
                >
                  <PetPreviewCard
                    key={pet.id}
                    pet={pet}
                    wrapInGrid={false}
                    selected={selectedPetId === pet.id}
                    onCardClick={() => handleSelectPet(pet)}
                    onPreview={() => handlePreviewPet(pet)}
                    cardSx={{ outline: selectedPetId === pet.id ? '5px solid #1c960c' : 'none', mx: 1, transition: "transform 150ms ease","&:hover": { transform: "translateY(-10px)" } }}
                  />
                </Box>
              ))}
            </Box>

              {previewPetId && (
                <Box sx={{width: '100%', alignItems: 'center', display: 'flex', flexDirection: 'column', mb: 4 }}>
                  <Divider sx={{ mb: 2 }} />
                  <PetDetailsCard petId={previewPetId} />
                </Box>
              )}

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
              <Button
                onClick={handleBack}
                variant="contained"
                color="primary"
                sx={{ fontSize: '1.2rem', mb: 1, py: 2, position: 'absolute', left: 35, bottom: 0, textTransform: 'none', backgroundColor: '#22549e', '&:hover': { backgroundColor: '#477dcf' }, fontWeight: 'bold', borderRadius: 2 }}
              >
                Πίσω
              </Button>
              <Button
                disabled={!selectedPetId}
                onClick={handleNext}
                variant="contained"
                color="primary"
                sx={{ fontSize: '1.2rem', mb: 1, py: 2, position: 'absolute', right: 35, bottom: 0, textTransform: 'none', backgroundColor: '#250056', '&:hover': { backgroundColor: '#3b007a' }, fontWeight: 'bold', borderRadius: 2 }}
              >
                Συνέχεια
              </Button>
            </Box>
          </Box>
        );
      case 2:
        return (
          <Box 
            sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'start', 
              pb: 2,
              mb: 6,
              position: 'relative',
            }}
          >
            <Box 
              sx={{ 
                width: '100%', 
                maxWidth: '850px', 
                bgcolor: '#FFFDF5',
                borderRadius: '12px', 
                p: { xs: 3, sm: 5 }, 
                border: '1px solid #C0B07D',
                mb: 15
              }}
            >
              <Stack 
                direction={{ xs: 'column', md: 'row' }} 
                spacing={{ xs: 4, md: 0 }}
                divider={
                  <Divider 
                    orientation="vertical" 
                    flexItem 
                    sx={{ 
                      borderColor: '#A0A0A0', 
                      borderWidth: '1px',
                      display: { xs: 'none', md: 'block' }
                    }} 
                  />
                }
              >
                <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <Box sx={headerBoxStyle}>
                    <Typography sx={headerTextStyle}>
                      Ραντεβού
                    </Typography>
                  </Box>

                  <Stack spacing={3} sx={{ width: '100%', maxWidth: '350px' }}>
                    <Box sx={{ display: 'flex', alignItems: 'start', gap: 2 }}>
                      <Calendar size={24} color="#1a1a1a" strokeWidth={2} style={{ marginTop: '2px' }} />
                      <Typography sx={textStyle}>
                        {getDayAsString(slotData.date, slotData.time)}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'start', gap: 2 }}>
                      <Stethoscope size={24} color="#1a1a1a" strokeWidth={2} style={{ marginTop: '2px' }} />
                      <Typography sx={textStyle}>
                        Κτηνίατρος : {vetData?.name} {vetData?.surname}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'start', gap: 2 }}>
                      <MapPin size={24} color="#1a1a1a" fill="#1a1a1a" style={{ marginTop: '2px' }} />
                      <Typography sx={textStyle}>
                        {`${vetData?.clinicAddress}, ${vetData?.clinicCity}, ${vetData?.clinicZip}`}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'start', gap: 2 }}>
                      <LuClipboardPen size={24} color="#1a1a1a" style={{ marginTop: '2px' }} />
                      <Typography sx={textStyle}>
                        {`${appointmentType}`}
                      </Typography>
                    </Box>
                  </Stack>
                </Box>

                <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <Box sx={headerBoxStyle}>
                    <Typography sx={headerTextStyle}>Στοιχεία Χρήστη</Typography>
                  </Box>

                  <Stack 
                    spacing={3} 
                    sx={{ 
                      width: '100%', 
                      maxWidth: '350px', 
                      alignItems: 'center',
                      textAlign: 'center'
                    }}
                  >
                    <Typography sx={textStyle}>{user.name} {user.surname}</Typography>
                    <Typography sx={textStyle}>{user.email}</Typography>
                    <Typography sx={textStyle}>{user.phone}</Typography>
                    <Box sx={headerBoxStyle}>
                      <Typography sx={headerTextStyle}>Στοιχεία Κατοικιδίου</Typography>
                    </Box>
                    <Typography sx={textStyle}>{pets.find(p => p.id === selectedPetId)?.name}</Typography>
                    <Typography sx={textStyle}>{pets.find(p => p.id === selectedPetId)?.species} - {pets.find(p => p.id === selectedPetId)?.breed}</Typography>
                    <Typography sx={textStyle}>{pets.find(p => p.id === selectedPetId)?.microchip}</Typography>
                  </Stack>
                </Box>
              </Stack>
            </Box>
            <Button
              onClick={handleBack}
              variant="contained"
              color="primary"
              sx={{ fontSize: '1.2rem', mb: 1, py: 2, position: 'absolute', left: 180, bottom: 0, textTransform: 'none', backgroundColor: '#22549e', '&:hover': { backgroundColor: '#477dcf' }, fontWeight: 'bold', borderRadius: 2 }}
            >
              Πίσω
            </Button>
            <Button
              disabled={!selectedPetId}
              onClick={handleNext}
              variant="contained"
              color="primary"
              sx={{ fontSize: '1.2rem', mb: 1, py: 2, position: 'absolute', right: 180, bottom: 0, textTransform: 'none', backgroundColor: '#0d7a1f', '&:hover': { backgroundColor: '#51da68' }, fontWeight: 'bold', borderRadius: 2 }}
            >
              Ολοκλήρωση
            </Button>
          </Box>
        );
      case 3:
        return (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              py: 8,
              px: 4,
            }}
          >
            {errorMessage === '' ? (
            <>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 'bold',
                  color: '#000000',
                  textAlign: 'center',
                }}
              >
                Το ραντεβού σας έχει κλειστεί με επιτυχία! Θα ανακατευθυνθείτε στην <Link to="/owner/search-vet" style={{ textDecoration: 'underline', color: '#250056', fontWeight: 'bold' }}> Αναζήτηση Κτηνιάτρου </Link>σε λίγα δευτερόλεπτα... 
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 'bold',
                  color: '#000000',
                  mb: 4,
                  textAlign: 'center',
                }}
              >
                Αλλιώς, πατήστε τον σύνδεσμο παραπάνω.
              </Typography>
            </>
            ) : (
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 'bold', 
                  color: '#000000',
                  textAlign: 'center',
                }}
              >
                {errorMessage}
              </Typography>
            )}
          </Box>
        );
      default:
        return null;
    }
  }

  if(!isLoggedIn || user.role !== 'owner') {
    return (
      <Box sx={{ pt: 8, textAlign: 'center' }}>
        <Typography variant="h5" color="error" sx={{ fontWeight: 'bold' }}>
          Παρακαλώ συνδεθείτε με λογαριασμό ιδιοκτήτη κατοικιδίου για να κλείσετε ραντεβού.
        </Typography>
      </Box>
    );
  }
  return (
    <Box sx={{ width: '80vw', mx: 'auto', pt: 8 }}>
      <Stepper 
          activeStep={activeStep} 
          alternativeLabel
          sx={{
            '& .MuiStepConnector-root': {
              top: '30%', 
              left: 'calc(-50% + 34px)',
              right: 'calc(50% + 34px)',
            },
            '& .MuiStepConnector-line': {
              borderTopWidth: 3,    
              borderColor: '#000000', 
            },
            '& .MuiStepLabel-label': {
              fontSize: '1.3rem',       
              fontWeight: 'bold',       
            },
            '& .MuiStepIcon-root.Mui-completed': {
              color: '#317728',
            },
          }}
        >
        {steps.map(label => (
          <Step key={label}>
            <StepLabel
              sx={{
                '& .MuiStepIcon-root': {
                  fontSize: '4rem',
                }
              }}
            >
              {label}
            </StepLabel>
          </Step>
        ))}
      </Stepper>

      <Box sx={{ mt: 4 }}>
        {renderStepContent()}
      </Box>
    </Box>
  );
};

export default BookAppointment;
