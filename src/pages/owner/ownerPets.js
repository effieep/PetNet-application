import React, { useState, useEffect } from "react";
import { Grid, Card, CardContent, Typography, Button, Avatar } from "@mui/material";
import { Link } from "react-router-dom";
import ProfileLayout from "../../components/profileLayout";
import { useAuth } from "../../auth/AuthContext";
import { FaCat, FaDog } from "react-icons/fa";

const OwnerPets = () => {
  const { user, isLoggedIn } = useAuth();
  const [pets, setPets] = useState([]);

  useEffect(() => {
  if (!isLoggedIn || !user?.id) return;

  fetch(`http://localhost:3001/pets?ownerId=${user.id}`)
    .then(res => res.json())
    .then(data => setPets(data))
    .catch(err => console.error(err));
}, [isLoggedIn, user?.id]);


  return (
    isLoggedIn ?
    (<ProfileLayout role="owner">
      <Typography variant="h5" sx={{ mb: 4, fontWeight: "bold", color: "#373721" }}>
        Τα κατοικίδιά μου
      </Typography>

      <Grid container spacing={3}>
        {pets.map((pet) => (
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
                  component={Link} 
                  to={`/owner/pets/${pet.id}`} 
                  variant="contained" 
                  fullWidth
                  sx={{ mt: 2, backgroundColor: "#9a9b6a" }}
                >
                  ΠΡΟΒΟΛΗ ΣΤΟΙΧΕΙΩΝ
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </ProfileLayout>
  ) : (
    <Typography variant="h6" color="error" textAlign="center" sx={{ mt: 10 }}>
      Παρακαλώ συνδεθείτε για να δείτε τα κατοικίδιά σας.
    </Typography>
  )
  );
};

export default OwnerPets;