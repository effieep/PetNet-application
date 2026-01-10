import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, Paper, Divider, CircularProgress, Stack} from '@mui/material';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import { API_URL } from '../api';

const PetDetailsCard = ({ petId }) => {
  const [pet, setPet] = useState(null);
  const [owner, setOwner] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // 1. Κλήση για τα δεδομένα του κατοικιδίου
        const petRes = await fetch(`${API_URL}/pets/${petId}`);
        const petData = await petRes.json();
        setPet(petData);

        // 2. Κλήση για τα δεδομένα του ιδιοκτήτη
        const ownerRes = await fetch(`${API_URL}/users/${petData.ownerId}`);
        const ownerData = await ownerRes.json();
        setOwner(ownerData);
      } catch (error) {
        console.error("Σφάλμα κατά την ανάκτηση δεδομένων:", error);
      } finally {
        setLoading(false);
      }
    };

    if (petId) {
      fetchData();
    }
  }, [petId]);

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}><CircularProgress /></Box>;
  if (!pet) return null;

  return (
    <Paper 
      elevation={0} 
      sx={{ 
        p: 4, 
        maxWidth: 900,
        backgroundColor: '#F1D77A', 
        borderRadius: '20px', 
        border: '1px solid #000',
        mt: 3 // Προσθέτουμε λίγο κενό από τις πάνω κάρτες
      }}
    >
      <Grid container spacing={4}>
        {/* ΑΡΙΣΤΕΡΗ ΠΛΕΥΡΑ: ΣΤΟΙΧΕΙΑ ΖΩΟΥ */}
        <Grid item xs={12} md={7} sx={{ display: 'flex', gap: 3 }}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2 }}>{pet.name}</Typography>
            <Box sx={{ width: 120, height: 120, border: '1px solid #000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CameraAltIcon sx={{ fontSize: 40 }} />
            </Box>
          </Box>

          <Box sx={{ flex: 1, minWidth: '250px', backgroundColor: 'rgba(255,255,255,0.2)', p: 2, borderRadius: '15px' }}>
            <Stack spacing={3}>
              <DetailRow label="Microchip:" value={pet.microchip} />
              <DetailRow label="Είδος:" value={pet.species} />
              <DetailRow label="Φύλο:" value={pet.gender || "Μη ορισμένο"} />
              <DetailRow label="Φυλή:" value={pet.breed || "Ημίαιμο"} />
              <DetailRow label="Ημ/νία Γέννησης:" value={pet.birthDate || "-"} />
              <DetailRow label="Βάρος:" value={pet.weight || "-"} />
              <DetailRow label="Χρώμα:" value={pet.color || "-"} />
            </Stack>
          </Box>
        </Grid>

        <Divider orientation="vertical" flexItem sx={{ borderColor: '#000', display: { xs: 'none', md: 'block' }, mx: 2 }} />

        {/* ΔΕΞΙΑ ΠΛΕΥΡΑ: ΣΤΟΙΧΕΙΑ ΙΔΙΟΚΤΗΤΗ */}
        <Grid item xs={12} md={4}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>Στοιχεία Ιδιοκτήτη</Typography>
          <OwnerField label="Ονοματεπώνυμο" value={`${owner?.name} ${owner?.surname}`} />
          <OwnerField label="Τηλέφωνο επικοινωνίας" value={owner?.phone} />
          <OwnerField label="Εmail" value={owner?.email} />
          <OwnerField label="Διεύθυνση κατοικίας" value={owner?.street || "Δεν έχει οριστεί"} />
        </Grid>
      </Grid>
    </Paper>
  );
};

// Helper Components
export const DetailRow = ({ label, value }) => (
  <Box sx={{ display: 'flex', mb: 1.2 }}>
    <Typography sx={{ fontWeight: '600', minWidth: '160px' }}>{label}</Typography>
    <Typography>{value}</Typography>
  </Box>
);

export const OwnerField = ({ label, value }) => (
  <Box sx={{ mb: 2 }}>
    <Typography variant="caption" sx={{ fontWeight: 'bold', mb: 0.5, display: 'block' }}>{label}</Typography>
    <Box sx={{ backgroundColor: '#FFE58F', p: 1, borderRadius: '20px', border: '1px solid rgba(0,0,0,0.1)' }}>
      <Typography variant="body2">{value}</Typography>
    </Box>
  </Box>
);

export default PetDetailsCard;