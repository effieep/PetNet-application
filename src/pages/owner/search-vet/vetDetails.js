import { 
  Box, Typography, Paper, Avatar, Rating, Button, Container, Snackbar, Alert
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import VetBio from '../../../components/VetBio';
import { useLocation, useNavigate } from 'react-router-dom';
import {Chip} from "@mui/material";
import { useState, useEffect } from 'react';
import { API_URL }from "../../../api";
import VetReviews from '../../../components/VetReviewsCard';
import VetAvailabilityCalendar from '../../../components/VetAvailabilityCalendar.jsx';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import 'dayjs/locale/el';
import { useAuth } from '../../../auth/AuthContext.jsx';

dayjs.extend(customParseFormat);
dayjs.locale('el');

const VetDetails = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const { isLoggedIn, user } = useAuth();
    const [vet, setVet] = useState(location.state?.vet || null);
    const [activeTab, setActiveTab] = useState('bio');
    const [authorsMap, setAuthorsMap] = useState({});
    const [snackbarOpen, setSnackbarOpen] = useState({ open: false, message: '', severity: 'success' });
    
    const openSnackbar = (message, severity='success') => {
        setSnackbarOpen({ open: true, message, severity });
    };

    const closeSnackbar = () => {
        setSnackbarOpen({ open: false, message: '', severity: 'success' });
    };
    
    useEffect(() => {
    if (!vet) {
        const storedVetId = localStorage.getItem("activeVetId");
        if (storedVetId) {
        // Κάνουμε fetch το ζώο ξανά
        fetch(`${API_URL}/users/${storedVetId}`)
            .then(res => res.json())
            .then(data => setVet(data))
            .catch(() => navigate('/owner/pets'));
        } else {
        // Αν δεν βρούμε τίποτα, πίσω στη λίστα
        navigate('/owner/search-vet');
        }
    }
    }, [vet, navigate]);

    useEffect(() => {
        const fetchAuthors = async () => {
        if (!vet || !vet.reviews || vet.reviews.length === 0) return;

        try {
            // Μαζεύουμε όλα τα μοναδικά authorIds από τα reviews
            const uniqueAuthorIds = [...new Set(vet.reviews.map(r => r.authorId))];

            // Fetch όλους τους χρήστες (ή αν το API υποστηρίζει φίλτρο: ?id=u1&id=u2...)
            // Εδώ κάνω fetch all για απλότητα με JSON server
            const res = await fetch(`${API_URL}/users`);
            const allUsers = await res.json();

            // Φτιάχνουμε ένα λεξικό: { "u1": "Μαρία Παπ.", "u2": "Γιάννης Κ." }
            const map = {};
            allUsers.forEach(u => {
                if (uniqueAuthorIds.includes(u.id)) {
                    map[u.id] = `${u.name} ${u.surname}`;
                }
            });

            setAuthorsMap(map);
        } catch (err) {
            console.error("Failed to fetch review authors:", err);
        }
        };

        fetchAuthors();
    }, [vet]); // Τρέχει κάθε φορά που φορτώνει νέος vet

    const ratingValue = vet.reviews && vet.reviews.length > 0
    ? vet.reviews.reduce((acc, rev) => acc + rev.rating, 0) / vet.reviews.length
    : 0; 
    const reviewsCount = vet.reviews ? vet.reviews.length : 0;

    
    const onBookAppointment = (slotId) => {
        if(!isLoggedIn || user.role !== 'owner') {
            openSnackbar('Πρέπει να είστε συνδεδεμένος/η ως ιδιοκτήτης κατοικιδίου για να κλείσετε ραντεβού.', 'error');
            return;
        }
        if(slotId) { 
            navigate('/owner/search-vet/book-appointment', {
                state: {
                    vetId: vet.id,
                    slotId: slotId,
                }
            });
        }
    }

    
    // Αν δεν έχουν φορτώσει ακόμα τα δεδομένα, δεν δείχνουμε τίποτα (ή ένα Spinner)
    if (!vet) return null;
    return (

        <Box sx={{ maxWidth: '100%', minHeight: '100vh', pb: 8}}>
        
        {/* --- 1. HEADER SECTION (ΚΑΡΤΕΛΑ) --- */}
        <Container maxWidth="md" sx={{ pt: 6, pb: 4 }}>
            <Paper 
            elevation={3} 
            sx={{ 
                p: 4, 
                borderRadius: 3, 
                bgcolor: '#FAFAFA', // Το υπόλευκο φόντο της κάρτας
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' }, // Stack σε κινητά, Row σε PC
                alignItems: 'center',
                gap: 4
            }}
            >
            {/* Αριστερά: Φωτογραφία με βελάκια */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar 
                    src={vet.profilePic} 
                    variant="square"
                    sx={{ 
                        width: 200, 
                        height: 200, 
                        bgcolor: '#f0f0f0',
                        border: '1px solid #ccc' 
                    }}
                />
            </Box>

            {/* Δεξιά: Πληροφορίες */}
            <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
                <Typography variant="h5" fontWeight="bold" sx={{ mb: 1 }}>
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
                {/* Αξιολόγηση */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2, mt:2, justifyContent: { xs: 'center', md: 'flex-start' } }}>
                    <Rating value={ratingValue} precision={0.5} readOnly />
                    <Typography fontWeight="bold">{ratingValue.toFixed(1)} / 5</Typography>
                    <Typography color="text.secondary">({reviewsCount} αξιολογήσεις)</Typography>
                </Box>

                {/* Τοποθεσία */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: { xs: 'center', md: 'flex-start' } }}>
                    <LocationOnIcon sx={{ color: '#333' }} />
                    <Typography variant="body1" fontWeight="500">
                        Τοποθεσία ιατρείου : {vet.clinicAddress}, {vet.city}
                    </Typography>
                </Box>
            </Box>
            </Paper>
        </Container>

        {/* --- 2. NAVIGATION BUTTONS --- */}
        <Container maxWidth="md" sx={{ mb: 4 }}>
            <Box 
                sx={{ 
                    display: 'flex', 
                    flexDirection: { xs: 'column', sm: 'row' }, // Κάθετα σε κινητά
                    borderRadius: 2, 
                    overflow: 'hidden', 
                    border: '1px solid rgba(0,0,0,0.1)'
                }}
            >
                {/* Κουμπί 1: Βιογραφικό */}
                <Button
                    fullWidth
                    onClick={() => setActiveTab('bio')}
                    sx={{
                        py: 2,
                        borderRadius: 0,
                        fontWeight: 'bold',
                        textTransform: 'none',
                        fontSize: '1rem',
                        bgcolor: activeTab === 'bio' ? '#6D5D4B' : '#E8D58E', // Σκούρο καφέ αν ενεργό, χρυσό αν όχι
                        color: activeTab === 'bio' ? '#fff' : '#333',
                        '&:hover': { bgcolor: activeTab === 'bio' ? '#5a4d3e' : '#d4c27d' }
                    }}
                >
                    Βιογραφικό & Υπηρεσίες
                </Button>

                {/* Κουμπί 2: Διαθεσιμότητα */}
                <Button
                    fullWidth
                    onClick={() => setActiveTab('availability')}
                    sx={{
                        py: 2,
                        borderRadius: 0,
                        fontWeight: 'bold',
                        textTransform: 'none',
                        fontSize: '1rem',
                        bgcolor: activeTab === 'availability' ? '#6D5D4B' : '#E8D58E', // Σκούρο καφέ αν ενεργό, χρυσό αν όχι
                        color: activeTab === 'availability' ? '#fff' : '#333',
                        borderLeft: '1px solid rgba(0,0,0,0.1)',
                        borderRight: '1px solid rgba(0,0,0,0.1)',
                        '&:hover': { bgcolor: activeTab === 'availability' ? '#5a4d3e' : '#e0d682' }
                    }}
                >
                    Δείτε τη διαθεσιμότητα
                </Button>

                {/* Κουμπί 3: Αξιολογήσεις */}
                <Button
                    fullWidth
                    onClick={() => setActiveTab('reviews')}
                    sx={{
                        py: 2,
                        borderRadius: 0,
                        fontWeight: 'bold',
                        textTransform: 'none',
                        fontSize: '1rem',
                        bgcolor: activeTab === 'reviews' ? '#6D5D4B' : '#E8D58E',
                        color: activeTab === 'reviews' ? '#fff' : '#333',
                        '&:hover': { bgcolor: activeTab === 'reviews' ? '#5a4d3e' : '#d4c27d' }
                    }}
                >
                    Αξιολογήσεις χρηστών
                </Button>
            </Box>
        </Container>

        {/* --- 3. DYNAMIC CONTENT AREA --- */}
        <Container maxWidth="lg">
            {activeTab === 'bio' && (
                <VetBio vet={vet} />
            )}

            {activeTab === 'availability' && (
               <VetAvailabilityCalendar 
                    availability={vet.availability}
                    onBookAppointment={onBookAppointment} 
                />
            )}

            {activeTab === 'reviews' && (
                <Box sx={{ mt: 4, px: 2 }}>
                    <VetReviews 
                        vet={vet} 
                        authors={authorsMap} // Περνάμε το map με τα ονόματα
                    />
                </Box>
            )}
        </Container>
        <Snackbar
            open={snackbarOpen.open}
            autoHideDuration={3000} // 3 seconds
            onClose={closeSnackbar}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
            <Alert
                onClose={closeSnackbar}
                severity={snackbarOpen.severity}
                sx={{ width: '100%' }}
            >
                {snackbarOpen.message}
            </Alert>
        </Snackbar>
        </Box>
      
        
    );
};

export default VetDetails;