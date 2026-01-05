import { Box, Typography, Grid, Button } from '@mui/material';
import { useParams, Link } from 'react-router-dom';
import PetDetailsCard from '../components/PetDetailsCard'; // Η κάρτα που ήδη έγραψες
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import HistoryIcon from '@mui/icons-material/History';

const PetFullProfile = () => {
  const { petId } = useParams();

  return (
    <Box>
      {/* Εδώ εμφανίζεται η κίτρινη κάρτα με τα στοιχεία */}
      <PetDetailsCard petId={petId} />

      {/* Εδώ προσθέτουμε τα επιπλέον κουμπιά διαχείρισης */}
      <Box sx={{ mt: 5 }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: '#373721' }}>
          Διαχείριση Κατοικιδίου
        </Typography>
        
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={4}>
            <Button 
              component={Link}
              to={`/owner/pets/${petId}/health`} // Δυναμικό link για το βιβλιάριο
              variant="outlined" 
              fullWidth
              startIcon={<MedicalServicesIcon />}
              sx={{ py: 2, borderRadius: '12px', borderColor: '#9a9b6a', color: '#373721' }}
            >
              Βιβλιάριο Υγείας
            </Button>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Button 
              variant="outlined" 
              fullWidth
              startIcon={<HistoryIcon />}
              sx={{ py: 2, borderRadius: '12px', borderColor: '#9a9b6a', color: '#373721' }}
            >
              Ιστορικό Εξετάσεων
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default PetFullProfile;