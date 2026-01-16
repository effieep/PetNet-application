import { Box, Typography, Autocomplete, TextField, Button, CircularProgress } from '@mui/material';
import { MdAlternateEmail } from 'react-icons/md';
import { FaPhoneAlt  } from 'react-icons/fa';
import { FaLocationDot } from 'react-icons/fa6';
import { useEffect, useState, Fragment } from 'react';
import { API_URL } from '../../../api';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../auth/AuthContext';


const reverseDate = (dateStr) => {
  const [year, month, day] = dateStr.split('-');
  return `${day}-${month}-${year}`;
}

const Adoption = () => {

  const { user } = useAuth();

  const navigate = useNavigate();

  function removeTones(str) {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  }
  
  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(false);
  const [owners, setOwners] = useState([]);
  const [formData, setFormData] = useState({
    newOwnerId: '',
    type: 'adoption',
    date: reverseDate(new Date().toISOString().split('T')[0],)
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
  }, []);

  const nameForeas = pet && pet.ownerId.startsWith('FILOZ-') ? pet.ownerId.split('FILOZ-')[1] : '';

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
                  type: 'adoption',
                  date: formData.date,
                  previousOwnerId: pet.ownerId,
                  newOwnerId: formData.newOwnerId,
                  vetId: user.id

                }
              ],
            }
          }
        }),
      });
      if(response.ok) {
        navigate('/vet/manage-pets/record-life-event', { state: { successMessage: 'Η υιοθεσία καταχωρήθηκε με επιτυχία!' } });
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
                    type: 'adoption',
                    date: formData.date,
                    previousOwnerId: pet.ownerId,
                    newOwnerId: formData.newOwnerId,
                    vetId: user.id
                  }
                ]
              }
            } 
          }
        )
      } else {
        navigate('/vet/manage-pets/record-life-event', { state: { errorMessage: 'Σφάλμα κατά την καταχώρηση της υιοθεσίας. Παρακαλώ δοκιμάστε ξανά.' } });
        setLoading(false);
      }
    } catch (error) {
      console.error('Error submitting adoption:', error);
    }
  };
  if(loading){

    return (
      <>
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <CircularProgress />
      </Box>
    </>
  );
}
  return (
    <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2, alignSelf: 'center' }}>
        Υιοθεσία Κατοικιδίου
      </Typography>
      <Typography variant="body1" sx={{ alignSelf: 'center' }}>
        Το κατοικίδιο μεταβιβάζεται από μία φιλοζωική/καταφύγιο σε έναν ιδιοκτήτη
      </Typography>
      <Box sx ={{ display: 'flex', flexDirection: 'column', ml: 4 }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold', mt: 4}}>
          1. Κατοικίδιο προς υιοθεσία:
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
        <Typography variant="h6" sx={{ fontWeight: 'bold', mt: 4}}>
          2. Φορέας Υιοθεσίας: {nameForeas}
        </Typography>
        <Typography variant="h6" sx={{ fontWeight: 'bold', mt: 4}}>
          3. Νέος Ιδιοκτήτης:
        </Typography>
        <Autocomplete
          sx={{ alignSelf: 'center',}}
          noOptionsText="Δεν βρέθηκαν αποτελέσματα"
          options={owners}
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

      <Button
        disabled={formData.newOwnerId === ''}
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
        Καταχώρηση Υιοθεσίας
      </Button>
      </Box>
    </Box>
  );
}

export default Adoption;