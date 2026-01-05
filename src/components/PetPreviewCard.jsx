import { Card, CardContent, Typography, Avatar, Button, Grid } from '@mui/material';
import { FaCat, FaDog } from "react-icons/fa";

const PetPreviewCard = ({ pet, onSelect }) => {
  return (
    <Grid item xs={12} sm={6} md={4} key={pet.id}>
        <Card sx={{ borderRadius: 4, border: "1px solid #e0e0e0", textAlign: "center", p: 2 }}>
            <Avatar sx={{ bgcolor: "#9a9b6a", width: 60, height: 60, m: "auto", mb: 2 }}>
            {pet.species === "Γάτα" && <FaCat />}
            {pet.species === "Σκύλος" && <FaDog />} {/* Μπορείτε να αλλάξετε το εικονίδιο */}
            </Avatar>
            <CardContent>
            <Typography variant="h6" fontWeight="bold">{pet.name}</Typography>
            <Typography color="textSecondary">Είδος: {pet.species}</Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>Microchip: {pet.microchip}</Typography>
            <Button 
                onClick={onSelect}
                variant="contained" 
                fullWidth
                sx={{ mt: 2, backgroundColor: "#9a9b6a" }}
            >
                ΠΡΟΒΟΛΗ ΣΤΟΙΧΕΙΩΝ
            </Button>
            </CardContent>
        </Card>
    </Grid>
    );
};

export default PetPreviewCard;