import React, { useState, useEffect} from 'react';
import { Collapse } from "@mui/material";
import { SwitchTransition } from "react-transition-group";
import UniversalButton from '../components/UniversalButton';
import { Stepper, Step, StepLabel, Button, Typography, Box, Paper, TextField, Grid, Divider, MenuItem, Autocomplete } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';


// ==============================================
// SUB-COMPONENTS (ΤΟ ΠΕΡΙΕΧΟΜΕΝΟ ΤΩΝ ΒΗΜΑΤΩΝ)
// ==============================================

const greekUniversities = [
  { name: "Εθνικό και Καποδιστριακό Πανεπιστήμιο Αθηνών", acronym: "ΕΚΠΑ" },
  { name: "Αριστοτέλειο Πανεπιστήμιο Θεσσαλονίκης", acronym: "ΑΠΘ" },
  { name: "Πανεπιστήμιο Πατρών", acronym: "ΠΑΤΡΑ" },
  { name: "Πανεπιστήμιο Κρήτης", acronym: "ΠΚ" },
  { name: "Οικονομικό Πανεπιστήμιο Αθηνών", acronym: "ΟΠΑ" },
  { name: "Πανεπιστήμιο Ιωαννίνων", acronym: "ΠΙ" },
  { name: "Πανεπιστήμιο Μακεδονίας", acronym: "ΠΑΜΑΚ" },
  { name: "Δημοκρίτειο Πανεπιστήμιο Θράκης", acronym: "ΔΠΘ" },
  { name: "Πανεπιστήμιο Δυτικής Αττικής", acronym: "ΠΑΔΑ" },
  { name: "Πανεπιστήμιο Θεσσαλίας", acronym: "ΠΘ" },
  { name: "University of Nicosia", acronym: "UNIC" },
  { name: "European University Cyprus", acronym: "EUC" },
];

// Επιλογή Ρόλου Ιδιοκτήτη ή Κτηνιάτρου
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

// Εμφάνιση Βήματος Επιλογής Κατηγορίας Χρήστη
const StepCategory = ({ formData, onSelectUserType }) => (
 <Box sx={{ textAlign: "center", mt: 3 }}>
    <Typography variant="h6">Επιλέξτε την ιδιότητά σας</Typography>
    <Box sx={{ display: "flex", justifyContent: "center", gap: 3, mt: 3 }}>
      <RoleOption
        label="Ιδιοκτήτης Ζώου"
        selected={formData.userType === "owner"}
        onClick={() => onSelectUserType("owner")}
      />
      <RoleOption
        label="Κτηνίατρος"
        selected={formData.userType === "vet"}
        onClick={() => onSelectUserType("vet")}
      />
    </Box>
  </Box>
);


const StepPersonalDetails = ({ formData, updateField, errors }) => (
  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
     {/* Α. ΠΡΟΣΩΠΙΚΑ ΣΤΟΙΧΕΙΑ */}
    {(
      <Box>
        <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#9a9b6a', mb: 2 }}>Προσωπικά στοιχεία</Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField 
              fullWidth label="Όνομα" variant="outlined" size="small"
              value={formData.personal.name} onChange={(e) => updateField("personal", "name", e.target.value)}
              error={!!errors["personal.name"]}
              helperText={errors["personal.name"]}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField 
              fullWidth label="Επώνυμο" variant="outlined" size="small"
              value={formData.personal.surname} onChange={(e) => updateField("personal", "surname", e.target.value)}
              error={!!errors["personal.surname"]}
              helperText={errors["personal.surname"]}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField 
              fullWidth label="ΑΦΜ" variant="outlined" size="small"
              value={formData.personal.afm} onChange={(e) => updateField("personal", "afm", e.target.value)}
              error={!!errors["personal.afm"]}
              helperText={errors["personal.afm"]}
            />
          </Grid>
        </Grid>
      </Box>
    )}
    {/* Β. ΣΤΟΙΧΕΙΑ ΚΑΤΟΙΚΙΑΣ */}
    <Box>
      <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#9a9b6a', mb: 2 }}>Στοιχεία Κατοικίας</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField 
            fullWidth label="Διεύθυνση" variant="outlined" size="small"
            value={formData.address.street} onChange={(e) => updateField("address", "street", e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField 
            fullWidth label="Πόλη" variant="outlined" size="small"
            value={formData.address.city} onChange={(e) => updateField("address", "city", e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
            <TextField 
              fullWidth label="Τ.Κ." variant="outlined" size="small"
              value={formData.address.postalCode} onChange={(e) => updateField("address", "postalCode", e.target.value)}
              error={!!errors["address.postalCode"]}
              helperText={errors["address.postalCode"]}
            />
        </Grid>
      </Grid>
    </Box>
    <Divider />
    {/* Γ. ΣΤΟΙΧΕΙΑ ΕΠΙΚΟΙΝΩΝΙΑΣ */}
    <Box>
      <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#9a9b6a', mb: 2 }}>Στοιχεία Επικοινωνίας</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField 
            fullWidth label="Email" variant="outlined" size="small"
            value={formData.contact.email} onChange={(e) => updateField("contact", "email", e.target.value)}
            error={!!errors["contact.email"]}
            helperText={errors["contact.email"]}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField 
            fullWidth label="Τηλέφωνο" variant="outlined" size="small"
            value={formData.contact.phone} onChange={(e) => updateField("contact", "phone", e.target.value)}
            error={!!errors["contact.phone"]}
            helperText={errors["contact.phone"]}
          />
        </Grid>
      </Grid>
    </Box>
  </Box>
);

// Στοιχεία του Κτηνιάτρου
const StepVetProfessional = ({ formData, updateField, errors }) => (
  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>

    {/* Α. ΠΛΗΡΟΦΟΡΙΕΣ ΕΜΠΕΙΡΙΑΣ */}
    <Box>
      <Typography variant="h6" sx={{ color: '#9a9b6a', fontWeight: 'bold', mb: 2 }}>
        Πληροφορίες εμπειρίας
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Autocomplete
            options={greekUniversities}
            getOptionLabel={(option) => `${option.name} (${option.acronym})`}
            value={greekUniversities.find(u => u.name === formData.vet.degreeInst) || null}
            onChange={(event, newValue) => {
              updateField("vet", "degreeInst", newValue ? newValue.name : "");
            }}
            renderInput={(params) => (
              <TextField
                fullWidth
                sx = {{ minWidth: "35vh" }}
                {...params}
                label="Ίδρυμα Προπτυχιακού Πτυχίου"
                size="small"
                error={!!errors["vet.degreeInst"]}
                helperText={errors["vet.degreeInst"]}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField fullWidth label="Αριθμός Μητρώου Π.Κ.Σ." size="small" 
            value={formData.vet.registryNum} onChange={(e) => updateField("vet", "registryNum", e.target.value)} 
            FormHelperTextProps={{ sx: { color: 'red' } }} 
            error={!!errors["vet.registryNum"]}
            helperText={errors["vet.registryNum"]}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            select
            size = "small"
            label="Χρόνια εμπειρίας"
            value={formData.vet.practiceYears}
            onChange={(e) =>
              updateField("vet", "practiceYears", Number(e.target.value))
            }
            error={!!errors["vet.practiceYears"]}
            helperText={errors["vet.practiceYears"]}
            sx={{
                minWidth: 260,
            }}
          >
            <MenuItem key="0" value="0">0 (Καθόλου εμπειρία)</MenuItem>
            {Array.from({ length: 60 }, (_, i) => (
              <MenuItem key={i+1} value={i+1}>
                {i+1}
              </MenuItem>
            ))}
          </TextField>
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
            value={formData.vet.clinicAddress} onChange={(e) => updateField("vet", "clinicAddress", e.target.value)} 
            error ={!!errors["vet.clinicAddress"]}
            helperText={errors["vet.clinicAddress"]}/>
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField fullWidth label="Τ.Κ." size="small" 
            value={formData.vet.clinicZip} onChange={(e) => updateField("vet", "clinicZip", e.target.value)} 
            error ={!!errors["vet.clinicZip"]}
            helperText={errors["vet.clinicZip"]}/>
        </Grid>
        <Grid item xs={12}>
          <TextField fullWidth label="Πόλη" size="small" 
            value={formData.vet.clinicCity} onChange={(e) => updateField("vet", "clinicCity", e.target.value)} 
            error ={!!errors["vet.clinicCity"]}
            helperText={errors["vet.clinicCity"]}/>
        </Grid>
      </Grid>
    </Box>
  </Box>
);

const StepPassword = ({ formData, updateField, errors }) => (
  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxWidth: '400px', margin: 'auto' }}>
    <Typography align="center" sx={{ mb: 2 }}>Ορίστε έναν ασφαλή κωδικό πρόσβασης.</Typography>
    <TextField 
      fullWidth type="password" label="Κωδικός" 
      value={formData.auth.password} onChange={(e) => updateField("auth", "password", e.target.value)}
      error={!!errors["auth.password"]}
      helperText={errors["auth.password"]}
    />
    <TextField 
      fullWidth type="password" label="Επιβεβαίωση Κωδικού" 
      value={formData.auth.confirmPassword} onChange={(e) => updateField("auth", "confirmPassword", e.target.value)}
      error={!!errors["auth.confirmPassword"]}
      helperText={errors["auth.confirmPassword"]}
    />
  </Box>
);

const StepConfirmation = ({ formData }) => (
  <Box>
    <Typography variant="h6" gutterBottom>Παρακαλώ ελέγξτε τα στοιχεία σας:</Typography>
    <Paper elevation={0} sx={{ bgcolor: '#f5f5f5', p: 3, borderRadius: 2 }}>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0, lineHeight: '2' }}>
        <li><strong>Τύπος:</strong> {formData.userType === 'owner' ? 'Ιδιοκτήτης' : 'Κτηνίατρος'}</li>
        <li><strong>Όνομα:</strong> {formData.personal.name}</li>
        <li><strong>Επώνυμο:</strong> {formData.personal.surname}</li>
        <li><strong>Email:</strong> {formData.contact.email}</li>
        <li><strong>Τηλέφωνο:</strong> {formData.contact.phone}</li>
        <li><strong>Διεύθυνση:</strong> {formData.address.street}, {formData.address.city} {formData.address.postalCode} </li>
        {formData.userType === 'vet' && (
          <>
            <li><strong>Ίδρυμα Πτυχίου:</strong> {formData.vet.degreeInst}</li>
            <li><strong>Αριθμός Μητρώου Π.Κ.Σ.:</strong> {formData.vet.registryNum}</li>
            <li><strong>Χρόνια Εμπειρίας:</strong> {formData.vet.practiceYears}</li>
            <li><strong>Διεύθυνση Ιατρείου:</strong> {formData.vet.clinicAddress}, {formData.vet.clinicCity} {formData.vet.clinicZip}</li>
          </>
        )}
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

  const { signup } = useAuth();
  // State Δεδομένων
  const [formData, setFormData] = useState({
    userType: "owner",

    personal: {
      name: "",
      surname: "",
      afm: ""
    },

    address: {
      street: "",
      city: "",
      postalCode: ""
    },

    contact: {
      email: "",
      phone: ""
    },

    vet: {
      degreeInst: "",
      masterInst: "",
      phdInst: "",
      specialization: ["Γενική Κτηνιατρική"],
      registryNum: "",
      practiceYears: "",
      clinicAddress: "",
      clinicZip: "",
      clinicCity: ""
    },

    auth: {
      password: "",
      confirmPassword: ""
    }
  });

  //helper function to update nested form data
  const updateField = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleSelectUserType = (type) => {
  setFormData(prev => ({
    ...prev,
    userType: type
  }));

  setActiveStep(1); // ⬅️ πάει κατευθείαν στο επόμενο step
};


  const [errors, setErrors] = useState({});

  useEffect(() => {
    setErrors({});
  }, [activeStep]);


  const validatePersonalDetails = () => {
    const newErrors = {};

    if (!formData.personal.name.trim())
      newErrors["personal.name"] = "Το όνομα είναι υποχρεωτικό";

    if (!formData.personal.surname.trim())
      newErrors["personal.surname"] = "Το επώνυμο είναι υποχρεωτικό";

    if (!formData.personal.afm.trim())
      newErrors["personal.afm"] = "Ο ΑΦΜ είναι υποχρεωτικός";
    else if (!/^\d+$/.test(formData.personal.afm)) {
      newErrors["personal.afm"] = "Ο ΑΦΜ πρέπει να περιέχει μόνο αριθμούς";
    }else if (formData.personal.afm.length !== 9) {
      newErrors["personal.afm"] = "Ο ΑΦΜ πρέπει να έχει 9 ψηφία";
    }

    if (!formData.contact.email)
      newErrors["contact.email"] = "Το email είναι υποχρεωτικό";
    else if (!/\S+@\S+\.\S+/.test(formData.contact.email))
      newErrors["contact.email"] = "Μη έγκυρο email";

    if (!formData.contact.phone)
      newErrors["contact.phone"] = "Το τηλέφωνο είναι υποχρεωτικό";
    else if (!/^\d+$/.test(formData.contact.phone)) {
      newErrors["contact.phone"] = "Το τηλέφωνο πρέπει να περιέχει μόνο αριθμούς";
    }else if (formData.contact.phone.length !== 10) {
      newErrors["contact.phone"] = "Το τηλέφωνο πρέπει να έχει 10 ψηφία";
    }
    
    if (!formData.address.postalCode)
      newErrors["address.postalCode"] = "Ο Τ.Κ. είναι υποχρεωτικός";
    else if (!/^\d+$/.test(formData.address.postalCode)) {
      newErrors["address.postalCode"] = "Ο Τ.Κ. πρέπει να περιέχει μόνο αριθμούς";
    }else if (formData.address.postalCode.length !== 5) {
      newErrors["address.postalCode"] = "Ο Τ.Κ. πρέπει να έχει 5 ψηφία";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePassword = () => {
    const newErrors = {};

    if (formData.auth.password.length < 8)
      newErrors["auth.password"] = "Τουλάχιστον 8 χαρακτήρες";

    if (formData.auth.password !== formData.auth.confirmPassword)
      newErrors["auth.confirmPassword"] = "Οι κωδικοί δεν ταιριάζουν";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateVetDetails = () => {
    if (formData.userType !== "vet") return true;

    const newErrors = {};

    if (!formData.vet.degreeInst)
      newErrors["vet.degreeInst"] = "Υποχρεωτικό";

    if (!formData.vet.registryNum)
      newErrors["vet.registryNum"] = "Υποχρεωτικό";
    else if (!/^\d+$/.test(formData.vet.registryNum)) {
      newErrors["vet.registryNum"] = "Πρέπει να περιέχει μόνο αριθμούς";
    }else if (formData.vet.registryNum.length < 4 || formData.vet.registryNum.length > 6) {
      newErrors["vet.registryNum"] = "Πρέπει να έχει από 4 έως 6 ψηφία";
    }

    if (!formData.vet.clinicAddress)
      newErrors["vet.clinicAddress"] = "Η διεύθυνση ιατρείου είναι υποχρεωτική";

    if (!formData.vet.clinicZip)
      newErrors["vet.clinicZip"] = "Ο Τ.Κ. ιατρείου είναι υποχρεωτικός";
    else if (!/^\d+$/.test(formData.vet.clinicZip)) {
      newErrors["vet.clinicZip"] = "Ο Τ.Κ. πρέπει να περιέχει μόνο αριθμούς";
    }
    else if (formData.vet.clinicZip.length !== 5) {
      newErrors["vet.clinicZip"] = "Ο Τ.Κ. πρέπει να έχει 5 ψηφία";
    }

    if(formData.vet.practiceYears === "")
      newErrors["vet.practiceYears"] = "Τα χρόνια εμπειρίας είναι υποχρεωτικά";
    else if (isNaN(formData.vet.practiceYears) || formData.vet.practiceYears < 0 || formData.vet.practiceYears > 60) {
      newErrors["vet.practiceYears"]
        = "Τα χρόνια εμπειρίας πρέπει να είναι αριθμός από 0 έως 60";
    }

    
    if (!formData.vet.clinicCity)
      newErrors["vet.clinicCity"] = "Η πόλη ιατρείου είναι υποχρεωτική";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };



  const handleNext = () => {
    let isValid = true;

    if (activeStep === 1) isValid = validatePersonalDetails();

    if (formData.userType === "vet" && activeStep === 2)
      isValid = validateVetDetails();

    if (
      (formData.userType === "owner" && activeStep === 2) ||
      (formData.userType === "vet" && activeStep === 3)
    )
      isValid = validatePassword();

    if (isValid) setActiveStep(prev => prev + 1);
  };

  const handleBack = () => setActiveStep((prev) => prev - 1);
  
  const handleSubmit = async () => {
  try {
    await signup(formData);   
    navigate("/");            
  } catch (e) {
    alert(e.message || "Κάτι πήγε στραβά");
  }
};

  const getStepContent = (stepIndex) => {
    if (formData.userType === 'owner') {
      switch (stepIndex) {
        case 0: return <StepCategory formData={formData} onSelectUserType={handleSelectUserType} />;
        case 1: return <StepPersonalDetails formData={formData} updateField={updateField} errors={errors} />;
        case 2: return <StepPassword formData={formData} updateField={updateField} errors={errors} />;
        case 3: return <StepConfirmation formData={formData} />;
        case 4: return <StepSummary />;
        default: return 'Άγνωστο';
      }
    } 
    else {
      switch (stepIndex) {
        case 0: return <StepCategory formData={formData} onSelectUserType={handleSelectUserType} />;
        case 1: return <StepPersonalDetails formData={formData} updateField={updateField} errors={errors} />;
        case 2: return <StepVetProfessional formData={formData} updateField={updateField} errors={errors} />;
        case 3: return <StepPassword formData={formData} updateField={updateField} errors={errors} />;
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
        <Box sx={{ position: "absolute", top: 16, left: 16 }}>
            <UniversalButton 
                text="Αρχική" 
                path="/"
                bgColor="#aac95cff"
                textColor='#000000ff'
            />
        </Box>
        <Box sx={{ position: "absolute", top: 16, right: 16 }}>
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
                        "Σύνοψη",
                        "Ολοκλήρωση",
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
                    {activeStep !== 0 && (
                    <>
                      <Button
                        onClick={handleBack}
                        sx={{
                          color: "#000000ff",
                          outline: "solid 1px #000000ff",
                          px: 4,
                        }}
                      >
                        ΠΙΣΩ
                      </Button>

                      {(activeStep === 4 && formData.userType === 'owner') ||
                      (activeStep === 5 && formData.userType === 'vet') ? (
                        <Button
                          variant="contained"
                          color="success"
                          onClick={handleSubmit}
                          sx={{ px: 4, py: 1, fontWeight: "bold" }}
                        >
                          ΟΛΟΚΛΗΡΩΣΗ
                        </Button>
                      ) : (
                        <Button
                          variant="contained"
                          onClick={handleNext}
                          sx={{ px: 4, py: 1, fontWeight: "bold" }}
                        >
                          ΕΠΟΜΕΝΟ
                        </Button>
                      )}
                    </>
                  )}
                </Box>
                </Grid>
            </Grid>
        </Paper>
    </Box>
  );
}


