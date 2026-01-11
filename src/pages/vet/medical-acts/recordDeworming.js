import { Box, Button, Typography, TextField, MenuItem, Snackbar, Alert } from '@mui/material';
import QuickActions from '../../../components/QuickActions';
import { API_URL } from '../../../api';
import { useState, useEffect } from 'react';
import { useAuth } from '../../../auth/AuthContext';
import { FaEyeDropper } from 'react-icons/fa';

const reverseDateString = (dateStr) => {
  return dateStr.split('-').reverse().join('-');
}

const getTomorrowDate = () => {
  const date = new Date();
  date.setDate(date.getDate() + 1); // Add 1 day
  return date.toISOString().split('T')[0]; // Format to YYYY-MM-DD
};

const getTodayDate = () => {
  const date = new Date();
  return date.toISOString().split('T')[0]; // Format to YYYY-MM-DD
}

const RecordDeworming = () => {
  const { isLoggedIn, user } = useAuth()
  const [data, setData] = useState({
    date: '',
    type: '',
    product: '',
    nextDate: '',
    vetId: '',
  });
  const [pet, setPet] = useState(null);
  const [errors, setErrors] = useState({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  const openSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const closeSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  useEffect(() => {
    if(user) {
      setData(prev => ({ ...prev, vetId: user.id }));
    }
    const petId = localStorage.getItem("activePetId");
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
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const validateData = () => {
    const newErrors = {};
    if (!data.type) newErrors.type = 'Απαιτείται κατηγορία αποπαρασίτωσης.';
    if (!data.product) newErrors.product = 'Απαιτείται όνομα φαρμάκου.';
    if (!data.date) newErrors.date = 'Απαιτείται ημερομηνία.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if(!validateData()) return;
    setErrors({});

    try{
      const petId = localStorage.getItem("activePetId");
      const newDeworming = {
        type: data.type,
        product: data.product,
        date: reverseDateString(data.date),
        nextDate: reverseDateString(data.nextDate),
        vetId: data.vetId,
      };
      
      const updatedDewormings = [
        ...(pet.health.history?.deworming || []), newDeworming
      ];

      const payload = {
        health: {
          ...pet.health,
          overview: {
            ...pet.health.overview,
            lastDeworming: {
              internal: data.type === 'Εσωτερική' ? newDeworming.product : pet.health.overview.lastDeworming?.internal,
              external: data.type === 'Εξωτερική' ? newDeworming.product : pet.health.overview.lastDeworming?.external,
              nextInternal: data.type === 'Εσωτερική' ? newDeworming.nextDate : pet.health.overview.lastDeworming?.nextInternal,
              nextExternal: data.type  === 'Εξωτερική' ? newDeworming.nextDate : pet.health.overview.lastDeworming?.nextExternal,
            },
          },
          history: {
            ...pet.health.history,
            deworming: updatedDewormings,
          },
        },
      };


      const response = await fetch(`${API_URL}/pets/${petId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error('Failed to record deworming.');
      openSnackbar('Η αποπαρασίτωση καταχωρήθηκε επιτυχώς!', 'success');

      setPet((prevPet) => ({
        ...prevPet,
        health: {
          ...prevPet.health,
          history: {
            ...prevPet.health.history,
            deworming: updatedDewormings,
          },
          overview: {
            ...prevPet.health.overview,
            lastDeworming: {
              internal: data.type === 'Εσωτερική' ? newDeworming.product : prevPet.health.overview.lastDeworming?.internal,
              external: data.type === 'Εξωτερική' ? newDeworming.product : prevPet.health.overview.lastDeworming?.external,
              nextInternal: data.type === 'Εσωτερική' ? newDeworming.nextDate : prevPet.health.overview.lastDeworming?.nextInternal,
              nextExternal: data.type  === 'Εξωτερική' ? newDeworming.nextDate : prevPet.health.overview.lastDeworming?.nextExternal,
            },
          },
        },
      }));
      
      setData({
        date: '',
        type: '',
        product: '',
        nextDate: '',
        vetId: data.vetId,
      });
    } catch (error) {
      console.error('Error recording deworming:', error);
      openSnackbar('Σφάλμα κατά την καταχώρηση της αποπαρασίτωσης.', 'error');
    }

  };

  if(!isLoggedIn) {
    return (
      <Typography variant="h6" sx={{ mt: 4, textAlign: 'center' }}>
        Παρακαλώ συνδεθείτε για να καταχωρήσετε αποπαρασίτωση.
      </Typography>
    );
  }
  return (
  <>
  <Box sx=
    {{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column',
      height: '100%',
      mt: 4,
    }}
  >
    <Typography variant="h4" sx={{fontWeight: 'bold'}}><FaEyeDropper /> Καταγραφή Αποπαρασίτωσης</Typography>
    <Box sx={{ width: '70vw', mt: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#dabc28c7', p: 4, borderRadius: 2, border: '2px solid #000'}}>
      <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
        Όνομα: {pet ? pet.name : 'Φόρτωση...'}
      </Typography>
      <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
        Είδος: {pet ? pet.species : 'Φόρτωση...'}
      </Typography>
      <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
        Microchip: {pet ? pet.microchip : 'Φόρτωση...'}
      </Typography>
    </Box>
    <Box sx={{mt: 4, gap: 2, flexDirection: 'row', display: 'flex', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
      <TextField
        select
        label="Kατηγορία Αποπαρασίτωσης"
        sx={{ 
          '& .MuiInputBase-root': {
            backgroundColor: '#fff',
          },
          width: '20vw' 
        }}
        value={data.type}
        name="type"
        onChange={handleChange}
        helperText={errors.type || " "}
        error={Boolean(errors.type)}
        FormHelperTextProps={{ sx: { minHeight: '1.5em' } }}
        >
        <MenuItem value="Εσωτερική">Εσωτερική</MenuItem>
        <MenuItem value="Εξωτερική">Εξωτερική</MenuItem>
      </TextField>
      <TextField
        label="Όνομα Φαρμάκου"
        sx={{ 
          '& .MuiInputBase-root': {
            backgroundColor: '#fff',
          },
         }}
        value={data.product}
        name="product"
        onChange={handleChange}
        helperText={errors.product || " "}
        error={Boolean(errors.product)}
        FormHelperTextProps={{ sx: { minHeight: '1.5em' } }}
      />
      <TextField
        type="date"
        label="Hμερομηνία"
        sx={{ 
          '& .MuiInputBase-root': {
            backgroundColor: '#fff',
          }
         }}
        value={data.date}
        name="date"
        InputLabelProps={{ shrink: true }}
        inputProps={{max: getTodayDate()}}
        onChange={handleChange}
        helperText={errors.date || " "}
        error={Boolean(errors.date)}
        FormHelperTextProps={{ sx: { minHeight: '1.5em' } }}
      />
      <TextField
        type="date"
        label="Επόμενη Ημερομηνία"
        sx={{ 
          '& .MuiInputBase-root': {
            backgroundColor: '#fff',
          }
         }}
        value={data.nextDate}
        name="nextDate"
        InputLabelProps={{ shrink: true }}
        inputProps={{min: getTomorrowDate() }}
        onChange={handleChange}
        helperText={" "}
        FormHelperTextProps={{ sx: { minHeight: '1.5em' } }}
      />
    </Box>
    <Box sx=
      {{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        height: '100%',
        mt: 4,
      }}
    >

      <Box 
        sx={{ 
          p: 4, 
          borderRadius: 2,
          width: '70vw'
        }}
      >
        
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
          <Button
            onClick={handleSubmit}
            variant="contained"
            sx={{
              backgroundColor: '#2bad08', // Bright Green
              color: 'black',
              fontWeight: 'bold',
              textTransform: 'none',
              border: '1px solid black',
              fontSize: '1.1rem',
              px: 6,
              py: 1,
              boxShadow: 'none',
              borderRadius: '6px',
              '&:hover': {
                backgroundColor: '#249407',
                boxShadow: 'none',
              }
            }}
          >
            Καταχώρηση
          </Button>
        </Box>
        <QuickActions />
      </Box>
    </Box >
    <Snackbar
      open={snackbar.open}
      autoHideDuration={6000}
      onClose={closeSnackbar}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
    >
      <Alert onClose={closeSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
        {snackbar.message}
      </Alert>
    </Snackbar>
  </Box >
  </>
  );
};

export default RecordDeworming;