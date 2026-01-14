import React, { useState, useEffect } from "react";
import { Grid,  Typography, Button,  Box } from "@mui/material";
import ProfileLayout from "../../components/profileLayout";
import PetPreviewCard from "../../components/PetPreviewCard";
import PetDetailsCard from "../../components/PetDetailsCard";
import Divider from '@mui/material/Divider';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import { useAuth } from "../../auth/AuthContext";
import { useNavigate }from 'react-router-dom';
import { API_URL }from "../../api";

const OwnerPets = () => {
  const navigate = useNavigate();
  const { user, isLoggedIn } = useAuth();
  const [pets, setPets] = useState([]);
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    if (!isLoggedIn || !user?.id) return;

    fetch(`${API_URL}/pets?ownerId=${user.id}`)
      .then(res => res.json())
      .then(data => setPets(data))
      .catch(err => console.error(err));
  } , [isLoggedIn, user?.id]);


  const handleOpenHealthRecord = (pet) => {
   
    localStorage.setItem("activePetId", pet.id);
    localStorage.setItem("viewHealthRecordFrom", "ownerPets");

    navigate('/healthRecord', { 
      state: { pet: pet } 
    });
  };

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
              onClick={() => handleOpenHealthRecord(pets.find(p => p.id === selectedId))}
              variant="outlined" 
              startIcon={<MedicalServicesIcon />}
              sx={{ py: 2, borderRadius: '12px', borderColor: '#4a6cc4ff', color: '#f4f4f4ff', backgroundColor: '#3641a6ff' }}
            >
                ΒΙΒΛΙΑΡΙΟ ΥΓΕΙΑΣ
            </Button>
          </Box>
          <PetDetailsCard petId={selectedId} edit={true} />
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