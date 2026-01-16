import React, { useEffect, useState } from 'react';
import { Typography, Box, Paper, Button, Collapse, Chip } from '@mui/material'; // Πρόσθεσα το Chip για πιο ωραία εμφάνιση
import { useAuth } from "../../../auth/AuthContext";
import SubMenu from '../../../components/SubMenu.jsx';
import { API_URL } from '../../../api.js';
import { Check, X, Calendar, Clock, User } from 'lucide-react';
import { LuCalendarCheck2  } from 'react-icons/lu';
import { TransitionGroup } from 'react-transition-group';

const submenuItems = [
  { label: "Διαχείριση Διαθεσιμότητας", path: "/vet/manage-appointments/manage-availability" },
  { label: "Διαχείριση Αιτημάτων Ραντεβού", path: "/vet/manage-appointments/manage-requests" },
  { label: "Προγραμμάτισμένα Ραντεβού", path: "/vet/manage-appointments/scheduled-appointments" },
  { label: "Ιστορικό Ραντεβού", path: "/vet/manage-appointments/appointment-history" },
];

const VetScheduledRdvz = () => {
  const { user, isLoggedIn } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [owners, setOwners] = useState([]);

  const handleAccept = async (appointmentId) => {
    try {
      const response = await fetch(`${API_URL}/appointments/${appointmentId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'COMPLETED' }),
      });
      if(!response.ok) throw new Error('Failed to accept appointment');
      
      setAppointments(prev => prev.filter(app => app.id !== appointmentId));
    }
    catch (error) {
      console.error("Error accepting appointment:", error);
    }
  };

  const handleDecline = async (appointmentId) => {
    try {
      const response = await fetch(`${API_URL}/appointments/${appointmentId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'UNCOMPLETED' }),
      });
      if(!response.ok) throw new Error('Failed to decline appointment');
      
      // Το αφαιρούμε από την λίστα "ενεργειών" μόλις το ακυρώσει ο γιατρός
      setAppointments(prev => prev.filter(app => app.id !== appointmentId));
    }
    catch (error) {
      console.error("Error declining appointment:", error);
    }
  };

  useEffect(() => {
    const fetchAllConfirmed = async () => {
      try {
        const response = await fetch(`${API_URL}/appointments`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
        if (!response.ok) throw new Error('Failed to fetch appointments');
        
        const data = await response.json();
        
        // ΑΛΛΑΓΗ 1: Φιλτράρουμε ώστε να παίρνουμε τα CONFIRMED ΑΛΛΑ ΚΑΙ τα CANCELLED
        const confirmedApps = data.filter(appointment => 
          appointment.vetId === user.id && 
          (appointment.status === 'CONFIRMED' || appointment.status === 'CANCELLED')
        );
        setAppointments(sortAppointments(confirmedApps));
      } catch (error) {
        console.error("Error fetching appointments:", error);
      }
    };

    if (isLoggedIn && user) {
      fetchAllConfirmed();
    }
  }, [user, isLoggedIn]);

  useEffect(() => {
     const fetchAllOwners = async () => {
      try {
        const response = await fetch(`${API_URL}/users`);
        if (!response.ok) throw new Error('Failed');
        const usersData = await response.json();
        setOwners(usersData.filter(u => u.role === 'owner'));
      } catch (error) { console.error(error); }
    };
    if (isLoggedIn) fetchAllOwners();
  }, [isLoggedIn]);


  const sortAppointments = (appointments) => {
    return [...appointments].sort((a, b) => {
      const [daysA, monthsA, yearsA] = a.date.split('-').map(Number);
      const [daysB, monthsB, yearsB] = b.date.split('-').map(Number);
      const [hoursA, minutesA] = a.time.split(':').map(Number);
      const [hoursB, minutesB] = b.time.split(':').map(Number);
      return new Date(yearsB, monthsB - 1, daysB, hoursB, minutesB) - new Date(yearsA, monthsA - 1, daysA, hoursA, minutesA);
    });
  }

  const headerStyle = { fontWeight: 'bold', color: '#555', textTransform: 'uppercase', fontSize: '0.85rem', letterSpacing: '0.05em' };
  const rowStyle = { display: 'flex', alignItems: 'center', p: 2, borderBottom: '1px solid #f0f0f0', '&:hover': { backgroundColor: '#fafafa' } };

  if (!isLoggedIn || user?.role !== 'vet') return (
    <Typography variant="h6" color="error" textAlign="center" sx={{ mt: 10 }}>
      Παρακαλώ συνδεθείτε ως Κτηνίατρος για να δείτε τα προγραμματισμένα ραντεβού.
    </Typography>
  );

  return (
    <Box sx={{ display: 'flex'}}>
      <Box sx={{ width: '250px', flexShrink: 0, borderRight: '1px solid #ddd' }}>
        <SubMenu submenuItems={submenuItems} />
      </Box>

      <Box sx={{ flexGrow: 1 , mx: 4, flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
        <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold', color: '#1a1a1a', textAlign: 'center' }}>
          <LuCalendarCheck2  style={{ marginRight: '8px', verticalAlign: 'bottom', fontSize: '3rem' }} />
          Προγραμματισμένα Ραντεβού
        </Typography>

        {appointments.length === 0 ? (
          <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 2 }}>
            <Typography variant="h6" color="text.secondary">Δεν υπάρχουν προγραμματισμένα ραντεβού.</Typography>
          </Paper>
        ) : (
          <Paper elevation={0} sx={{ borderRadius: 3, border: '1px solid #e0e0e0', overflow: 'hidden' }}>
            <Box sx={{ display: 'flex', bgcolor: '#F9FAFB', p: 2, borderBottom: '1px solid #e0e0e0' }}>
              <Box sx={{ flex: 1, ...headerStyle }}>Ημερομηνια</Box>
              <Box sx={{ flex: 1, ...headerStyle }}>Ώρα</Box>
              <Box sx={{ flex: 2, ...headerStyle }}>Στοιχεια Πελατη</Box>
              <Box sx={{ flex: 1, ...headerStyle, textAlign: 'right' }}> Ολοκληρωση / Μη ολοκληρωση</Box>
            </Box>

            <TransitionGroup>
              {appointments.map((app) => {
                const owner = owners.find(owner => owner.id === app.ownerId);
                return (
                  <Collapse key={app.id}>
                    <Box sx={{
                       ...rowStyle,
                       backgroundColor: app.status === 'CANCELLED' ? '#fff0f0' : 'inherit' // Προαιρετικά: ελαφρύ κόκκινο φόντο αν ακυρώθηκε
                    }}>
                      <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Calendar size={18} color="#666" />
                        <Typography fontWeight={500}>{app.date}</Typography>
                      </Box>

                      <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Clock size={18} color="#666" />
                        <Typography>{app.time}</Typography>
                      </Box>

                      <Box sx={{ flex: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <User size={18} color="#666" />
                        <Typography>
                          {owner ? `${owner.name} ${owner.surname} - ${owner.phone}` : 'Άγνωστος Πελάτης'}
                        </Typography>
                      </Box>

                      <Box sx={{ flex: 1, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                        {/* ΑΛΛΑΓΗ 2: Έλεγχος Status για εμφάνιση κουμπιών ή κειμένου */}
                        {app.status === 'CANCELLED' ? (
                          <Chip 
                            label="ΑΚΥΡΩΘΗΚΕ" 
                            color="error" 
                            variant="outlined" 
                            size="small" 
                            sx={{ fontWeight: 'bold' }}
                          />
                        ) : (
                          <>
                            <Button variant="contained" color="success" size="small" sx={{ minWidth: '40px', px: 1 }} onClick={() => handleAccept(app.id)}>
                              <Check size={18} />
                            </Button>
                            <Button variant="contained" color="error" size="small" sx={{ minWidth: '40px', px: 1 }} onClick={() => handleDecline(app.id)}>
                              <X size={18} />
                            </Button>
                          </>
                        )}
                      </Box>
                    </Box>
                  </Collapse>
                );
              })}
            </TransitionGroup>
          </Paper>
        )}
      </Box>
    </Box>
  );
};

export default VetScheduledRdvz;