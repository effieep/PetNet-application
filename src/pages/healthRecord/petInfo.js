import HealthRecordLayout from "../../components/HealthRecordLayout";
import PetDetailsCard from "../../components/PetDetailsCard";
import { Box } from "@mui/material";
import { useLocation, useNavigate} from "react-router-dom";
import { useState, useEffect } from "react";
import { API_URL }from "../../api";

const PetInfo = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [pet, setPet] = useState(location.state?.pet || null);

  useEffect(() => {
      if (!pet) {
          const storedPetId = localStorage.getItem("activePetId");
          if (storedPetId) {
          // Κάνουμε fetch το ζώο ξανά
          fetch(`${API_URL}/pets/${storedPetId}`)
              .then(res => res.json())
              .then(data => setPet(data))
              .catch(() => navigate('/owner/pets'));
          } else {
          // Αν δεν βρούμε τίποτα, πίσω στη λίστα
          navigate('/owner/pets');
          }
      }
  }, [pet, navigate]);
  
  // Αν δεν έχουν φορτώσει ακόμα τα δεδομένα, δεν δείχνουμε τίποτα 
  if (!pet) return null;
  return (
    <HealthRecordLayout petData={pet} activeTab="petInfo">
         <Box sx={{ maxWidth: '1000px', mx: 'auto' }}>
            <PetDetailsCard petId={pet.id} />
         </Box>
    </HealthRecordLayout>
  );
};

export default PetInfo;