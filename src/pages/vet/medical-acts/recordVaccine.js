  import { TbVaccine } from 'react-icons/tb';
  import { Typography, Box, TextField, Button, Snackbar, Alert, InputAdornment, MenuItem } from '@mui/material';
  import { useEffect } from 'react';
  import { API_URL } from '../../../api';
  import { useState } from 'react';
  import { useAuth } from '../../../auth/AuthContext';
  import QuickActions from '../../../components/QuickActions';

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


  const RecordVaccine = () => {
    const [isRepeating, setIsRepeating] = useState(false);

    const toggleRepeating = (e) => {
      e.stopPropagation(); 
      
      setIsRepeating(prev => !prev);
      setData(prev => ({ ...prev, dose: '' }));
    };

    const [snackbarOpen, setSnackbarOpen] = useState({
      open: false,
      message: '',
      severity: 'success',
    });
    const { isLoggedIn, user } = useAuth();
    const [pet, setPet] = useState(null);
    const [errors, setErrors] = useState({});
    const [data, setData] = useState(
      {
        name: '',
        date: '',
        dose: '',
        nextDate: '',
        vetId: '',
      }
    );
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

    const openSnackbar = (message, severity = 'success') => {
      setSnackbarOpen({ open: true, message, severity });
    };

    const closeSnackbar = () => {
      setSnackbarOpen({ open: false, message: '', severity: 'success' });
    };

    const handleChange = (e) => {
      const { name } = e.target;
      let newValue = e.target.value;
      let nextDate = data.nextDate;

      if (name === 'dose') {

        if (!isRepeating) {
          const numericValue = Number(newValue);
          if (!isNaN(numericValue) && numericValue < 1) {
            newValue = 1;
          }
        }
        if(data.date && data.date !== '') {
          const date = new Date(data.date);

          if (newValue === 'Ετησίως') {
            date.setFullYear(date.getFullYear() + 1);
            nextDate = date.toISOString().split('T')[0];
          }

          if (newValue === 'Μηνιαίως') {
            date.setMonth(date.getMonth() + 1);
            nextDate = date.toISOString().split('T')[0];
          }

          if (newValue === 'Εβδομαδιαίως') {
            date.setDate(date.getDate() + 7);
            nextDate = date.toISOString().split('T')[0];
          }
        }
      }

      if(name === 'date') {
        const date = new Date(newValue);

        if (data.dose && data.dose === 'Ετησίως') {
          date.setFullYear(date.getFullYear() + 1);
          nextDate = date.toISOString().split('T')[0];
        }

        if (data.dose && data.dose === 'Μηνιαίως') {
          date.setMonth(date.getMonth() + 1);
          nextDate = date.toISOString().split('T')[0];
        }

        if (data.dose && data.dose === 'Εβδομαδιαίως') {
          date.setDate(date.getDate() + 7);
          nextDate = date.toISOString().split('T')[0];
        }
      }

      if(name === 'nextDate'){
        setData(prev => ({
          ...prev,
          [name]: newValue,
        }));
        return;
      }
      
      setData(prev => ({
        ...prev,
        [name]: newValue,
        nextDate,
      }));
    };

    const validateData = () => {
      const newErrors = {};
      if (data.name === '') {
        newErrors.name = 'Το όνομα είναι υποχρεωτικό.';
      }
      if( !data.date ) {
        newErrors.date = 'Η ημερομηνία είναι υποχρεωτική.';
      }
      if( data.dose === '' ) {
        newErrors.dose = 'Η δόση είναι υποχρεωτική.';
      }
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
      if (!validateData()) return;

      setErrors({});
      try {
        const petId = localStorage.getItem("activePetId");

        const newVaccine = {
          name: data.name,
          date: reverseDateString(data.date),
          dose: data.dose,
          nextDate: reverseDateString(data.nextDate),
          vetId: data.vetId,
        };

        const updatedVaccinations = [
          ...(pet.health.history.vaccinations || []),
          newVaccine
        ];

        const payload = {
          health: {
            ...pet.health,
            overview: {
              ...pet.health.overview,
              lastVaccine: {
                name: newVaccine.name,
                date: newVaccine.date,
                nextDate: newVaccine.nextDate,
              },
            },
            history: {
              ...pet.health.history,
              vaccinations: updatedVaccinations,
            },
          },
        };

        const response = await fetch(`${API_URL}/pets/${petId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (!response.ok) throw new Error('Network response was not ok');

        setPet(prev => ({
          ...prev,
          health: {
            ...prev.health,
            history: {
              ...prev.health.history,
              vaccinations: updatedVaccinations
            },
            overview: {
              ...prev.health.overview,
              lastVaccine: {
                name: newVaccine.name,
                date: newVaccine.date,
                nextDate: newVaccine.nextDate,
              },
            },
          },
        }));

        // Reset form
        setData({
          name: '',
          date: '',
          dose: '',
          nextDate: '',
          vetId: user ? user.id : '',
        });

        openSnackbar('Ο εμβολιασμός καταχωρήθηκε με επιτυχία!', 'success');

      } catch (error) {
        console.error('Error submitting vaccine record:', error);
        openSnackbar('Σφάλμα κατά την καταχώρηση του εμβολιασμού. Παρακαλώ δοκιμάστε ξανά.', 'error');
      }
    };

    if(!isLoggedIn && user?.role !== 'vet') return (
      <Box sx=
        {{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Typography variant="h6"color='error'>Παρακαλώ συνδεθείτε ως κτηνίατρος για να έχετε πρόσβαση σε αυτή τη σελίδα.</Typography>
      </Box>
    )

    return (


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
        <Typography variant="h4" sx={{fontWeight: 'bold'}}><TbVaccine /> Καταγραφή Εμβολιασμού</Typography>
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
            label="Όνομα Εμβολίου"
            sx={{ 
              '& .MuiInputBase-root': {
                backgroundColor: '#fff',
              }
            }}
            value={data.name}
            onChange={handleChange}
            helperText={errors.name || " "}
            error={Boolean(errors.name)}
            FormHelperTextProps={{ sx: { minHeight: '1.5em' } }}
            name="name"
          />
          <TextField
            label="Ημερομηνία Εμβολιασμού"
            type="date"
            variant="outlined"
            sx={{ 
              '& .MuiInputBase-root': {
                backgroundColor: '#fff',
              }
             }}
            value={data.date}
            onChange={handleChange}
            name="date"
            helperText={errors.date || " "}
            error={Boolean(errors.date)}
            FormHelperTextProps={{ sx: { minHeight: '1.5em' } }}
            InputLabelProps={{ shrink: true }}
            inputProps={{ max: getTodayDate() }}
          />
          <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
            <TextField
              select={isRepeating} 
              
              label={isRepeating ? "Συχνότητα" : "Αριθμός Δόσης"}
              variant="outlined"
              sx={{ 
                '& .MuiInputBase-root': {
                  backgroundColor: '#fff',
                },
                width: '20vw' 
              }}
              value={data.dose}
              onChange={handleChange}
              name="dose"
              type={isRepeating ? "text" : "number"}
              helperText={errors.dose || " "}
              error={Boolean(errors.dose)} 
              FormHelperTextProps={{ sx: { minHeight: '1.5em' } }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Button 
                      size="small"
                      onClick={toggleRepeating}
                      onMouseDown={(e) => e.stopPropagation()}
                      variant="text" 
                      sx={{ 
                        textTransform: 'none', 
                        fontSize: '0.75rem',
                        fontWeight: 'bold',
                        whiteSpace: 'nowrap',
                        mr: 1,
                        borderRight: '1px solid #ccc',
                        borderRadius: 0,
                        height: '100%'
                      }}
                    >
                      {isRepeating ? 'Αλλαγή σε Δόση' : 'Αλλαγή σε Συχνότητα'}
                    </Button>
                  </InputAdornment>
                ),
              }}
            >
              {isRepeating && [
                <MenuItem key="weekly" value="Εβδομαδιαίως">Εβδομαδιαίως</MenuItem>,
                <MenuItem key="monthly" value="Μηνιαίως">Μηνιαίως</MenuItem>,
                <MenuItem key="yearly" value="Ετησίως">Ετησίως</MenuItem>
              ]}
            </TextField>
          </Box>
          <TextField
            disabled={data.dose === 'Ετησίως'|| data.dose === 'Μηνιαίως'|| data.dose === 'Εβδομαδιαίως'}
            label="Επόμενη Ημερομηνία Εμβολιασμού"
            type="date"
            variant="outlined"
            sx={{ 
              '& .MuiInputBase-root': {
                backgroundColor: '#fff',
              }
             }}
            value={data.nextDate}
            onChange={handleChange}
            name="nextDate"
            helperText={" "}
            InputLabelProps={{ shrink: true }}
            inputProps={{ min: getTomorrowDate() }}
            FormHelperTextProps={{ sx: { minHeight: '1.5em' } }}
          />
        </Box>
        <Box 
          sx={{ 
            p: 4, 
            borderRadius: 2,
            width: '70vw'
          }}
        >
          
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
            <Button
              variant="contained"
              onClick={handleSubmit}
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
        <Snackbar
          open={snackbarOpen.open}
          autoHideDuration={6000}
          onClose={closeSnackbar}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <Alert onClose={closeSnackbar} severity={snackbarOpen.severity} sx={{ width: '100%' }}>
            {snackbarOpen.message}
          </Alert>
        </Snackbar>
      </Box >
    );
  };

  export default RecordVaccine;