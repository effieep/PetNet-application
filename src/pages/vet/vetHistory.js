import ProfileLayout from "../../components/profileLayout";
import { useState, useEffect } from "react";
import { useAuth } from "../../auth/AuthContext";
import { Box, Typography } from "@mui/material";
import { API_URL } from "../../api";

const VetHistory = () => {

    const {user} = useAuth(); // Παίρνουμε τον χρήστη από το Context
    const [userData, setUserData] = useState(null);
    // const [loading, setLoading] = useState(true);
    // const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
        try {
            const response = await fetch(`${API_URL}/users/${user.id}`);
            if (!response.ok) throw new Error("Δεν βρέθηκαν τα στοιχεία του χρήστη.");
            const data = await response.json();
            setUserData(data);
        } catch (err) {
            // setError(err.message);
        } finally {
            // setLoading(false);
        }
        };

        if (user?.id) {
        fetchUserData();
        } else {
        // setLoading(false);
        }
    }, [user]);

    return ( 
        <ProfileLayout role={userData?.role || "vet"}>
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',    
                alignItems: 'center',
                justifyContent: 'center',
                p: 3
            }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                    Ιστορικό Ραντεβού
                </Typography>
                {/* Περιεχόμενο ιστορικού ραντεβού θα προστεθεί εδώ στο μέλλον */}
            </Box>
        </ProfileLayout>
        )
    };

export default VetHistory;