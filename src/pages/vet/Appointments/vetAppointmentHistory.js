import { useEffect, useState } from 'react';
import { API_URL } from '../../../api';
import { useAuth } from '../../../auth/AuthContext';
import SubMenu from '../../../components/SubMenu.jsx';
import { Autocomplete, TextField, Box, Typography } from '@mui/material';
import PetDetailsCard from '../../../components/PetDetailsCard.js';
import AppointmentHistoryCard from '../../../components/AppointmentHistoryCard.jsx';

const submenuItems = [
  { label: "Διαχείριση Διαθεσιμότητας", path: "/vet/manage-appointments/manage-availability" },
  { label: "Διαχείριση Αιτημάτων Ραντεβού", path: "/vet/manage-appointments/manage-requests" },
  { label: "Προγραμμάτισμένα Ραντεβού", path: "/vet/manage-appointments/scheduled-appointments" },
  { label: "Ιστορικό Ραντεβού", path: "/vet/manage-appointments/appointment-history" },
];

const AppointmentsHistory = () => {
  const { isLoggedIn, user } = useAuth();
  const [pets, setPets] = useState([]);
  const [selectedPet, setSelectedPet] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [selectedAppointments, setSelectedAppointments] = useState([]);

  const handleChange = (event, value) => {
    setSelectedPet(value);
    if(value) {
      const petAppointments = appointments.filter(appointment => appointment.petId === value.id);
      setSelectedAppointments(petAppointments);
      return;
    }
  }

  
  useEffect(() => {
    const fetchPets = async () => {
      try {
        const response = await fetch(`${API_URL}/pets`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (response.ok) {
          const data = await response.json();
          setPets(data);
        } else {
          console.error('Σφάλμα κατά την ανάκτηση των κατοικιδίων');
        }
      } catch (error) {
        console.error('Σφάλμα δικτύου:', error);
      }
    }
    fetchPets();

    const fetchAppointments = async () => {
      try {
        const response = await fetch(`${API_URL}/appointments`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (response.ok) {
          const data = await response.json();
          const filtered = data.filter(appointment => (appointment.status === 'COMPLETED' || appointment.status === 'CANCELLED') && appointment.vetId === user.id);
          setAppointments(filtered);
        } else {
          console.error('Σφάλμα κατά την ανάκτηση των κατοικιδίων');
        }
      } catch (error) {
        console.error('Σφάλμα δικτύου:', error);
      }
    } 
    fetchAppointments();

  }, [user]);

  if(!isLoggedIn || user.role !== 'vet') {
    return <Typography variant="h6" color="error">Πρέπει να συνδεθείτε ως κτηνίατρος για να έχετε πρόσβαση στο Ιστορικό Ραντεβού.</Typography>
  }

  return (
  <>
    <Box sx={{ display: 'flex', flexDirection: 'row', gap: 4 }}>
      <Box sx={{ width: '250px', flexShrink: 0 }}>
          <SubMenu submenuItems={submenuItems} />
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexGrow: 1, justifyContent: 'flex-start' }}>
        <Autocomplete
          disablePortal
          id="combo-box-pets"
          options={pets.filter(pet => pet.dateOfDeath === null || pet.dateOfDeath === undefined || pet.dateOfDeath === '')}
          onChange={(handleChange)}
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
        {selectedPet && (
          <>
          <PetDetailsCard petId={selectedPet.id} />
          <Typography variant="h5" sx={{ my: 4, fontWeight: 'bold' }}>
            Ιστορικό Ραντεβού για {selectedPet.name}
          </Typography>
          <Box sx={{ width: '65vw', display: 'flex', flexDirection: 'column', alignItems: 'center', maxHeight: '50vh', overflowY: 'auto'}}>
            {selectedAppointments.length === 0 ? (
              <Typography variant="body1" sx={{ mt: 2 }}>
                Δεν υπάρχουν ραντεβού στο ιστορικό για αυτό το κατοικίδιο.
              </Typography>
            ) : (
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                {selectedAppointments.map((appointment) => (
                  <AppointmentHistoryCard key={appointment.id} appointment={appointment} />
                ))}
              </Box>
            )}
          </Box>
        </> 
      )}
      </Box>
    </Box>
  </>
  );
}

export default AppointmentsHistory;