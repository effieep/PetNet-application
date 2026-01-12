import { Box, Typography, Autocomplete, TextField, Button, Snackbar, Alert, CircularProgress } from '@mui/material';
import { MdAlternateEmail } from 'react-icons/md';
import { FaPhoneAlt  } from 'react-icons/fa';
import { FaLocationDot } from 'react-icons/fa6';
import { useEffect, useState, Fragment } from 'react';
import { API_URL } from '../../../api';
import { useNavigate } from 'react-router-dom';

const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const reverseDate = (dateStr) => {
  const [year, month, day] = dateStr.split('-');
  return `${day}-${month}-${year}`;
}

const Foster = () => {

  const navigate = useNavigate();

  function removeTones(str) {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  }
  
  const [owner, setOwner] = useState({});
  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(false);
  const [owners, setOwners] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [formData, setFormData] = useState({
    newOwnerId: '',
    type: 'foster',
    date: reverseDate(new Date().toISOString().split('T')[0],),
    duration: '',
    reason: ''
  });
  useEffect(() => {
    const petId = localStorage.getItem('selectedPetIdForEvent');
    const fetchPet = async () => {
      try {
        const response = await fetch(`${API_URL}/pets/${petId}`);
        const data = await response.json();
        setPet(data);
      } catch (error) {
        console.error('Error fetching pet:', error);
      } 
    };
    fetchPet();


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

    const owner = owners.find(o => o.id === pet?.ownerId);
    if(owner) {
      setOwner(owner);
    }
  }, [owners, pet]);

  const closeSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  }

  const openSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  }


  const handleSubmit = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/pets/${pet.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...pet,
          ownerId: formData.newOwnerId,
          health: {
            ...pet.health,
            history: {
              ...(pet.health.history || {}),
              lifeEvents: [
                ...(pet.health.history?.lifeEvents || []),
                {
                  type: 'foster',
                  date: formData.date,
                  OwnerId: pet.ownerId,
                  tempOwnerId: formData.newOwnerId,
                  duration: formData.duration,
                  reason: formData.reason
                }
              ],
            }
          }
        }),
      });
      if(response.ok) {
        openSnackbar('Η αναδοχή καταχωρήθηκε με επιτυχία!', 'success');
        await wait(5000);
        navigate('/vet/manage-pets/record-life-event');
        setLoading(false);
        setPet(
          { ...pet, 
            ownerId: formData.newOwnerId,
            health: {
              ...pet.health,
              history: {
                ...pet.health.history,
                lifeEvents: [
                  ...(pet.health.history.lifeEvents || []),
                  {
                    type: 'foster',
                    date: formData.date,
                    OwnerId: pet.ownerId,
                    tempOwnerId: formData.newOwnerId,
                    duration: formData.duration,
                    reason: formData.reason
                  }
                ]
              }
            } 
          }
        )
      } else {
        openSnackbar('Σφάλμα κατά την καταχώρηση της αναδοχής. Παρακαλώ δοκιμάστε ξανά.', 'error');
      }
    } catch (error) {
      console.error('Error submitting foster:', error);
    }
  };
  if(loading){

    return (
      <>
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <CircularProgress />
      </Box>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={closeSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={closeSnackbar}
          severity={snackbar.severity}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}
  return (
    <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2, alignSelf: 'center' }}>
        Αναδοχή Κατοικιδίου
      </Typography>
      <Typography variant="body1" sx={{ alignSelf: 'center' }}>
        Το ζώο παραδίδεται από μία φιλοζωική/καταφύγιο ή εναν ιδιοκήτη σε έναν ανάδοχο ιδιοκτήτη (προσωρινά)
      </Typography>
      <Box sx ={{ display: 'flex', flexDirection: 'column', ml: 4 }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold', mt: 4}}>
          1. Κατοικίδιο προς αναδοχή:
        </Typography>
        <Box sx={{ width: '34vw', mt: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#dabc28c7', p: 4, borderRadius: 2, border: '2px solid #000', alignSelf: 'center' }}>
          <Typography variant="h7" sx={{ fontWeight: 'bold' }}>
            Όνομα: {pet ? pet.name : 'Φόρτωση...'}
          </Typography>
          <Typography variant="h7" sx={{ fontWeight: 'bold' }}>
            Είδος: {pet ? pet.species : 'Φόρτωση...'}
          </Typography>
          <Typography variant="h7" sx={{ fontWeight: 'bold' }}>
            Microchip: {pet ? pet.microchip : 'Φόρτωση...'}
          </Typography>
        </Box>
        <Fragment>
          {pet && pet.ownerId.startsWith('FILOZ-') ? (
            <Typography variant="h6" sx={{ fontWeight: 'bold', mt: 4}}>
              2. Παρούσα Φιλοζωϊκή Οργάνωση: {pet.ownerId.split('FILOZ-')[1]}
            </Typography>
            ) : (
            <>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mt: 4}}>
              2. Παρόν Ιδιοκτήτης:
            </Typography>
            <Box
              sx={{
                width: '34vw',
                mt: 2,
                backgroundColor: '#96a50b7c',
                borderRadius: 3,
                boxShadow: 3,
                textAlign: 'center',
                alignSelf: 'center',
              }}
            >
              <Typography variant="h5" sx={{ color: '#000000', fontWeight: 'bold', p: 2 }}>
                {owner.name} {owner.surname}
              </Typography>
              <Typography variant="h6" sx={{ color: '#535252' }}>
                Α.Φ.Μ.: {owner.afm}
              </Typography>
              <Typography variant="h6" sx={{ color: '#535252' }}>
                <MdAlternateEmail style={{ verticalAlign: 'middle', marginRight: '8px' }} /> {owner.email}
              </Typography>
              <Typography variant="h6" sx={{ color: '#535252' }}>
                <FaPhoneAlt style={{ verticalAlign: 'middle', marginRight: '8px' }} /> {owner.phone}
              </Typography>
              <Typography variant="h6" sx={{ color: '#535252', pb: 2 }}>
                <FaLocationDot style={{ verticalAlign: 'middle', marginRight: '8px' }} /> {owner.street} {owner.city}, {owner.postalCode}
              </Typography>
            </Box>
            </>
          )}
        </Fragment>
        <Typography variant="h6" sx={{ fontWeight: 'bold', mt: 4}}>
          3. Νέος Ιδιοκτήτης:
        </Typography>
        <Autocomplete
          sx={{ alignSelf: 'center',}}
          noOptionsText="Δεν βρέθηκαν αποτελέσματα"
          options={owners.filter(o => o.id !== pet?.ownerId)}
          filterOptions={(options, { inputValue }) => {
            const normalizedInput = removeTones(inputValue);
            return options.filter(option =>
              removeTones(`${option.name} ${option.surname} ${option.afm}`).includes(normalizedInput)
            );
          }}
          getOptionLabel={(option) => `${option.name} ${option.surname} - ${option.afm}`}
          value={owners.find(o => o.id === formData.newOwnerId) || null}
          onChange={(event, newValue) => {
            setFormData(prev => ({ ...prev, newOwnerId: newValue ? newValue.id : '' }));
          }}
          ListboxProps={{
            sx: { maxHeight: '20vh', overflowY: 'auto' }
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Ιδιοκτήτης"
              variant="outlined"
              fullWidth
              sx={{ '& .MuiInputBase-root': { width: '50vh' }, mt: 2, backgroundColor: '#fff', borderRadius: 1 }}
            />
          )}
        />
        {formData.newOwnerId !== '' && (
        <Box
          sx={{
            width: '34vw',
            mt: 2,
            backgroundColor: '#96a50b7c',
            borderRadius: 3,
            boxShadow: 3,
            textAlign: 'center',
            alignSelf: 'center',
          }}
        >
          <Fragment>
            {(() => {
              const owner = owners.find(o => o.id === formData.newOwnerId);
              if (!owner) return null;
              return (
                <>
                  <Typography variant="h5" sx={{ color: '#000000', fontWeight: 'bold', p: 2 }}>
                    {owner.name} {owner.surname}
                  </Typography>
                  <Typography variant="h6" sx={{ color: '#535252' }}>
                    Α.Φ.Μ.: {owner.afm}
                  </Typography>
                  <Typography variant="h6" sx={{ color: '#535252' }}>
                    <MdAlternateEmail style={{ verticalAlign: 'middle', marginRight: '8px' }} /> {owner.email}
                  </Typography>
                  <Typography variant="h6" sx={{ color: '#535252' }}>
                    <FaPhoneAlt style={{ verticalAlign: 'middle', marginRight: '8px' }} /> {owner.phone}
                  </Typography>
                  <Typography variant="h6" sx={{ color: '#535252', pb: 2 }}>
                    <FaLocationDot style={{ verticalAlign: 'middle', marginRight: '8px' }} /> {owner.street} {owner.city}, {owner.postalCode}
                  </Typography>
                </>
              );
            })()}
          </Fragment>
        </Box>

)}

      <TextField
        label="Λόγος Αναδοχής"
        variant="outlined"
        fullWidth
        multiline
        rows={3}
        value={formData.reason || ''}
        onChange={(e) => setFormData(prev => ({ ...prev, reason: e.target.value }))}
        sx={{ mt: 2, backgroundColor: '#fff', borderRadius: 1 }}
      />
      <TextField
        label="Διάρκεια Αναδοχής (σε ημέρες)*"
        variant="outlined"
        fullWidth
        multiline
        value={formData.duration || ''}
        onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
        sx={{ width: "20vw", mt: 2, backgroundColor: '#fff', borderRadius: 1 }}
      />
      <Button
        disabled={formData.newOwnerId === '' || formData.duration === ''}
        onClick={handleSubmit}
        sx = {{
          width: "10vw",
          backgroundColor: "#3B6134",
          borderRadius: 2,
          color: "#fff",
          fontWeight: "bold",
          mt: 4,
          alignSelf: "center",
          border: "1px solid #000",
          '&:hover': {
            backgroundColor: '#117e17',
          },
          '&.Mui-disabled': {
            backgroundColor: '#a5a5a5',
            color: '#666666',
            border: '1px solid #888888',
          },
        }}
      >
        Καταχώρηση Αναδοχής
      </Button>
      </Box>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={closeSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={closeSnackbar}
          severity={snackbar.severity}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default Foster;