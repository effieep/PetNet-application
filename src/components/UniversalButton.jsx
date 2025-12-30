import React from 'react';
import Button from '@mui/material/Button';
import { Link } from "react-router-dom";


export default function UniversalButton({ 
    text, 
    path, 
    bgColor = "#F1D77A", // Default κίτρινο
    textColor = "#373721" // Default σκούρο
}) {
    return (
        <Button 
            component={Link} 
            to={path}
            sx={{
                // --- Βασικά Χρώματα από τα Props ---
                backgroundColor: bgColor,
                color: textColor,
                textTransform: "none",
                textShadow: 'none',
                fontWeight: 700,
                borderRadius: 15, // Στρογγυλεμένο
                boxShadow: 'none',

                // --- Responsive Padding & Font Size ---
                px: { xs: 3, sm: 4, md: 6 }, 
                py: { xs: 0.5, sm: 1 }, 
                fontSize: { xs: '0.85rem', sm: '0.9rem', md: '1rem' },
                marginRight: 2, 
                whiteSpace: 'nowrap', // Για να μην σπάει το κείμενο σε 2 γραμμές

                // --- Hover Effect ---
                '&:hover': {
                    backgroundColor: bgColor, // Κρατάμε το ίδιο χρώμα βάσης...
                    filter: 'brightness(0.85)', // ...και απλά μειώνουμε τη φωτεινότητα!
                    boxShadow: 'grey 0px 2px 5px' // Προσθέτουμε σκιά στο hover,
                }
            }}
        >
            {text}
        </Button>
    );
}