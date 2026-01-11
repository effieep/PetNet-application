import { Box, Button, TextField, Typography, Snackbar, Alert } from '@mui/material';
import QuickActions from '../../../components/QuickActions';
import { LiaNotesMedicalSolid } from 'react-icons/lia';
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

const RecordDiagnosticTest = () => {
  const { isLoggedIn, user } = useAuth()
    const [data, setData] = useState({
      date: '',
      title: '',
      vet: '',
      vetId: '',
      result: '',
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
        setData(prev => ({ ...prev, vet: user.name + ' ' + user.surname, vetId: user.id }) );
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
      if (!data.title) newErrors.title = 'Απαιτείται τίτλος εξέτασης.';
      if (!data.date) newErrors.date = 'Απαιτείται ημερομηνία.';
  
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };
  
    const handleSubmit = async () => {
      if(!validateData()) return;
      setErrors({});
  
      try{
        const petId = localStorage.getItem("activePetId");
        const newTest = {
          date: reverseDateString(data.date),
          title: data.title,
          vet: data.vet,
          vetId: user.id,
          result: data.result,
        };
        
        const updatedTests = [
          ...(pet.health.history.medicalActs?.tests || []), newTest
        ];
  
        const payload = {
          health: {
            ...pet.health,
            overview: {
              ...pet.health.overview,
            },
            history: {
              ...pet.health.history,
              medicalActs: {
                ...pet.health.history.medicalActs,
                tests: updatedTests,
              },
            },
          },
        };
  
  
        const response = await fetch(`${API_URL}/pets/${petId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!response.ok) throw new Error('Failed to record diagnostic test.');
        openSnackbar('Η διαγνωστική εξέταση καταχωρήθηκε επιτυχώς!', 'success');
  
        setPet((prevPet) => ({
          ...prevPet,
          health: {
            ...prevPet.health,
            history: {
              ...prevPet.health.history,
              medicalActs: {
                ...prevPet.health.history.medicalActs,
                tests: updatedTests,
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
          vet: data.vet,
          vetId: data.vetId,
          result: '',
        });
      } catch (error) {
        console.error('Error recording diagnostic test:', error);
        openSnackbar('Σφάλμα κατά την καταχώρηση της διαγνωστικής εξέτασης.', 'error');
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
      <Typography variant="h4" sx={{fontWeight: 'bold'}}><LiaNotesMedicalSolid /> Καταγραφή Διαγνωστικής Εξέτασης</Typography>
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
        <Box sx={{flexDirection: 'column', display: 'flex', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
          <Box sx={{gap: 2, flexDirection: 'row', display: 'flex', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
            <TextField
              label="Tίτλος Εξέτασης"
              sx={{ 
                '& .MuiInputBase-root': {
                  backgroundColor: '#fff',
                },
              }}
              value={data.title}
              name="title"
              onChange={handleChange}
              helperText={errors.title || " "}
              error={Boolean(errors.title)}
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
          </Box>

          <TextField
            label="Αποτελέσματα/Παρατηρήσεις"
            sx={{ 
              width: '23vw',
              '& .MuiInputBase-root': {
                backgroundColor: '#fff',
              }
            }}
            value={data.result}
            name="result"
            onChange={handleChange}
            helperText={" "}
            FormHelperTextProps={{ sx: { minHeight: '1.5em' } }}
            multiline
            rows={4}
            maxRows={8}
          />
        </Box>
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

export default RecordDiagnosticTest;