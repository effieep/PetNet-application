import { useState, useEffect } from 'react'; 
import { useAuth } from "../../../auth/AuthContext.jsx";
import { 
  Box, Typography, Grid, TextField, Button, Paper, CircularProgress, 
  Switch, FormControlLabel, IconButton
} from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import SubMenu from '../../../components/SubMenu.jsx';
import { Snackbar, Alert } from '@mui/material';
import dayjs from 'dayjs';
import 'dayjs/locale/el';
import { API_URL } from '../../../api.js';

// Plugins
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import weekday from 'dayjs/plugin/weekday';
import localeData from 'dayjs/plugin/localeData';
import customParseFormat from 'dayjs/plugin/customParseFormat'; // <-- ΝΕΟ
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'; // <-- ΝΕΟ

// Icons
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import CloseIcon from '@mui/icons-material/Close';
import EventBusyIcon from '@mui/icons-material/EventBusy';
import UpdateIcon from '@mui/icons-material/Update'; 
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';

// ... extensions
dayjs.extend(isSameOrBefore);
dayjs.extend(weekday);
dayjs.extend(localeData);
dayjs.extend(customParseFormat); 
dayjs.extend(isSameOrAfter);
dayjs.locale('el');

const VetAvailability = () => {
  const { user, isLoggedIn } = useAuth();
  
  const submenuItems = [
    { label: "Διαχείριση Διαθεσιμότητας", path: "/vet/manage-appointments/manage-availability" },
    { label: "Διαχείριση Αιτημάτων Ραντεβού", path: "/vet/manage-appointments/manage-requests" },
    { label: "Προγραμμάτισμένα Ραντεβού", path: "/vet/manage-appointments/scheduled-appointments" },
    { label: "Ιστορικό Ραντεβού", path: "/vet/manage-appointments/appointment-history" },
  ];

  // --- STATE ---
  
  // Εύρος Ημερομηνιών 
  const [rangeStart, setRangeStart] = useState(dayjs());
  const [rangeEnd, setRangeEnd] = useState(dayjs().add(1, 'month')); 

  // Single Slot States (Για τη μεμονωμένη προσθήκη)
  const [singleDate, setSingleDate] = useState(dayjs());
  const [singleTime, setSingleTime] = useState(dayjs().set('hour', 9).set('minute', 0));

  // Κοινή Διάρκεια Slot
  const [slotDuration, setSlotDuration] = useState(30);

  // Πρότυπο Εβδομάδας
  const [weekConfig, setWeekConfig] = useState({
    1: { active: true, label: 'Δευτέρα', start: dayjs().set('hour', 9).set('minute', 0), end: dayjs().set('hour', 17).set('minute', 0) },
    2: { active: true, label: 'Τρίτη', start: dayjs().set('hour', 9).set('minute', 0), end: dayjs().set('hour', 17).set('minute', 0) },
    3: { active: true, label: 'Τετάρτη', start: dayjs().set('hour', 9).set('minute', 0), end: dayjs().set('hour', 17).set('minute', 0) },
    4: { active: true, label: 'Πέμπτη', start: dayjs().set('hour', 9).set('minute', 0), end: dayjs().set('hour', 17).set('minute', 0) },
    5: { active: true, label: 'Παρασκευή', start: dayjs().set('hour', 9).set('minute', 0), end: dayjs().set('hour', 17).set('minute', 0) },
    6: { active: false, label: 'Σάββατο', start: dayjs().set('hour', 10).set('minute', 0), end: dayjs().set('hour', 14).set('minute', 0) },
    0: { active: false, label: 'Κυριακή', start: dayjs().set('hour', 10).set('minute', 0), end: dayjs().set('hour', 14).set('minute', 0) },
  });

  const [availabilities, setAvailabilities] = useState([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });
  const [loading, setLoading] = useState(true);

  const openSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  }

  const closeSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

// --- FETCH DATA & AUTO CLEANUP ---
  useEffect(() => {
    if (user?.id) {
      fetch(`${API_URL}/users/${user.id}`)
        .then(res => res.json())
        .then(data => {
          const allSlots = data.availability || [];
          
          // Τρέχουσα ημερομηνία (χωρίς ώρα, για σύγκριση ημερών)
          const today = dayjs().startOf('day');

          // Φιλτράρισμα: Κρατάμε μόνο όσα είναι ΣΗΜΕΡΑ ή στο ΜΕΛΛΟΝ
          const validSlots = allSlots.filter(slot => {
            // Μετατροπή του string "DD/MM/YYYY" σε dayjs object
            const slotDate = dayjs(slot.date, 'DD/MM/YYYY');
            // Κρατάμε το slot αν η ημερομηνία είναι ίδια ή μεταγενέστερη του "σήμερα"
            return slotDate.isSameOrAfter(today, 'day');
          });

          // Ενημερώνουμε το State με τα καθαρά slots
          setAvailabilities(validSlots);
          setLoading(false);

          // Αν βρέθηκαν και αφαιρέθηκαν παλιά slots, ενημερώνουμε τη βάση αυτόματα
          if (validSlots.length < allSlots.length) {
            console.log("Cleaning up old slots...");
            fetch(`${API_URL}/users/${user.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ availability: validSlots })
              })
              .then(() => console.log("Old slots removed from database."))
              .catch(err => console.error("Auto-cleanup failed:", err));
          }
        })
        .catch(err => {
          console.error("Error fetching availability:", err);
          setLoading(false);
        });
    } else {
        if (!isLoggedIn) setLoading(false);
    }
  }, [user, isLoggedIn]);

  // --- SAVE DATA ---
  const updateDatabase = (newList) => {
    if (!user?.id) return Promise.reject("No user"); // Ασφάλεια
    
    // 👇 ΠΡΟΣΘΕΣΕ ΤΟ return ΕΔΩ
    return fetch(`${API_URL}/users/${user.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ availability: newList })
    })
    .catch(err => console.error("Failed to update DB:", err));
  };
  // --- HANDLERS ---
  const toggleDay = (dayIndex) => {
    setWeekConfig(prev => ({
      ...prev,
      [dayIndex]: { ...prev[dayIndex], active: !prev[dayIndex].active }
    }));
  };

  const updateDayTime = (dayIndex, field, newValue) => {
    setWeekConfig(prev => ({
      ...prev,
      [dayIndex]: { ...prev[dayIndex], [field]: newValue }
    }));
  };

  // Handler: Μαζική Δημιουργία
  const handleGenerateSchedule = () => {
    if (rangeEnd.isBefore(rangeStart)) {
        openSnackbar("Η ημερομηνία λήξης πρέπει να είναι μετά την ημερομηνία έναρξης.", "error");
        return;
    }
   
    const generatedSlots = []; // Προσωρινή λίστα για τα slots που γεννάμε
    let currentDate = rangeStart; 

    // 1. ΓΕΝΝΗΣΗ SLOTS (ΟΠΩΣ ΠΡΙΝ)
    while (currentDate.isSameOrBefore(rangeEnd, 'day')) {
        const dayIndex = currentDate.day(); 
        const config = weekConfig[dayIndex]; 

        if (config.active) {
            let slotTime = currentDate
                .hour(config.start.hour())
                .minute(config.start.minute())
                .second(0);
            
            const endTime = currentDate
                .hour(config.end.hour())
                .minute(config.end.minute())
                .second(0);

            while (slotTime.add(slotDuration, 'minute').isSameOrBefore(endTime)) {
                generatedSlots.push({
                    id: Date.now() + Math.random(), // Random ID
                    date: currentDate.format('DD/MM/YYYY'),
                    time: slotTime.format('HH:mm'),
                    duration: Number(slotDuration)
                });
                slotTime = slotTime.add(slotDuration, 'minute');
            }
        }
        currentDate = currentDate.add(1, 'day');
    }

    // 2. ΕΛΕΓΧΟΣ ΔΙΠΛΟΤΥΠΩΝ (ΤΟ ΝΕΟ ΚΟΜΜΑΤΙ)
    // Κρατάμε μόνο όσα slots ΔΕΝ υπάρχουν ήδη στο availabilities
    const uniqueNewSlots = generatedSlots.filter(newSlot => {
        const exists = availabilities.some(existing => 
            existing.date === newSlot.date && existing.time === newSlot.time
        );
        return !exists; // Επιστρέφει true (το κρατάει) μόνο αν δεν υπάρχει
    });

    // 3. ΕΝΗΜΕΡΩΣΗ ΧΡΗΣΤΗ & ΒΑΣΗΣ
    if (uniqueNewSlots.length === 0) {
        // Αν γεννήθηκαν slots αλλά υπήρχαν όλα, ενημερώνουμε τον χρήστη
        if (generatedSlots.length > 0) {
            openSnackbar("Δεν προστέθηκαν νέα ραντεβού καθώς υπάρχουν ήδη για τις επιλεγμένες μέρες και ώρες.", "error");
        } else {
            openSnackbar("Δεν δημιουργήθηκαν ραντεβού. Ελέγξτε αν έχετε ενεργοποιήσει κάποιες μέρες στο πρόγραμμα.", "error");
        }
        return;
    }

    const updatedList = [...availabilities, ...uniqueNewSlots];
    
    // Sort (Προαιρετικό: ταξινομεί τη λίστα για να μπουν στη σωστή σειρά τα νέα με τα παλιά)
    updatedList.sort((a, b) => {
        const dateA = a.date.split('/').reverse().join('-');
        const dateB = b.date.split('/').reverse().join('-');
        if (dateA !== dateB) return dateA.localeCompare(dateB);
        return a.time.localeCompare(b.time);
    });

    setAvailabilities(updatedList);
    updateDatabase(updatedList);

    // Ενημερωτικό μήνυμα
    const duplicatesCount = generatedSlots.length - uniqueNewSlots.length;
    let message = `Επιτυχία! Προστέθηκαν ${uniqueNewSlots.length} νέα slots.`;
    if (duplicatesCount > 0) {
        message += `\n(Αγνοήθηκαν ${duplicatesCount} που υπήρχαν ήδη).`;
    }
    openSnackbar(message, "success");
  };
  // Handler: Μεμονωμένη Προσθήκη
  const handleAddSingleSlot = () => {
    const formattedDate = singleDate.format('DD/MM/YYYY');
    const formattedTime = singleTime.format('HH:mm');

    // Έλεγχος αν υπάρχει ήδη
    const exists = availabilities.some(slot => slot.date === formattedDate && slot.time === formattedTime);
    if (exists) {
        openSnackbar("Υπάρχει ήδη ραντεβού για αυτή την ημερομηνία και ώρα.", "error");
        return;
    }

    const newSlot = {
      id: Date.now(),
      date: formattedDate,
      time: formattedTime,
      duration: Number(slotDuration)
    };

    const updatedList = [...availabilities, newSlot];
    setAvailabilities(updatedList);
    updateDatabase(updatedList);
  };

  const handleDeleteAll = async () => { // 👈 Βάλε async εδώ
    if(window.confirm("Είστε σίγουροι; Αυτό θα διαγράψει ΟΛΕΣ τις μελλοντικές διαθεσιμότητες.")) {
        
        setLoading(true); // 1. Βάζουμε loading για να μην πατήσει τίποτα άλλο ο χρήστης
        
        try {
            // 2. Περιμένουμε να τελειώσει η βάση
            await updateDatabase([]); 
            
            // 3. Αφού πέτυχε, καθαρίζουμε και την οθόνη
            setAvailabilities([]); 
        } catch (error) {
            alert("Υπήρξε πρόβλημα κατά τη διαγραφή. Παρακαλώ δοκιμάστε ξανά.");
            // Προαιρετικά: ξαναφορτώνουμε τα δεδομένα για να είμαστε σίγουροι τι βλέπει ο χρήστης
        } finally {
            setLoading(false); // 4. Βγάζουμε το loading
        }
    }
  }

  const handleDelete = (id) => {
    const updatedList = availabilities.filter(slot => slot.id !== id);
    setAvailabilities(updatedList);
    updateDatabase(updatedList);
  };

  // --- RENDER ---
  return ( isLoggedIn && user?.role === 'vet' ? (
    <Box sx={{ display: 'flex', minHeight: '100vh'}}> 
      
      {/* LEFT SUBMENU */}
      <Box sx={{ width: '250px', flexShrink: 0 }}>
         <SubMenu submenuItems={submenuItems} />
      </Box>

      {/* RIGHT MAIN CONTENT */}
      <Box sx={{ flexGrow: 1, p: 4 }}>
        
        {/* Header */}
        <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 1 }}>
          <CalendarMonthIcon sx={{ fontSize: 40, color: '#000000ff' }} />
          <Typography variant="h4" fontWeight="bold" color="#000000ff">
            Διαχείριση Διαθεσιμότητας
          </Typography>
        </Box>

        <Grid container spacing={4} wrap='nowrap'>
            
          {/* --- ΣΤΗΛΗ 1: ΕΡΓΑΛΕΙΑ ΔΗΜΙΟΥΡΓΙΑΣ --- */}
          <Grid item 
            sx={{
              flex: '0 0 45vw',
              minWidth: '45vw' 
            }}>
            
            {/* A. ΕΒΔΟΜΑΔΙΑΙΟΣ WIZARD */}
            <Paper elevation={3} sx={{ p: 3, borderRadius: 3, mb: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <UpdateIcon color="primary" />
                  <Typography variant="h6" fontWeight="bold">
                    Αυτόματη Γεννήτρια Προγράμματος
                  </Typography>
              </Box>
              
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                 Ορίστε το τυπικό σας ωράριο ανά ημέρα και εφαρμόστε το για μια χρονική περίοδο.
              </Typography>

              <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="el">
                
                {/* 1. ΕΠΙΛΟΓΗ ΠΕΡΙΟΔΟΥ */}
                <Box sx={{ mb: 4, p: 2, bgcolor: '#f9f9f9', borderRadius: 2, border: '1px solid #eee' }}>
                    <Typography fontWeight="bold" sx={{ mb: 2, fontSize: '0.9rem' }}>Βήμα 1: Χρονική Περίοδος & Διάρκεια</Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <DatePicker 
                                label="Από" 
                                value={rangeStart} 
                                onChange={(v) => setRangeStart(v)} 
                                slotProps={{ textField: { fullWidth: true, size: 'small', sx: { bgcolor: 'white' } } }}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <DatePicker 
                                label="Έως" 
                                value={rangeEnd} 
                                onChange={(v) => setRangeEnd(v)} 
                                slotProps={{ textField: { fullWidth: true, size: 'small', sx: { bgcolor: 'white' } } }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                           <TextField
                                label="Διάρκεια ραντεβού (λεπτά)"
                                type="number"
                                value={slotDuration}
                                onChange={(e) => setSlotDuration(Number(e.target.value))}
                                fullWidth
                                size="small"
                                helperText="Ισχύει και για τη μεμονωμένη προσθήκη"
                            />
                        </Grid>
                    </Grid>
                </Box>

                {/* 2. ΕΒΔΟΜΑΔΙΑΙΟ ΠΡΟΤΥΠΟ */}
                <Typography fontWeight="bold" sx={{ mb: 2, fontSize: '0.9rem' }}>Βήμα 2: Ωράριο ανά Ημέρα</Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    {[1, 2, 3, 4, 5, 6, 0].map((dayIndex) => (
                        <Box 
                            key={dayIndex} 
                            sx={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: 1, 
                                p: 1, 
                                borderRadius: 2,
                                border: '1px solid #e0e0e0',
                                bgcolor: weekConfig[dayIndex].active ? '#e8f5e9' : 'transparent',
                                opacity: weekConfig[dayIndex].active ? 1 : 0.6
                            }}
                        >
                            <FormControlLabel
                                control={
                                    <Switch 
                                        checked={weekConfig[dayIndex].active} 
                                        onChange={() => toggleDay(dayIndex)} 
                                        size="small" 
                                        color="success"
                                    />
                                }
                                label={
                                    <Typography variant="body2" fontWeight="bold" sx={{ width: 80 }}>
                                        {weekConfig[dayIndex].label}
                                    </Typography>
                                }
                                sx={{ m: 0 }}
                            />

                            {weekConfig[dayIndex].active && (
                                <>
                                    <TimePicker 
                                        value={weekConfig[dayIndex].start} 
                                        onChange={(v) => updateDayTime(dayIndex, 'start', v)}
                                        ampm={false}
                                        slotProps={{ textField: { size: 'small', sx: { width: 120, bgcolor: 'white' } } }}
                                    />
                                    <Typography>-</Typography>
                                    <TimePicker 
                                        value={weekConfig[dayIndex].end} 
                                        onChange={(v) => updateDayTime(dayIndex, 'end', v)}
                                        ampm={false}
                                        slotProps={{ textField: { size: 'small', sx: { width: 120, bgcolor: 'white' } } }}
                                    />
                                </>
                            )}
                            {!weekConfig[dayIndex].active && (
                                <Typography variant="caption" color="text.secondary" sx={{ ml: 2 }}>
                                    Ρεπό / Κλειστό
                                </Typography>
                            )}
                        </Box>
                    ))}
                </Box>

              </LocalizationProvider>

              {/* 3. ΚΟΥΜΠΙ ΕΚΤΕΛΕΣΗΣ */}
              <Box sx={{ mt: 4 }}>
                <Button 
                    variant="contained" 
                    fullWidth
                    size="large"
                    onClick={handleGenerateSchedule}
                    sx={{ 
                    bgcolor: '#2c3e50', 
                    color: 'white', fontWeight: 'bold', py: 1.5, borderRadius: 2,
                    boxShadow: '0 4px 10px rgba(0,0,0,0.2)', '&:hover': { bgcolor: '#1a252f' }
                    }}
                >
                  ΕΦΑΡΜΟΓΗ ΠΡΟΓΡΑΜΜΑΤΟΣ
                </Button>
              </Box>
            </Paper>

            {/* B. ΠΡΟΣΘΗΚΗ ΜΕΜΟΝΩΜΕΝΗΣ ΩΡΑΣ (ΕΔΩ ΤΟ ΠΡΟΣΘΕΣΑ) */}
            <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <AddCircleOutlineIcon color="secondary" />
                    <Typography variant="h6" fontWeight="bold">
                        Προσθήκη Μεμονωμένης Ώρας
                    </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Προσθέστε μια συγκεκριμένη ώρα εκτός του τακτικού προγράμματος.
                </Typography>

                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="el">
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} sm={5}>
                            <DatePicker 
                                label="Ημερομηνία"
                                value={singleDate}
                                onChange={(v) => setSingleDate(v)}
                                slotProps={{ textField: { fullWidth: true, size: 'small' } }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <TimePicker 
                                label="Ώρα"
                                value={singleTime}
                                onChange={(v) => setSingleTime(v)}
                                ampm={false}
                                slotProps={{ textField: { fullWidth: true, size: 'small' } }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={3}>
                            <Button 
                                variant="outlined" 
                                color="secondary"
                                fullWidth 
                                onClick={handleAddSingleSlot}
                                sx={{ height: '40px', fontWeight: 'bold' }}
                            >
                                Προσθηκη
                            </Button>
                        </Grid>
                    </Grid>
                </LocalizationProvider>
            </Paper>

          </Grid>


          {/* --- ΣΤΗΛΗ 2: ΠΡΟΒΟΛΗ ΛΙΣΤΑΣ --- */}
          <Grid
            item
            sx={{
              flex: '0 0 30vw',
              minWidth: '30vw',
              position: 'sticky',
              top: 24,
              alignSelf: 'flex-start',
            }}
          >
             <Paper elevation={3} sx={{ p: 2, borderRadius: 3, height: '100%', maxHeight: '1200px', display: 'flex', flexDirection: 'column'}}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, gap: 2 }}>
                    <Typography variant="h6" fontWeight="bold">
                        📅 Τρέχουσες Διαθεσιμότητες
                    </Typography>
                    {availabilities.length > 0 && (
                        <Button startIcon={<DeleteSweepIcon />} color="error" size="small" onClick={handleDeleteAll}>
                            Καθαρισμος
                        </Button>
                    )}
                </Box>

                <Box 
                sx={{ 
                    flexGrow: 1,
                    overflowY: 'auto', 
                    pr: 1,
                    '&::-webkit-scrollbar': { width: '6px' },
                    '&::-webkit-scrollbar-thumb': { background: '#bdbdbd', borderRadius: '4px' },
                }}
                >
                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress /></Box>
                ) : availabilities.length === 0 ? (
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', py: 10, opacity: 0.6 }}>
                        <EventBusyIcon sx={{ fontSize: 60, color: '#555', mb: 2 }} />
                        <Typography variant="subtitle1" color="text.secondary">Δεν έχετε ορίσει πρόγραμμα.</Typography>
                    </Box>
                ) : (
                    // Ομαδοποίηση ανά ημερομηνία για καλύτερη εμφάνιση
                    [...availabilities]
                    .sort((a, b) => {
                         const dateA = a.date.split('/').reverse().join('-');
                         const dateB = b.date.split('/').reverse().join('-');
                         if (dateA !== dateB) return dateA.localeCompare(dateB);
                         return a.time.localeCompare(b.time);
                    })
                    .map((slot, index, array) => {
                        const isNewDay = index === 0 || slot.date !== array[index - 1].date;
                        
                        return (
                            <Box key={slot.id}>
                                {isNewDay && (
                                    <Typography 
                                        variant="subtitle2" 
                                        sx={{ 
                                            bgcolor: '#e0f7fa', p: 1, pl: 2, borderRadius: 1, mt: 2, mb: 1, fontWeight: 'bold', color: '#006064' 
                                        }}
                                    >
                                        {slot.date}
                                    </Typography>
                                )}
                                
                                <Paper
                                    elevation={0}
                                    sx={{
                                        display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
                                        p: 1, mb: 1, ml: 2,
                                        borderRadius: 2, border: '1px solid #eee',
                                        '&:hover': { bgcolor: '#f9f9f9', borderColor: '#bdbdbd' }
                                    }}
                                >
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                        <Box sx={{ bgcolor: '#fff3e0', color: '#e65100', px: 1.5, py: 0.5, borderRadius: 1, fontWeight: 'bold' }}>
                                            {slot.time}
                                        </Box>
                                        <Typography variant="caption" color="text.secondary">
                                            {slot.duration} λεπτά
                                        </Typography>
                                    </Box>

                                    <IconButton size="small" color="error" onClick={() => handleDelete(slot.id)}>
                                        <CloseIcon fontSize="small" />
                                    </IconButton>
                                </Paper>
                            </Box>
                        );
                    })
                )}
                </Box>
             </Paper>
          </Grid>

        </Grid>
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
  ) : ( 
    <Typography variant="h6" color="error" textAlign="center" sx={{ mt: 10 }}>
      Παρακαλώ συνδεθείτε ως Κτηνίατρος για να δημιουργήσετε διαθεσιμότητα.
    </Typography>
  ));
};

export default VetAvailability;