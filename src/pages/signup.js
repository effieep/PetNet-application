import React, { useState } from 'react';
import { Collapse } from "@mui/material";
import { SwitchTransition } from "react-transition-group";
import UniversalButton from '../components/UniversalButton';
import { Stepper, Step, StepLabel, Button, Typography, Box, Paper, TextField, Grid, Divider } from '@mui/material';
import { useNavigate } from 'react-router-dom';

// ==============================================
// SUB-COMPONENTS (ΤΟ ΠΕΡΙΕΧΟΜΕΝΟ ΤΩΝ ΒΗΜΑΤΩΝ)
// ==============================================

const RoleOption = ({ label, selected, onClick }) => (
  <Box
    onClick={onClick}
    sx={{
      px: 4,
      py: 2,
      borderRadius: 2,
      border: "2px solid",
      borderColor: selected ? "#7a7b4a" : "#ddd",
      cursor: "pointer",
      fontWeight: 600,
      bgcolor: selected ? "rgba(122,123,74,0.1)" : "transparent",
      transform: selected ? "scale(1.05)" : "scale(1)",
      transition: "all 0.3s ease",
      "&:hover": {
        borderColor: "#7a7b4a",
      },
    }}
  >
    {label}
  </Box>
);

const StepCategory = ({ formData, setFormData }) => (
  <Box sx={{ textAlign: "center", mt: 3 }}>
    <Typography variant="h6">Επιλέξτε την ιδιότητά σας</Typography>
    <Box sx={{ display: "flex", justifyContent: "center", gap: 3, mt: 3 }}>
      <RoleOption
        label="Ιδιοκτήτης Ζώου"
        selected={formData.userType === "owner"}
        onClick={() => setFormData({ ...formData, userType: "owner" })}
      />
      <RoleOption
        label="Κτηνίατρος"
        selected={formData.userType === "vet"}
        onClick={() => setFormData({ ...formData, userType: "vet" })}
      />
    </Box>
  </Box>
);

const StepPersonalDetails = ({ formData, setFormData }) => (
  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
     {/* Γ. ΠΡΟΣΩΠΙΚΑ ΣΤΟΙΧΕΙΑ */}
    {(
      <Box>
        <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#9a9b6a', mb: 2 }}>Προσωπικά στοιχεία</Typography>
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
      <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#9a9b6a', mb: 2 }}>Στοιχεία Κατοικίας</Typography>
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
      <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#9a9b6a', mb: 2 }}>Στοιχεία Επικοινωνίας</Typography>
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
  </Box>
);

// Στοιχεία του Κτηνιάτρου
const StepVetProfessional = ({ formData, setFormData }) => (
  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>

    {/* Α. ΠΛΗΡΟΦΟΡΙΕΣ ΕΜΠΕΙΡΙΑΣ */}
    <Box>
      <Typography variant="h6" sx={{ color: '#9a9b6a', fontWeight: 'bold', mb: 2 }}>
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
      <Typography variant="h6" sx={{ color: '#9a9b6a', fontWeight: 'bold', mb: 2 }}>
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
    else {
      switch (stepIndex) {
        case 0: return <StepCategory formData={formData} setFormData={setFormData} />;
        case 1: return <StepPersonalDetails formData={formData} setFormData={setFormData} />; 
        case 2: return <StepVetProfessional formData={formData} setFormData={setFormData} />; 
        case 3: return <StepPassword formData={formData} setFormData={setFormData} />;
        case 4: return <StepConfirmation formData={formData} />;
        case 5: return <StepSummary />;
        default: return 'Άγνωστο';
      }
    }
  };

  const navigate = useNavigate();
  
  return (
    <Box
        sx={{
            minHeight: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            position: "relative",
            px: 2,
        }}
    >
        <Box sx={{ position: "absolute", top: 16, right: 16 }}>
            <UniversalButton 
                text="Αρχική" 
                path="/"
                bgColor="#aac95cff"
                textColor='#000000ff'
            />
            <Button onClick={() => navigate("/?login=true")}
                sx=
                {{
                backgroundColor: "#5893caff",
                color: "#000000ff",
                textTransform: "none",
                textShadow: 'none',
                fontWeight: 700,
                borderRadius: 15, 
                boxShadow: 'none',

                px: { xs: 3, sm: 4, md: 6 }, 
                py: { xs: 0.5, sm: 1 }, 
                fontSize: { xs: '0.85rem', sm: '0.9rem', md: '1rem' },
                marginRight: 2, 
                whiteSpace: 'nowrap', 

                '&:hover': {
                    backgroundColor: "#7cb1f7ff", 
                    boxShadow: 'grey 0px 2px 5px' 
                }
                }}
                >
                Σύνδεση
            </Button>
        </Box>

        <Paper
            sx={{
            p: 4,
            maxWidth: 1100,
            display: "flex",
            flexDirection: "column",
            }}
        >
            <Typography variant="h4" align="center" sx={{ mb: 4, fontWeight: "bold", color: "#373721" }}>
                Εγγραφή
            </Typography>

            <Grid container spacing={4} sx={{ flexGrow: 1 }}>
                <Grid item xs={12} md={3} sx={{ borderRight: { md: "1px solid #e0e0e0" }, pr: { md: 2 } }}>
                    <Stepper activeStep={activeStep} orientation="vertical"
                    sx={{
                        // icon (circle) smooth
                        "& .MuiStepIcon-root": {
                        transition: "all 250ms ease-out",
                        },

                        // label text smooth
                        "& .MuiStepLabel-label": {
                        transition: "color 250ms ease-out, font-weight 250ms ease-out, transform 250ms ease-out",
                        },

                        // active label “pop” a bit
                        "& .MuiStepLabel-label.Mui-active": {
                        fontWeight: 700,
                        transform: "translateX(2px)",
                        },

                        // completed label style (optional)
                        "& .MuiStepLabel-label.Mui-completed": {
                        opacity: 0.85,
                        },

                        // connector line smooth (vertical line)
                        "& .MuiStepConnector-line": {
                        transition: "border-color 250ms ease-out",
                        },
                    }}
                    >
                        {[
                        "Κατηγορία Χρήστη",
                        "Προσωπικά Στοιχεία",
                        ...(formData.userType === "vet" ? ["Στοιχεία Κτηνιάτρου"] : []),
                        "Κωδικός",
                        "Επιβεβαίωση",
                        "Σύνοψη",
                        ].map((label) => (
                        <Step key={label}>
                            <StepLabel>{label}</StepLabel>
                        </Step>
                        ))}
                    </Stepper>
                </Grid>

                <Grid
                item
                xs={12}
                md={9}
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    flexGrow: 1,
                    alignItems: "center",
                }}
                >
                {/* CONTENT AREA: not vertically centered (less “empty space” feeling) */}
                <Box sx={{ width: "100%", px: 2, pt: 2}}>
                    <SwitchTransition mode="out-in">
                        <Collapse
                        key={activeStep}
                        in
                        timeout={300}
                        easing={{ enter: "ease-out", exit: "ease-in" }}
                        >
                            <Box sx={{ width: "100%", maxWidth: 520 }}>
                                {getStepContent(activeStep)}
                            </Box>
                        </Collapse>
                    </SwitchTransition>
                </Box>

                {/* BUTTONS always at bottom */}
                <Box sx={{ flexGrow: 1 }} />

                <Box
                    sx={{
                    width: "100%",
                    maxWidth: 520,
                    mt: 2,
                    pt: 2,
                    borderTop: "1px solid #f0f0f0",
                    display: "flex",
                    justifyContent: "space-between",
                    px: 2,
                    pb: 1,
                    }}
                >
                    <Button disabled={activeStep === 0} onClick={handleBack} sx={{ color: "#000000ff", outline: "solid 1px #000000ff", px: 4, "&.Mui-disabled": {outline: "none"} }}>
                    ΠΙΣΩ
                    </Button>
                    
                    {(activeStep === 4 && formData.userType === 'owner') || (activeStep === 5 && formData.userType === 'vet') ? (
                    <Button variant="contained" color="success" onClick={handleSubmit} sx={{ px: 4, py: 1, fontWeight: "bold" }}>
                        ΟΛΟΚΛΗΡΩΣΗ
                    </Button>
                    ) : (
                    <Button variant="contained" onClick={handleNext} sx={{ px: 4, py: 1, fontWeight: "bold" }}>
                        ΕΠΟΜΕΝΟ
                    </Button>
                    )}
                </Box>
                </Grid>
            </Grid>
        </Paper>
    </Box>
  );
}