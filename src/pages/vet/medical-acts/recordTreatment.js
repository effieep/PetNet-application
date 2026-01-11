import { Box, Button, TextField, Typography, Snackbar, Alert } from '@mui/material';
import QuickActions from '../../../components/QuickActions';
import { LuPillBottle } from 'react-icons/lu';
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

const RecordTreatment = () => {
  const { isLoggedIn, user } = useAuth()
    const [data, setData] = useState({
      startDate: '',
      name: '',
      issue: '',
      instructions: '',
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
        setData(prev => ({ ...prev, vetId: user.id }) );
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
      if (!data.name) newErrors.name = 'Απαιτείται όνομα θεραπείας.';
      if (!data.startDate) newErrors.startDate = 'Απαιτείται ημερομηνία έναρξης.';
  
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };
  
    const handleSubmit = async () => {
      if(!validateData()) return;
      setErrors({});
  
      try{
        const petId = localStorage.getItem("activePetId");
        const newMedication = {
          startDate: reverseDateString(data.startDate),
          name: data.name,
          issue: data.issue,
          instructions: data.instructions,
          vetId: user.id,
        };
        
        const updatedMedication = [
          ...(pet.health.medicalActs?.medication || []), newMedication
        ];
  
        const payload = {
          health: {
            ...pet.health,
            overview: {
              ...pet.health.overview,
            },
            history: {
              ...pet.health.history,
            },
            medicalActs: {
              ...pet.health.medicalActs,
              medication: updatedMedication,
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
            },
            overview: {
              ...prevPet.health.overview,
            },
            medicalActs: {
              ...prevPet.health.medicalActs,
              medication: updatedMedication,
            },
          },
        }));
        
        setData({
          startDate: '',
          name: '',
          issue: '',
          instructions: '',
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
      <Typography variant="h4" sx={{fontWeight: 'bold'}}><LuPillBottle /> Καταγραφή Θεραπείας</Typography>
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
          label="Όνομα Φαρμάκου"
          sx={{ 
            '& .MuiInputBase-root': {
              backgroundColor: '#fff',
            },
          }}
          value={data.name}
          name="name"
          onChange={handleChange}
          helperText={errors.name || " "}
          error={Boolean(errors.name)}
          FormHelperTextProps={{ sx: { minHeight: '1.5em' } }}
        />
        <TextField
          label="Πρόβλημα Υγείας"
          sx={{ 
            '& .MuiInputBase-root': {
              backgroundColor: '#fff',
            },
            width: '20vw' 
          }}
          value={data.issue}
          name="issue"
          onChange={handleChange}
          helperText={" "}
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
          value={data.startDate}
          name="startDate"
          InputLabelProps={{ shrink: true }}
          inputProps={{max: getTodayDate()}}
          onChange={handleChange}
          helperText={errors.startDate || " "}
          error={Boolean(errors.startDate)}
          FormHelperTextProps={{ sx: { minHeight: '1.5em' } }}
        />
        <TextField
          label="Οδηγίες Θεραπείας"
          sx={{ 
            '& .MuiInputBase-root': {
              backgroundColor: '#fff',
            },
            width: '20vw'
          }}
          value={data.instructions}
          name="instructions"
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

export default RecordTreatment;