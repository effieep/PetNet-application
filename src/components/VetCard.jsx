import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, Typography, Grid, Paper, Button, Chip, Avatar, Divider, IconButton 
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import StarIcon from '@mui/icons-material/Star';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import 'dayjs/locale/el';
import { useAuth } from '../auth/AuthContext.jsx';

dayjs.extend(customParseFormat);
dayjs.locale('el');

const VetCard = ({ vet, openSnackbar }) => {
  const { isLoggedIn, user } = useAuth();

  const navigate = useNavigate();
  
  // State για την πλοήγηση στις μέρες
  const [startIndex, setStartIndex] = useState(0);
  const [slotSelected, setSlotSelected] = useState(null);

  const DAYS_TO_SHOW = 4; // Πόσες μέρες να δείχνει ταυτόχρονα

  const ratingValue = vet.reviews && vet.reviews.length > 0
    ? vet.reviews.reduce((acc, rev) => acc + rev.rating, 0) / vet.reviews.length
    : 0; 
  
  const ratingCount = vet.reviews ? vet.reviews.length : 0;

  // Επεξεργασία δεδομένων
  const processAvailability = () => {
    if (!vet.availability || vet.availability.length === 0) return [];
    
    // 1. Sort
    const sortedSlots = [...vet.availability].sort((a, b) => {
       const dateA = dayjs(a.date, 'DD/MM/YYYY');
       const dateB = dayjs(b.date, 'DD/MM/YYYY');
       return dateA.diff(dateB) || a.time.localeCompare(b.time);
    });

    // 2. Group by Date
    const grouped = {};
    sortedSlots.forEach(slot => {
        if (!grouped[slot.date]) grouped[slot.date] = [];
        // Εδώ ΔΕΝ κόβουμε τα slots (τα αφήνουμε όλα για να κάνουμε scroll)
        grouped[slot.date].push({
            id: slot.id,
            time: slot.time
        });
    });

    // 3. Map σε array αντικειμένων
    return Object.keys(grouped).map(dateStr => {
        const d = dayjs(dateStr, 'DD/MM/YYYY');
        return { 
            dateStr, 
            dayNumber: d.format('DD'), 
            month: d.format('MMMM'), 
            dayName: d.format('ddd'), 
            slots: grouped[dateStr]
        };
    });
  };

  const allAvailability = processAvailability();
  
  // Υπολογισμός των ημερών που φαίνονται ΤΩΡΑ
  const visibleDays = allAvailability.slice(startIndex, startIndex + DAYS_TO_SHOW);
  
  // Ο μήνας που θα δείχνουμε πάνω (παίρνουμε τον μήνα της πρώτης ορατής μέρας)
  const displayMonth = visibleDays.length > 0 ? visibleDays[0].month : 'ΔΙΑΘΕΣΙΜΟΤΗΤΑ';
  
  const onBookAppointment = async () => {
    if(!isLoggedIn || user.role !== 'owner') {
      openSnackbar('Πρέπει να είστε συνδεδεμένος/η ως ιδιοκτήτης κατοικιδίου για να κλείσετε ραντεβού.', 'error');
      return;
    }
    if(slotSelected) { 
      navigate('/owner/search-vet/book-appointment', {
        state: {
          vetId: vet.id,
          slotId: slotSelected,
        }
      });
    }
  }

  // Handlers για τα βελάκια
  const handleNext = () => {
    if (startIndex + DAYS_TO_SHOW < allAvailability.length) {
      setStartIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (startIndex > 0) {
      setStartIndex(prev => prev - 1);
    }
  };

  const handleVetClick = (vet) => {
  
    localStorage.setItem("activeVetId", vet.id);

    navigate('/owner/search-vet/vet-details', { 
      state: { vet: vet  } 
    });
  };


  return (
    <Box sx={{ width: '100%', overflowX: 'auto', py: 2 }}> 
      <Paper 
        elevation={3} 
        sx={{ 
          p: 3, 
          borderRadius: 4, 
          minWidth: '950px', // Λίγο πιο φαρδύ για να χωράνε άνετα
          width: 'fit-content',
          mx: 'auto',
          mb: 4
        }}
      >
        <Grid container spacing={2} wrap="nowrap">
          
          {/* --- ΑΡΙΣΤΕΡΗ ΠΛΕΥΡΑ (ΠΛΗΡΟΦΟΡΙΕΣ) --- */}
          <Grid item xs={6.5}>
            <Box sx={{ display: 'flex', gap: 3, flexDirection: 'row' }}>
              <Avatar 
                src={vet.profilePic || "/placeholder-vet.jpg"} 
                variant="square"
                sx={{ 
                  width: 120, height: 120, 
                  borderRadius: 2, bgcolor: '#e0e0e0', flexShrink: 0 
                }} 
              />
              <Box>
                  <Typography 
                      variant="h5" 
                      fontWeight="bold" 
                      color="#1a1a1a"
                      onClick={() => handleVetClick(vet)}
                      sx={{ 
                          cursor: 'pointer', 
                          '&:hover': { textDecoration: 'underline', color: '#6200EA' } 
                      }}
                  >
                    Dr. {vet.name} {vet.surname}
                  </Typography>
                <Typography variant="body2" fontWeight="bold" color="text.secondary" sx={{ mt: 1 }}>
                  Ειδικευμένος σε:
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 0.5 }}>
                  {vet.specialization.map((spec, index) => (
                    <Chip 
                      key={index} 
                      label={spec} 
                      size="small" 
                      sx={{ bgcolor: '#CFD8DC', fontWeight: 'bold', color: '#37474F' }} 
                    />
                  ))}
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                  <StarIcon sx={{ color: '#000', fontSize: 20 }} />
                  <Typography fontWeight="bold" sx={{ ml: 0.5 }}>
                    {ratingValue > 0 ? ratingValue.toFixed(1) : '-'} / 5
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                    ({ratingCount} αξιολογήσεις)
                  </Typography>
                </Box>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', mt: 3, color: '#333' }}>
              <LocationOnIcon fontSize="small" sx={{ mr: 1 }} />
              <Typography variant="body1" fontWeight="500">
                 Τοποθεσία ιατρείου: {vet.clinicAddress}, {vet.clinicCity}
              </Typography>
            </Box>

            <Box sx={{ maxWidth: '600px', mt: 3 }}>
              <Typography variant="body2" fontWeight="bold" sx={{ mb: 0.5 }}>
                Λίγα λόγια για τον ειδικό
              </Typography>
              <Box 
                sx={{ 
                  border: '1px solid #000', 
                  borderRadius: 2, 
                  p: 2, 
                  bgcolor: 'rgba(0,0,0,0.02)' 
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  {vet.description || vet.bio || '-'}
                </Typography>
              </Box>
            </Box>
          </Grid>

          {/* --- ΔΙΑΧΩΡΙΣΤΙΚΗ ΓΡΑΜΜΗ --- */}
          <Grid item xs={0.5} sx={{ display: 'flex', justifyContent: 'center' }}>
              <Divider orientation="vertical" sx={{ borderRightWidth: 2, borderColor: '#000', height: '100%' }} />
          </Grid>

          {/* --- ΔΕΞΙΑ ΠΛΕΥΡΑ (ΔΙΑΘΕΣΙΜΟΤΗΤΑ) --- */}
          <Grid item xs={5} sx={{ position: 'relative' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <CalendarMonthIcon sx={{ fontSize: 30 }} />
              <Box>
                  <Typography variant="subtitle1" fontWeight="bold" lineHeight={1.2}>
                  Επόμενη Διαθεσιμότητα
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                  Επίλεξε ημέρα και ώρα
                  </Typography>
              </Box>
            </Box>

            {/* Header Μήνα */}
            <Box 
              sx={{ 
                  border: '1px solid #000', 
                  textAlign: 'center', 
                  py: 0.5, 
                  mb: 2, 
                  bgcolor: '#FFF', 
                  fontWeight: 'bold',
              }}
            >
              {displayMonth}
            </Box>

            {/* CONTAINER ΜΕ ΒΕΛΑΚΙΑ ΚΑΙ ΣΤΗΛΕΣ */}
            <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
              
              {/* ΑΡΙΣΤΕΡΟ ΒΕΛΑΚΙ */}
              <IconButton 
                onClick={handlePrev} 
                disabled={startIndex === 0}
                sx={{ mt: 1 }} // Το κατεβάζουμε λίγο για να ευθυγραμμιστεί με τις ημερομηνίες
              >
                <ArrowBackIosNewIcon fontSize="small" />
              </IconButton>

              {/* ΟΙ ΣΤΗΛΕΣ ΤΩΝ ΗΜΕΡΩΝ */}
              {visibleDays.length > 0 ? (
                 <Box sx={{ display: 'flex', gap: 1, flexGrow: 1, justifyContent: 'center' }}>
                  {visibleDays.map((day, index) => (
                    // ΑΛΛΑΓΗ 1: Αύξηση του width από 60px σε 75px για να χωράει άνετα
                    <Box key={index} sx={{ display: 'flex', flexDirection: 'column', gap: 1, width: '75px' }}>
                        
                        {/* Κουτί Ημερομηνίας */}
                        <Box sx={{ 
                            border: '1px solid #000', 
                            textAlign: 'center', 
                            py: 0.5, 
                            bgcolor: '#fff',
                            height: '50px',
                            display: 'flex', flexDirection: 'column', justifyContent: 'center'
                        }}>
                            <Typography fontWeight="bold" variant="body1" lineHeight={1}>
                                {day.dayNumber}
                            </Typography>
                            <Typography variant="caption" lineHeight={1} sx={{ fontSize: '0.7rem' }}>
                                {day.dayName}
                            </Typography>
                        </Box>
                        
                        {/* SCROLLABLE SLOTS CONTAINER */}
                        <Box sx={{ 
                            maxHeight: '180px', 
                            overflowY: 'auto',  
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 0.5,
                            pr: 0.5, 
                            '&::-webkit-scrollbar': { width: '4px' },
                            '&::-webkit-scrollbar-thumb': { backgroundColor: '#ccc', borderRadius: '4px' }
                        }}>
                            {day.slots.map(slot => (
                                <Chip 
                                    key={slot.id} 
                                    label={slot.time} 
                                    variant="filled"
                                    onClick={() =>
                                      setSlotSelected(prev => (prev === slot.id ? null : slot.id))
                                    }
                                    sx={{ 
                                        // ΑΛΛΑΓΗ 2: width: '100%' για να απλώσει και fontSize
                                        width: '100%', 
                                        fontSize: '0.875rem', // Λίγο μεγαλύτερη γραμματοσειρά
                                        borderRadius: '4px', 
                                        border: '1px solid #ccc', 
                                        fontWeight: 'bold', 
                                        bgcolor: slotSelected === slot.id ? '#1976d2' : '#fff',
                                        height: '30px', // Λίγο πιο ψηλό για να αναπνέει
                                        '&:hover': { bgcolor: slotSelected === slot.id ? '#3792ee' : '#ffffff', cursor: 'pointer', borderColor: '#1976d2' },
                                        '& .MuiChip-label': { paddingLeft: 1, paddingRight: 1 } // Μικρότερο padding για να χωράει το κείμενο
                                    }} 
                                />
                            ))}
                        </Box>
                    </Box>
                ))}
                    
                    {/* Fillers για να μην χορεύουν τα στοιχεία αν έχουμε λιγότερες μέρες στο τέλος */}
                    {Array.from({ length: DAYS_TO_SHOW - visibleDays.length }).map((_, i) => (
                         <Box key={`empty-${i}`} sx={{ width: '60px' }} />
                    ))}
                 </Box>
              ) : (
                <Typography variant="body2" color="error" textAlign="center" sx={{ py: 4, flexGrow: 1 }}>
                    Δεν υπάρχουν διαθέσιμα ραντεβού.
                </Typography>
              )}

              {/* ΔΕΞΙ ΒΕΛΑΚΙ */}
              <IconButton 
                onClick={handleNext} 
                disabled={startIndex + DAYS_TO_SHOW >= allAvailability.length}
                sx={{ mt: 1 }}
              >
                <ArrowForwardIosIcon fontSize="small" />
              </IconButton>
            </Box>

            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
              <Button 
                  disabled={slotSelected === null}
                  variant="contained" 
                  onClick={() => onBookAppointment(visibleDays)}
                  sx={{ 
                      position: 'absolute',
                      bottom: 20,
                      bgcolor: '#6200EA', 
                      color: 'white', 
                      fontWeight: 'bold', 
                      px: 4, 
                      py: 1,
                      borderRadius: '20px',
                      textTransform: 'none',
                      fontSize: '1rem',
                      boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
                      '&:hover': { bgcolor: '#5000aa' }
                  }}
              >
                  Κλείσε ραντεβού
              </Button>
            </Box>

          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default VetCard;