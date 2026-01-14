import React from 'react';
import { useState, useMemo } from 'react';
import { Box, Typography, IconButton, Button, Paper, TextField, Divider } from '@mui/material';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

const VetAvailabilityCalendar = ({ availability = [], onBookAppointment }) => {
    
    const DAYS_TO_SHOW = 7; // Δείχνουμε 6 μέρες στη σειρά
    const INITIAL_SLOTS_TO_SHOW = 5; // Πόσες ώρες φαίνονται αρχικά

    const [startIndex, setStartIndex] = useState(0);
    const [selectedSlotId, setSelectedSlotId] = useState(null);
    const [expanded, setExpanded] = useState(false); // Για το "Περισσότερες ώρες"
    const [searchDate, setSearchDate] = useState('');

    // --- 1. ΕΠΕΞΕΡΓΑΣΙΑ ΔΕΔΟΜΕΝΩΝ (Grouping & Sorting) ---
    const groupedDays = useMemo(() => {
        if (!availability || availability.length === 0) return [];

        // Ταξινόμηση
        const sortedSlots = [...availability].sort((a, b) => {
            // Μετατροπή DD/MM/YYYY σε Date object για σωστή σύγκριση
            const [d1, m1, y1] = a.date.split('/');
            const [d2, m2, y2] = b.date.split('/');
            const dateA = new Date(y1, m1 - 1, d1);
            const dateB = new Date(y2, m2 - 1, d2);
            
            if (dateA - dateB !== 0) return dateA - dateB;
            return a.time.localeCompare(b.time);
        });

        // Ομαδοποίηση ανά ημερομηνία
        const groups = {};
        sortedSlots.forEach(slot => {
            if (!groups[slot.date]) {
                const [d, m, y] = slot.date.split('/');
                const dateObj = new Date(y, m - 1, d);
                
                // Format Header: "Δευτέρα" (νέα γραμμή) "12/05"
                const dayName = dateObj.toLocaleDateString('el-GR', { weekday: 'long' });
                const shortDate = dateObj.toLocaleDateString('el-GR', { day: '2-digit', month: '2-digit', year: 'numeric' });

                groups[slot.date] = {
                    dateStr: slot.date,
                    dayName: dayName,
                    fullDate: shortDate,
                    dateObj: dateObj,
                    slots: []
                };
            }
            groups[slot.date].slots.push(slot);
        });

        return Object.values(groups);
    }, [availability]);

    // --- 2. LOGIC VISIBILITY ---
    const visibleDays = groupedDays.slice(startIndex, startIndex + DAYS_TO_SHOW);

    const handleNext = () => {
        if (startIndex + DAYS_TO_SHOW < groupedDays.length) setStartIndex(prev => prev + 1);
    };

    const handlePrev = () => {
        if (startIndex > 0) setStartIndex(prev => prev - 1);
    };

    const handleDateSearch = (e) => {
        const val = e.target.value; // YYYY-MM-DD format
        setSearchDate(val);
        
        if (val) {
            const [y, m, d] = val.split('-');
            const searchTs = new Date(y, m - 1, d).getTime();
            // Βρίσκουμε το index της μέρας >= της ημερομηνίας αναζήτησης
            const index = groupedDays.findIndex(day => day.dateObj.getTime() >= searchTs);
            if (index !== -1) {
                setStartIndex(index);
            }
        }
    };

    return (
        <Paper 
            elevation={0}
            sx={{ 
                p: 4, 
                border: '1px solid #333', 
                bgcolor: '#fff9e6', // Το χαρακτηριστικό μπεζ φόντο
                borderRadius: 2,
                width: '100%',
                maxWidth: '1200px',
                mx: 'auto'
            }}
        >
            {/* --- HEADER --- */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, flexWrap: 'wrap', gap: 2 }}>
                
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                    <CalendarMonthIcon sx={{ fontSize: 36 }} />
                    <Box>
                        <Typography variant="h6" fontWeight="bold" sx={{ lineHeight: 1.2 }}>
                            Δείτε τη διαθεσιμότητα
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            Επίλεξε ημέρα και ώρα του ραντεβού σας
                        </Typography>
                    </Box>
                </Box>

                {/* Date Search Input */}
                <TextField 
                    type="date"
                    size="small"
                    value={searchDate}
                    onChange={handleDateSearch}
                    sx={{ bgcolor: '#fff', borderRadius: 1 }}
                    InputProps={{ inputProps: { style: { padding: '8px' } } }} 
                />
            </Box>

            {/* --- MAIN CALENDAR GRID --- */}
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                
                {/* Αριστερό Βέλος */}
                <IconButton onClick={handlePrev} disabled={startIndex === 0} sx={{ mt: 3 }}>
                    <ArrowBackIosNewIcon />
                </IconButton>

                {/* Στήλες Ημερών */}
     
                    
                {/* Στήλες Ημερών */}
                <Box sx={{ display: 'flex', flex: 1, justifyContent: 'space-between', gap: 0 }}> {/* Αφαίρεσα το gap για να κολλήσουν με το divider */}
                    {visibleDays.length > 0 ? (
                        visibleDays.map((day, i) => (
                            <React.Fragment key={i}>
                                {/* Η Στήλη της Ημέρας */}
                                <Box sx={{ flex: 1, minWidth: '90px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                    
                                    {/* Header Ημέρας */}
                                    <Box sx={{ textAlign: 'center', mb: 2, height: '45px' }}>
                                        <Typography variant="body2" fontWeight="bold" sx={{ textTransform: 'capitalize' }}>
                                            {day.dayName}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            {day.fullDate}
                                        </Typography>
                                    </Box>

                                    {/* Κουτί με Slots */}
                                    <Box sx={{
                                        p: 1, 
                                        width: '100%',
                                        height: 'auto',
                                        gap: 1,
                                        bgcolor: 'transparent',
                                        display: 'flex',            
                                        flexDirection: 'column',    
                                        alignItems: 'center'
                                    }}>
                                        {day.slots
                                            .slice(0, expanded ? day.slots.length : INITIAL_SLOTS_TO_SHOW)
                                            .map((slot) => (
                                            <Button
                                                key={slot.id}
                                                variant={selectedSlotId === slot.id ? "contained" : "outlined"}
                                                onClick={() => setSelectedSlotId(selectedSlotId === slot.id ? null : slot.id)}
                                                sx={{
                                                    width: '80%',
                                                    mx: 'auto',
                                                    mb: 1,
                                                    py: 0.5,
                                                    color: selectedSlotId === slot.id ? '#fff' : '#000',
                                                    borderColor: '#000',
                                                    bgcolor: selectedSlotId === slot.id ? '#000' : 'transparent',
                                                    borderRadius: 2,
                                                    fontSize: '0.85rem',
                                                    fontWeight: 'bold',
                                                    textTransform: 'none',
                                                    '&:hover': {
                                                        bgcolor: selectedSlotId === slot.id ? '#333' : '#eee',
                                                        borderColor: '#000'
                                                    }
                                                }}
                                            >
                                                {slot.time}
                                            </Button>
                                        ))}
                                    </Box>    
                                </Box>

                                {/* Divider: Το βάζουμε ΜΟΝΟ αν ΔΕΝ είναι η τελευταία στήλη */}
                                {i < visibleDays.length - 1 && (
                                    <Divider orientation="vertical" flexItem sx={{ mx: 1, borderColor: '#ccc' }} />
                                )}
                            </React.Fragment>
                        ))
                    ) : (
                        <Typography sx={{ py: 5, width: '100%', textAlign: 'center', color: 'error.main' }}>
                            Δεν βρέθηκαν διαθέσιμα ραντεβού.
                        </Typography>
                    )}
                </Box>

                {/* Δεξί Βέλος */}
                <IconButton onClick={handleNext} disabled={startIndex + DAYS_TO_SHOW >= groupedDays.length} sx={{ mt: 3 }}>
                    <ArrowForwardIosIcon />
                </IconButton>
            </Box>

            {/* --- FOOTER ACTION AREA --- */}
            <Box sx={{ mt: 4, display: 'flex', flexDirection: {xs: 'column', md: 'row'}, justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
                
                {/* Spacer για στοίχιση */}
                <Box sx={{ width: '150px', display: {xs: 'none', md: 'block'} }} /> 

                {/* Κουμπί "Περισσότερες ώρες" */}
                <Button 
                    onClick={() => setExpanded(!expanded)}
                    endIcon={expanded ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    sx={{ 
                        color: '#333', 
                        textTransform: 'none', 
                        border: '1px solid #999',
                        px: 3,
                        bgcolor: '#f0e6d2'
                    }}
                >
                    {expanded ? 'Λιγότερες ώρες' : 'Περισσότερες ώρες'}
                </Button>

                {/* Κουμπί "Κλείσε ραντεβού" */}
                <Button
                    disabled={!selectedSlotId}
                    onClick={() => {
                        // Βρίσκουμε το πλήρες αντικείμενο του slot
                        let foundSlot = null;
                        groupedDays.some(d => {
                             foundSlot = d.slots.find(s => s.id === selectedSlotId);
                             return !!foundSlot;
                        });
                        if (onBookAppointment && foundSlot) onBookAppointment(foundSlot.id);
                    }}
                    sx={{
                        bgcolor: '#6200EA', 
                        color: '#fff',
                        fontWeight: 'bold',
                        px: 4,
                        py: 1,
                        borderRadius: 5,
                        textTransform: 'none',
                        width: '180px',
                        boxShadow: 3,
                        '&:hover': { bgcolor: '#5000aa' },
                        '&.Mui-disabled': { bgcolor: '#ccc', color: '#666' }
                    }}
                >
                    Κλείσε ραντεβού
                </Button>
            </Box>

        </Paper>
    );
};

export default VetAvailabilityCalendar;