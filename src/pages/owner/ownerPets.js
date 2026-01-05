import React, { useState, useEffect } from "react";
import { Grid, Card, CardContent, Typography, Button, Avatar } from "@mui/material";
import { Link } from "react-router-dom";
import ProfileLayout from "../../components/profileLayout";
import { useAuth } from "../../auth/AuthContext";
import { FaCat, FaDog } from "react-icons/fa";

const OwnerPets = () => {
  const { user, isLoggedIn } = useAuth();
  const [pets, setPets] = useState([]);
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    if (!isLoggedIn || !user?.id) return;

    fetch(`http://localhost:3001/pets?ownerId=${user.id}`)
      .then(res => res.json())
      .then(data => setPets(data))
      .catch(err => console.error(err));
  } , [isLoggedIn, user?.id]);


  return (
    isLoggedIn ?
    (<ProfileLayout role="owner">
      <Typography variant="h5" sx={{ mb: 4, fontWeight: "bold", color: "#373721" }}>
        Τα κατοικίδιά μου
      </Typography>

      {/* Η ΛΙΣΤΑ ΠΑΡΑΜΕΝΕΙ ΠΑΝΤΑ ΟΡΑΤΗ */}
      <Grid container spacing={3}>
        {pets.map((pet) => (
          <PetPreviewCard 
            pet={pet} 
            onSelect={() => setSelectedId(pet.id)} 
          />
        ))}
      </Grid>

      {/* Η ΚΑΡΤΕΛΑ ΕΜΦΑΝΙΖΕΤΑΙ ΜΟΝΟ ΟΤΑΝ ΕΠΙΛΕΓΕΙ ΚΑΠΟΙΟ ΖΩΟ */}
      {selectedId && (
        <Box sx={{ mt: 6 }}>
          <Divider sx={{ mb: 4, borderBottomWidth: 2 }} />
          <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
            Λεπτομέρειες Επιλεγμένου Ζώου
          </Typography>
          <Button 
            // component={Link}
            // to={`/owner/pets/${petId}/health`} // Δυναμικό link για το βιβλιάριο
            variant="outlined" 
            startIcon={<MedicalServicesIcon />}
            sx={{ py: 2, borderRadius: '12px', borderColor: '#9a9b6a', color: '#373721' }}
          >
              Βιβλιάριο Υγείας
          </Button>
          <PetDetailsCard petId={selectedId} />
          
        </Box>
      )}
    </ProfileLayout>
  ) : (
    <Typography variant="h6" color="error" textAlign="center" sx={{ mt: 10 }}>
      Παρακαλώ συνδεθείτε για να δείτε τα κατοικίδιά σας.
    </Typography>
  )
  );
};

export default OwnerPets;