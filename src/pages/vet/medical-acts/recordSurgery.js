import { Box, Button, TextField, Typography, Snackbar, Alert, FormControlLabel, Checkbox } from '@mui/material';
import QuickActions from '../../../components/QuickActions';
import { PiScissorsBold } from 'react-icons/pi';
import { useState, useEffect } from 'react';
import { API_URL } from '../../../api';
import { useAuth } from '../../../auth/AuthContext';

const reverseDateString = (dateStr) => {
  return dateStr.split('-').reverse().join('-');
}

const getTodayDate = () => {
  const date = new Date();
  return date.toISOString().split('T')[0]; // Format to YYYY-MM-DD
}

let neuteredVar = false;
const RecordSurgery = () => {
  const { isLoggedIn, user } = useAuth()
  const [isSpayChecked, setIsSpayChecked] = useState(false);
  const [data, setData] = useState({
    date: '',
    title: '',
    notes: '',
    vet: '',
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
      setData(prev => ({ ...prev, vet: user.name, vetId: user.id }) );
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
    if (!data.title) newErrors.title = 'Απαιτείται όνομα επέμβασης.';
    if (!data.date) newErrors.date = 'Απαιτείται ημερομηνία έναρξης.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCheckboxChange = (e) => {
    const checked = e.target.checked;
    setIsSpayChecked(checked);
    setData((prevData) => ({
      ...prevData,
      title: checked ? 'Στείρωση' : '',
    }));
    neuteredVar = (checked) ? true : false;
  };

  const handleSubmit = async () => {
    if(!validateData()) return;
    setErrors({});
    setIsSpayChecked(false);

    try{
      const petId = localStorage.getItem("activePetId");
      const newSurgery = {
        date: reverseDateString(data.date),
        title: data.title,
        notes: data.notes,
        vet: user.name,
        vetId: user.id,
      };
      
      const updatedSurgeries = [
        ...(pet.health.history.medicalActs?.surgeries || []), newSurgery
      ];

      const payload = {
        health: {
          ...pet.health,
          neutered: neuteredVar,
          overview: {
            ...pet.health.overview,
          },
          history: {
            ...pet.health.history,
            medicalActs: {
              ...pet.health.history.medicalActs,
              surgeries: updatedSurgeries,
          },
          },
        },
      };


      const response = await fetch(`${API_URL}/pets/${petId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error('Failed to record surgery.');
      openSnackbar('Η χειρουργική επέμβαση καταχωρήθηκε επιτυχώς!', 'success');

      setPet((prevPet) => ({
        ...prevPet,
        health: {
          neutered: neuteredVar,
          ...prevPet.health,
          history: {
            ...prevPet.health.history,
            medicalActs: {
              ...prevPet.health.history.medicalActs,
              surgeries: updatedSurgeries,
            },
          },
          overview: {
            ...prevPet.health.overview,
          },
        },
      }));
      
      setData({
        date: '',
        title: '',
        notes: '',
        vet: data.vet,
        vetId: data.vetId,
      });
      neuteredVar = false;
    } catch (error) {
      console.error('Error recording surgery:', error);
      openSnackbar('Σφάλμα κατά την καταχώρηση της χειρουργικής επέμβασης.', 'error');
    }

  };

  if(!isLoggedIn) {
    return (
      <Typography variant="h6" sx={{ mt: 4, textAlign: 'center' }}>
        Παρακαλώ συνδεθείτε για να καταχωρήσετε διαγνωστική εξέταση.
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
    <Typography variant="h4" sx={{fontWeight: 'bold'}}><PiScissorsBold /> Καταγραφή Χειρουργικής Επέμβασης</Typography>
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
      <Box sx={{ display: 'flex', flexDirection: 'column'}}>
        <TextField
          label="Τίτλος Επέμβασης"
          sx={{ '& .MuiInputBase-root': { backgroundColor: '#fff' } }}
          value={data.title}
          name="title"
          onChange={handleChange}
          helperText={errors.title || " "}
          error={Boolean(errors.title)}
          FormHelperTextProps={{ sx: { minHeight: '1.5em' } }}
          disabled={isSpayChecked} // Disable if checkbox checked
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={isSpayChecked}
              onChange={handleCheckboxChange}
            />
          }
          label="Επέμβαση στείρωσης"
        />
      </Box>
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
        FormHelperTextProps={{ sx: { minHeight: '5em' } }}
      />
      <TextField
        label="Λόγος Επέμβασης/Σημειώσεις"
        sx={{ 
          '& .MuiInputBase-root': {
            backgroundColor: '#fff',
          },
          width: '20vw'
        }}
        value={data.notes}
        name="notes"
        onChange={handleChange}
        helperText={" "}
        FormHelperTextProps={{ sx: { minHeight: '5em' } }}
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

export default RecordSurgery;