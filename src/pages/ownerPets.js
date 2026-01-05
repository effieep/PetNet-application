// import React, { useState, useEffect } from "react";
// import { Grid,  Typography } from "@mui/material";
// import ProfileLayout from "../components/profileLayout";
// import { useAuth } from "../auth/AuthContext";
// import PetPreviewCard from "../components/PetPreviewCard";

// const OwnerPets = () => {
//   const { user } = useAuth();
//   const [pets, setPets] = useState([]);

//   useEffect(() => {
//     fetch(`http://localhost:3001/pets?ownerId=${user.id}`)
//       .then(res => res.json())
//       .then(data => setPets(data));
//   }, [user.id]);

//   return (
//     <ProfileLayout role="owner">
//       <Typography variant="h5" sx={{ mb: 4, fontWeight: "bold", color: "#373721" }}>
//         Τα κατοικίδιά μου
//       </Typography>

//       <Grid container spacing={3}>
//         {pets.map((pet) => (
//             <PetPreviewCard key={pet.id} pet={pet} />
//         ))}
//       </Grid>
//     </ProfileLayout>
//   );
// };

// export default OwnerPets;

import React, { useState, useEffect } from 'react';
import PetPreviewCard from '../components/PetPreviewCard';
import PetDetailsCard from '../components/PetDetailsCard';
import { Grid, Typography, Box, Divider, Button } from '@mui/material';
import ProfileLayout from '../components/profileLayout';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import { useAuth } from '../auth/AuthContext';

const OwnerPets = () => {
  const { user } = useAuth();
  const [pets, setPets] = useState([]);
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
      fetch(`http://localhost:3001/pets?ownerId=${user.id}`)
      .then(res => res.json())
      .then(data => setPets(data));
  }, [user.id]);

  return (
    <ProfileLayout role="owner">
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
  );
};

export default OwnerPets;