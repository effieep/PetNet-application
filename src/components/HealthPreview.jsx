import React from 'react';
import { Box, Typography, Grid, Paper, Chip, Divider } from '@mui/material';

// Icons
import VaccinesIcon from '@mui/icons-material/Vaccines';
import BugReportIcon from '@mui/icons-material/BugReport';
import MedicationIcon from '@mui/icons-material/Medication';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

const HealthPreview = ({ healthData }) => {
  // Αν δεν υπάρχουν δεδομένα υγείας, δείχνουμε μήνυμα
  if (!healthData) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography color="text.secondary">Δεν βρέθηκαν δεδομένα υγείας για αυτό το ζώο.</Typography>
      </Box>
    );
  }

  const { overview, neutered } = healthData;

  // Βοηθητικό στυλ για τις κάρτες
  const cardStyle = {
    p: 3,
    borderRadius: '20px',
    height: '100%',
    backgroundColor: 'white',
    boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
    transition: 'transform 0.2s',
    '&:hover': {
      transform: 'translateY(-3px)',
      boxShadow: '0 6px 15px rgba(0,0,0,0.06)'
    }
  };

  return (
    <Box>
      {/* 1. STATUS BAR: Στείρωση & Γενική Κατάσταση */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, flexWrap: 'wrap', gap: 2 }}>
        <Typography variant="h6" fontWeight="bold" color="#333">
          Τελευταίες Πράξεις & Κατάσταση
        </Typography>

        <Chip
          icon={neutered ? <CheckCircleIcon /> : <CancelIcon />}
          label={neutered ? "Στειρωμένο" : "Μη Στειρωμένο"}
          color={neutered ? "success" : "default"}
          variant={neutered ? "filled" : "outlined"}
          sx={{ fontWeight: "bold", fontSize: '0.9rem', py: 2, borderRadius: '12px' }}
        />
      </Box>

      <Grid container spacing={3}>
        {/* 2. ΤΕΛΕΥΤΑΙΟΣ ΕΜΒΟΛΙΑΣΜΟΣ */}
        <Grid item xs={12} md={6}>
          <Paper elevation={0} sx={cardStyle}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 1.5 }}>
              <Box sx={{ bgcolor: '#e0f2f1', p: 1, borderRadius: '10px', color: '#1ea596' }}>
                <VaccinesIcon />
              </Box>
              <Typography variant="subtitle1" fontWeight="bold">Τελευταίος Εμβολιασμός</Typography>
            </Box>
            
            <Divider sx={{ mb: 2 }} />

            {overview?.lastVaccine ? (
              <>
                <Typography variant="body2" color="text.secondary" gutterBottom>Τύπος Εμβολίου</Typography>
                <Typography variant="h6" color="#1ea596" fontWeight="bold" gutterBottom>
                  {overview.lastVaccine.name}
                </Typography>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                  <Box>
                    <Typography variant="caption" color="text.secondary">Ημερομηνία</Typography>
                    <Typography fontWeight="500">{overview.lastVaccine.date}</Typography>
                  </Box>
                  <Box sx={{ textAlign: 'right' }}>
                    <Typography variant="caption" color="text.secondary">Επόμενη Δόση</Typography>
                    <Typography fontWeight="500" color="error.main">{overview.lastVaccine.nextDate}</Typography>
                  </Box>
                </Box>
              </>
            ) : (
              <Typography color="text.secondary" fontStyle="italic">Δεν έχει καταχωρηθεί εμβόλιο.</Typography>
            )}
          </Paper>
        </Grid>

        {/* 3. ΤΕΛΕΥΤΑΙΑ ΑΠΟΠΑΡΑΣΙΤΩΣΗ */}
        <Grid item xs={12} md={6}>
          <Paper elevation={0} sx={cardStyle}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 1.5 }}>
              <Box sx={{ bgcolor: '#fff3e0', p: 1, borderRadius: '10px', color: '#ff9800' }}>
                <BugReportIcon />
              </Box>
              <Typography variant="subtitle1" fontWeight="bold">Τελευταία Αποπαρασίτωση</Typography>
            </Box>

            <Divider sx={{ mb: 2 }} />

            {overview?.lastDeworming ? (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {/* Εσωτερικά */}
                <Box>
                  <Typography variant="body2" color="text.secondary">Ενδοπαράσιτα (Χάπι)</Typography>
                  <Typography fontWeight="bold">{overview.lastDeworming.internal}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    Επόμενη: {overview.lastDeworming.nextInternal}
                  </Typography>
                </Box>
                
                {/* Εξωτερικά */}
                <Box>
                  <Typography variant="body2" color="text.secondary">Εξωπαράσιτα (Αμπούλα/Κολάρο)</Typography>
                  <Typography fontWeight="bold">{overview.lastDeworming.external}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    Επόμενη: {overview.lastDeworming.nextExternal}
                  </Typography>
                </Box>
              </Box>
            ) : (
               <Typography color="text.secondary" fontStyle="italic">Δεν υπάρχουν δεδομένα.</Typography>
            )}
          </Paper>
        </Grid>

        {/* 4. ΤΡΕΧΟΥΣΑ ΑΓΩΓΗ (ΜΕΓΑΛΗ ΚΑΡΤΑ ΚΑΤΩ) */}
        <Grid item xs={12}>
          <Paper elevation={0} sx={{ ...cardStyle, border: overview?.activeMedication ? '1px solid #90caf9' : 'none', bgcolor: overview?.activeMedication ? '#e3f2fd' : 'white' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 1.5 }}>
              <Box sx={{ bgcolor: 'white', p: 1, borderRadius: '10px', color: '#1976d2' }}>
                <MedicationIcon />
              </Box>
              <Typography variant="subtitle1" fontWeight="bold">Τρέχουσα Φαρμακευτική Αγωγή</Typography>
            </Box>

            {overview?.activeMedication ? (
              <Grid container spacing={2} alignItems="center">
                 <Grid item xs={12} md={8}>
                    <Typography variant="h6" fontWeight="bold" color="primary">
                      {overview.activeMedication.name}
                    </Typography>
                    <Typography variant="body1">
                      {overview.activeMedication.instructions}
                    </Typography>
                 </Grid>
                 <Grid item xs={12} md={4} sx={{ textAlign: { xs: 'left', md: 'right' } }}>
                    <Chip 
                      icon={<AccessTimeIcon />} 
                      label={`Λήξη: ${overview.activeMedication.endDate}`} 
                      color="primary" 
                      variant="outlined" 
                    />
                 </Grid>
              </Grid>
            ) : (
              <Typography color="text.secondary">Δεν υπάρχει ενεργή φαρμακευτική αγωγή αυτή τη στιγμή.</Typography>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default HealthPreview;