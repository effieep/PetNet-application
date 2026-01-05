import React, { useState, useEffect } from "react";
import { Grid,  Typography, Button,  Box } from "@mui/material";
import ProfileLayout from "../../components/profileLayout";
import PetPreviewCard from "../../components/PetPreviewCard";
import PetDetailsCard from "../../components/PetDetailsCard";
import Divider from '@mui/material/Divider';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import { useAuth } from "../../auth/AuthContext";


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
          <Box sx={{ mt: 2, mb: 2, display: 'flex', justifyContent: 'center' }}>
            <Button 
              // component={Link}
              // to={`/owner/pets/${petId}/health`} // Δυναμικό link για το βιβλιάριο
              variant="outlined" 
              startIcon={<MedicalServicesIcon />}
              sx={{ py: 2, borderRadius: '12px', borderColor: '#4a6cc4ff', color: '#f4f4f4ff', backgroundColor: '#3641a6ff' }}
            >
                ΒΙΒΛΙΑΡΙΟ ΥΓΕΙΑΣ
            </Button>
          </Box>
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