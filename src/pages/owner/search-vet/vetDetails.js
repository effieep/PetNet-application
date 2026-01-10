import { Box, Typography } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { API_URL }from "../../../api";

const VetDetails = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const [vet, setVet] = useState(location.state?.vet || null);

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

    // Αν δεν έχουν φορτώσει ακόμα τα δεδομένα, δεν δείχνουμε τίποτα (ή ένα Spinner)
    if (!vet) return null;
    return (
        <Box>
            <Typography variant="h4" sx={{ mb: 2 }}>
                {vet.name} {vet.surname} - Δημόσιο Προφίλ Κτηνιάτρου
            </Typography>
            {/* Add vet public profile details here */}
        </Box>
    );
};

export default VetDetails;