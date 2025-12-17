import React, { useState } from 'react';
import { 
  Stepper, Step, StepLabel, Button, Typography, Box, Paper, TextField, 
  FormControl, RadioGroup, FormControlLabel, Radio, Grid, Divider 
} from '@mui/material';

// --- ΤΑ ΒΗΜΑΤΑ ---
const steps = [
  'Κατηγορία Χρήστη', 
  'Προσωπικά Στοιχεία', 
  'Κωδικός', 
  'Επιβεβαίωση', 
  'Σύνοψη'
];

// ==============================================
// SUB-COMPONENTS (ΤΟ ΠΕΡΙΕΧΟΜΕΝΟ ΤΩΝ ΒΗΜΑΤΩΝ)
// ==============================================

const StepCategory = ({ formData, setFormData }) => (
  <Box sx={{ textAlign: 'center', mt: 2 }}>
    <Typography variant="h6" gutterBottom>Επιλέξτε την ιδιότητά σας</Typography>
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
      <FormControl component="fieldset">
        <RadioGroup
          row
          name="userType"
          value={formData.userType}
          onChange={(e) => setFormData({ ...formData, userType: e.target.value })}
        >
          <FormControlLabel value="owner" control={<Radio />} label="Ιδιοκτήτης Ζώου" sx={{ mr: 4 }} />
          <FormControlLabel value="vet" control={<Radio />} label="Κτηνίατρος" />
        </RadioGroup>
      </FormControl>
    </Box>
  </Box>
);

const StepPersonalDetails = ({ formData, setFormData }) => (
  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
     {/* Γ. ΣΤΟΙΧΕΙΑ ΚΤΗΝΙΑΤΡΟΥ */}
    {(
      <Box>
        <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#9a9b6a', mb: 1 }}>Προσωπικά στοιχεία</Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField 
              fullWidth label="Όνομα" variant="outlined" size="small"
              value={formData.Name} onChange={(e) => setFormData({...formData, Name: e.target.value})}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField 
              fullWidth label="Επώνυμο" variant="outlined" size="small"
              value={formData.Surname} onChange={(e) => setFormData({...formData, Surname: e.target.value})}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField 
              fullWidth label="ΑΦΜ" variant="outlined" size="small"
              value={formData.afm} onChange={(e) => setFormData({...formData, afm: e.target.value})}
            />
          </Grid>
        </Grid>
      </Box>
    )}
    {/* Α. ΣΤΟΙΧΕΙΑ ΚΑΤΟΙΚΙΑΣ */}
    <Box>
      <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#9a9b6a', mb: 1 }}>Στοιχεία Κατοικίας</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField 
            fullWidth label="Διεύθυνση" variant="outlined" size="small"
            value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField 
            fullWidth label="Πόλη" variant="outlined" size="small"
            value={formData.city} onChange={(e) => setFormData({...formData, city: e.target.value})}
          />
        </Grid>
      </Grid>
    </Box>
    <Divider />
    {/* Β. ΣΤΟΙΧΕΙΑ ΕΠΙΚΟΙΝΩΝΙΑΣ */}
    <Box>
      <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#9a9b6a', mb: 1 }}>Στοιχεία Επικοινωνίας</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField 
            fullWidth label="Email" variant="outlined" size="small"
            value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField 
            fullWidth label="Τηλέφωνο" variant="outlined" size="small"
            value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})}
          />
        </Grid>
      </Grid>
    </Box>
    <Divider />
   
  </Box>
);

// Στοιχεία του Κτηνιάτρου
const StepVetProfessional = ({ formData, setFormData }) => (
  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>

    {/* Α. ΠΛΗΡΟΦΟΡΙΕΣ ΕΜΠΕΙΡΙΑΣ */}
    <Box>
      <Typography variant="h6" sx={{ color: '#1565c0', fontWeight: 'bold', mb: 2 }}>
        Πληροφορίες εμπειρίας
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField fullWidth label="Ίδρυμα απόκτησης πτυχίου" size="small" 
            value={formData.degreeInst} onChange={(e) => setFormData({...formData, degreeInst: e.target.value})} />
        </Grid>
        <Grid item xs={12}>
          <TextField fullWidth label="Ίδρυμα απόκτησης μεταπτυχιακού (Msc)" size="small" 
            value={formData.masterInst} onChange={(e) => setFormData({...formData, masterInst: e.target.value})} />
        </Grid>
        <Grid item xs={12}>
          <TextField fullWidth label="Ίδρυμα απόκτησης διδακτορικού (Phd)" size="small" 
            value={formData.phdInst} onChange={(e) => setFormData({...formData, phdInst: e.target.value})} />
        </Grid>
        <Grid item xs={12}>
          <TextField fullWidth label="Εξειδίκευση" size="small" 
            value={formData.specialization} onChange={(e) => setFormData({...formData, specialization: e.target.value})} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField fullWidth label="Αριθμός Μητρώου Π.Κ.Σ." size="small" 
            value={formData.registryNum} onChange={(e) => setFormData({...formData, registryNum: e.target.value})} 
            helperText="Ο Α.Μ. Π.Κ.Σ. πρέπει να περιέχει μόνο ψηφία"
            FormHelperTextProps={{ sx: { color: 'red' } }} 
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField fullWidth label="Χρόνια άσκησης" size="small" 
            value={formData.practiceYears} onChange={(e) => setFormData({...formData, practiceYears: e.target.value})} />
        </Grid>
      </Grid>
    </Box>

    <Divider />

    {/* Β. ΠΛΗΡΟΦΟΡΙΕΣ ΙΑΤΡΕΙΟΥ ΕΡΓΑΣΙΑΣ */}
    <Box>
      <Typography variant="h6" sx={{ color: '#1565c0', fontWeight: 'bold', mb: 2 }}>
        Πληροφορίες ιατρείου εργασίας
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={8}>
          <TextField fullWidth label="Διεύθυνση Ιατρείου" size="small" 
            value={formData.clinicAddress} onChange={(e) => setFormData({...formData, clinicAddress: e.target.value})} />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField fullWidth label="Τ.Κ." size="small" 
            value={formData.clinicZip} onChange={(e) => setFormData({...formData, clinicZip: e.target.value})} />
        </Grid>
        <Grid item xs={12}>
          <TextField fullWidth label="Πόλη" size="small" 
            value={formData.clinicCity} onChange={(e) => setFormData({...formData, clinicCity: e.target.value})} />
        </Grid>
      </Grid>
    </Box>
  </Box>
);

const StepPassword = ({ formData, setFormData }) => (
  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxWidth: '400px', margin: 'auto' }}>
    <Typography align="center" sx={{ mb: 2 }}>Ορίστε έναν ασφαλή κωδικό πρόσβασης.</Typography>
    <TextField 
      fullWidth type="password" label="Κωδικός" 
      value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})}
    />
    <TextField 
      fullWidth type="password" label="Επιβεβαίωση Κωδικού" 
      value={formData.confirmPassword} onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
    />
  </Box>
);

const StepConfirmation = ({ formData }) => (
  <Box>
    <Typography variant="h6" gutterBottom>Παρακαλώ ελέγξτε τα στοιχεία σας:</Typography>
    <Paper elevation={0} sx={{ bgcolor: '#f5f5f5', p: 3, borderRadius: 2 }}>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0, lineHeight: '2' }}>
        <li><strong>Τύπος:</strong> {formData.userType === 'owner' ? 'Ιδιοκτήτης' : 'Κτηνίατρος'}</li>
        <li><strong>Όνομα:</strong> {formData.Name}</li>
        <li><strong>Επώνυμο:</strong> {formData.Surname}</li>
        <li><strong>Email:</strong> {formData.email}</li>
        <li><strong>Διεύθυνση:</strong> {formData.address}, {formData.city}</li>
        <li><strong>Τηλέφωνο:</strong> {formData.phone}</li>
        {formData.userType === 'owner' && <li><strong>Κτηνίατρος:</strong> {formData.Name || '-'}</li>}
      </ul>
    </Paper>
  </Box>
);

const StepSummary = () => (
  <Box sx={{ textAlign: 'center', py: 5 }}>
    <Typography variant="h5" color="success.main" gutterBottom>Συγχαρητήρια!</Typography>
    <Typography>Όλα είναι έτοιμα. Πατήστε "Ολοκλήρωση" για να δημιουργηθεί ο λογαριασμός.</Typography>
  </Box>
);

// ==============================================
// ΚΥΡΙΟ COMPONENT (PARENT)
// ==============================================
export default function SignUpStepper() {
  const [activeStep, setActiveStep] = useState(0);

  // State Δεδομένων
  const [formData, setFormData] = useState({
    userType: 'owner',
    address: '', city: '', email: '', phone: '', Name: '',
    password: '', confirmPassword: ''
  });

  const handleNext = () => setActiveStep((prev) => prev + 1);
  const handleBack = () => setActiveStep((prev) => prev - 1);
  
  const handleSubmit = () => {
    console.log("Final Data:", formData);
    alert("Η εγγραφή ολοκληρώθηκε!");
  };

  const getStepContent = (stepIndex) => {
    // ΑΝ ΕΙΝΑΙ ΙΔΙΟΚΤΗΤΗΣ
    if (formData.userType === 'owner') {
      switch (stepIndex) {
        case 0: return <StepCategory formData={formData} setFormData={setFormData} />;
        case 1: return <StepPersonalDetails formData={formData} setFormData={setFormData} />;
        case 2: return <StepPassword formData={formData} setFormData={setFormData} />;
        case 3: return <StepConfirmation formData={formData} />;
        case 4: return <StepSummary />;
        default: return 'Άγνωστο';
      }
    } 
    // ΑΝ ΕΙΝΑΙ ΚΤΗΝΙΑΤΡΟΣ
    else {
      switch (stepIndex) {
        case 0: return <StepCategory formData={formData} setFormData={setFormData} />;
        case 1: return <StepPersonalDetails formData={formData} setFormData={setFormData} />; // Κοινά στοιχεία (Δνση, Τηλ)
        case 2: return <StepVetProfessional formData={formData} setFormData={setFormData} />; // <-- ΤΟ ΝΕΟ ΒΗΜΑ
        case 3: return <StepPassword formData={formData} setFormData={setFormData} />;
        case 4: return <StepConfirmation formData={formData} />;
        case 5: return <StepSummary />;
        default: return 'Άγνωστο';
      }
    }
  };

  return (
    // Αυξήσαμε το maxWidth για να χωράνε άνετα δίπλα-δίπλα
    <Paper sx={{ p: 4, maxWidth: 1100, margin: '40px auto', minHeight: '600px' }}>
      
      <Typography variant="h4" align="center" sx={{ mb: 5, fontWeight: 'bold', color: '#373721' }}>
        Εγγραφή
      </Typography>

      {/* --- GRID LAYOUT: ΑΡΙΣΤΕΡΑ STEPPER - ΔΕΞΙΑ CONTENT --- */}
      <Grid container spacing={4}>
        
        {/* ΑΡΙΣΤΕΡΗ ΣΤΗΛΗ (STEPPER) */}
        {/* xs=12 (κινητά: όλο το πλάτος) | md=3 (pc: το 1/4 της οθόνης) */}
        <Grid item xs={12} md={3} sx={{ borderRight: { md: '1px solid #e0e0e0' } }}>
          <Stepper activeStep={activeStep} orientation="vertical">
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Grid>

        {/* ΔΕΞΙΑ ΣΤΗΛΗ (ΦΟΡΜΑ & ΚΟΥΜΠΙΑ) */}
        {/* md=9 (pc: τα 3/4 της οθόνης) */}
        <Grid item xs={12} md={9}>
          <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
            
            {/* 1. ΠΕΡΙΕΧΟΜΕΝΟ ΦΟΡΜΑΣ */}
            <Box sx={{ p: 2, minHeight: '300px' }}>
              {getStepContent(activeStep)}
            </Box>

            {/* 2. ΚΟΥΜΠΙΑ ΠΛΟΗΓΗΣΗΣ */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 5, pt: 2, borderTop: '1px solid #f0f0f0' }}>
              <Button
                disabled={activeStep === 0}
                onClick={handleBack}
                sx={{ color: '#555', px: 3 }}
              >
                Πίσω
              </Button>

              {activeStep === steps.length - 1 ? (
                <Button variant="contained" color="success" onClick={handleSubmit} sx={{ px: 4, py: 1 }}>
                  Ολοκλήρωση Εγγραφής
                </Button>
              ) : (
                <Button 
                  variant="contained" 
                  onClick={handleNext} 
                  sx={{ backgroundColor: '#F1D77A', color: 'black', fontWeight: 'bold', px: 4, py: 1 }}
                >
                  Επόμενο
                </Button>
              )}
            </Box>
          </Box>
        </Grid>

      </Grid>
    </Paper>
  );
}