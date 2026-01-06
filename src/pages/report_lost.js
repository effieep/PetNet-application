import React, { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { Collapse, Divider } from "@mui/material";
import { SwitchTransition } from "react-transition-group";
import UniversalButton from "../components/UniversalButton";
import {
  Stepper,
  Step,
  StepLabel,
  Button,
  Typography,
  Box,
  Paper,
  TextField,
  Grid,
  MenuItem,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

// ==============================================
// SUB-COMPONENTS (ΤΟ ΠΕΡΙΕΧΟΜΕΝΟ ΤΩΝ ΒΗΜΑΤΩΝ)
// ==============================================

const StepPetDetails = ({ formData, updateField, errors }) => (
  <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
    <Box>
      <Typography variant="h6" sx={{ fontWeight: "bold", color: "#9a9b6a", mb: 2 }}>
        Στοιχεία Ζώου
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Αρ. Microchip"
            variant="outlined"
            size="small"
            value={formData.pet.microchip}
            onChange={(e) => updateField("pet", "microchip", e.target.value)}
            error={!!errors["pet.microchip"]}
            helperText={errors["pet.microchip"]}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            select
            fullWidth
            label="Είδος"
            variant="outlined"
            size="small"
            value={formData.pet.species}
            onChange={(e) => updateField("pet", "species", e.target.value)}
            error={!!errors["pet.species"]}
            helperText={errors["pet.species"]}
          >
            <MenuItem value="">-</MenuItem>
            <MenuItem value="dog">Σκύλος</MenuItem>
            <MenuItem value="cat">Γάτα</MenuItem>
            <MenuItem value="rabbit">Κουνέλι</MenuItem>
            <MenuItem value="hamster">Χάμστερ</MenuItem>
          </TextField>
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Φυλή"
            variant="outlined"
            size="small"
            value={formData.pet.breed}
            onChange={(e) => updateField("pet", "breed", e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            select
            fullWidth
            label="Φύλο"
            variant="outlined"
            size="small"
            value={formData.pet.sex}
            onChange={(e) => updateField("pet", "sex", e.target.value)}
          >
            <MenuItem value="">-</MenuItem>
            <MenuItem value="male">Αρσενικό</MenuItem>
            <MenuItem value="female">Θηλυκό</MenuItem>
          </TextField>
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Χρώμα"
            variant="outlined"
            size="small"
            value={formData.pet.color}
            onChange={(e) => updateField("pet", "color", e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            select
            fullWidth
            label="Μέγεθος"
            variant="outlined"
            size="small"
            value={formData.pet.size}
            onChange={(e) => updateField("pet", "size", e.target.value)}
          >
            <MenuItem value="">-</MenuItem>
            <MenuItem value="small">Μικρό</MenuItem>
            <MenuItem value="medium">Μεσαίο</MenuItem>
            <MenuItem value="large">Μεγάλο</MenuItem>
          </TextField>
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Ιδιαίτερα χαρακτηριστικά"
            variant="outlined"
            size="small"
            value={formData.pet.features}
            onChange={(e) => updateField("pet", "features", e.target.value)}
          />
        </Grid>
      </Grid>
    </Box>

    <Divider />

    <Box>
      <Typography variant="h6" sx={{ fontWeight: "bold", color: "#9a9b6a", mb: 2 }}>
        Φωτογραφία
      </Typography>
      <Typography sx={{ fontSize: 13, opacity: 0.8, mb: 1 }}>
        (Placeholder) Αργότερα θα συνδεθεί με upload / db.
      </Typography>
      <TextField fullWidth label="URL/όνομα αρχείου" variant="outlined" size="small" value={formData.pet.photo} onChange={(e) => updateField("pet", "photo", e.target.value)} />
    </Box>
  </Box>
);

const StepLossDetails = ({ formData, updateField, errors }) => (
  <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
    <Box>
      <Typography variant="h6" sx={{ fontWeight: "bold", color: "#9a9b6a", mb: 2 }}>
        Στοιχεία Απώλειας
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Ημερομηνία απώλειας"
            type="date"
            variant="outlined"
            size="small"
            InputLabelProps={{ shrink: true }}
            value={formData.loss.date}
            onChange={(e) => updateField("loss", "date", e.target.value)}
            error={!!errors["loss.date"]}
            helperText={errors["loss.date"]}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Ώρα"
            type="time"
            variant="outlined"
            size="small"
            InputLabelProps={{ shrink: true }}
            value={formData.loss.time}
            onChange={(e) => updateField("loss", "time", e.target.value)}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Περιοχή που χάθηκε"
            variant="outlined"
            size="small"
            value={formData.loss.area}
            onChange={(e) => updateField("loss", "area", e.target.value)}
            error={!!errors["loss.area"]}
            helperText={errors["loss.area"]}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            multiline
            minRows={3}
            label="Επιπλέον πληροφορίες"
            variant="outlined"
            size="small"
            value={formData.loss.notes}
            onChange={(e) => updateField("loss", "notes", e.target.value)}
          />
        </Grid>
      </Grid>
    </Box>
  </Box>
);

const StepContactDetails = ({ formData, updateField, errors }) => (
  <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
    <Box>
      <Typography variant="h6" sx={{ fontWeight: "bold", color: "#9a9b6a", mb: 2 }}>
        Στοιχεία Επικοινωνίας
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Όνομα επικοινωνίας"
            variant="outlined"
            size="small"
            value={formData.contact.name}
            onChange={(e) => updateField("contact", "name", e.target.value)}
            error={!!errors["contact.name"]}
            helperText={errors["contact.name"]}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Τηλέφωνο"
            variant="outlined"
            size="small"
            value={formData.contact.phone}
            onChange={(e) => updateField("contact", "phone", e.target.value)}
            error={!!errors["contact.phone"]}
            helperText={errors["contact.phone"]}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Email"
            variant="outlined"
            size="small"
            value={formData.contact.email}
            onChange={(e) => updateField("contact", "email", e.target.value)}
            error={!!errors["contact.email"]}
            helperText={errors["contact.email"]}
          />
        </Grid>
      </Grid>
    </Box>
  </Box>
);

const StepConfirmation = ({ formData }) => (
  <Box>
    <Typography variant="h6" gutterBottom>
      Παρακαλώ ελέγξτε τα στοιχεία σας:
    </Typography>
    <Box sx={{ bgcolor: "#f5f5f5", p: 3, borderRadius: 2 }}>
      <ul style={{ listStyle: "none", padding: 0, margin: 0, lineHeight: "2" }}>
        <li>
          <strong>Microchip:</strong> {formData.pet.microchip}
        </li>
        <li>
          <strong>Είδος:</strong> {formData.pet.species}
        </li>
        <li>
          <strong>Περιοχή απώλειας:</strong> {formData.loss.area}
        </li>
        <li>
          <strong>Ημερομηνία:</strong> {formData.loss.date}
        </li>
        <li>
          <strong>Τηλέφωνο:</strong> {formData.contact.phone}
        </li>
        <li>
          <strong>Email:</strong> {formData.contact.email}
        </li>
      </ul>
    </Box>
  </Box>
);

const StepSummary = () => (
  <Box sx={{ textAlign: "center", py: 5 }}>
    <Typography variant="h5" color="success.main" gutterBottom>
      Έτοιμο!
    </Typography>
    <Typography>
      (Placeholder) Η δήλωση απώλειας θα αποθηκευτεί όταν συνδέσουμε τη βάση.
    </Typography>
  </Box>
);

// ==============================================
// ΚΥΡΙΟ COMPONENT (PARENT)
// ==============================================

export default function ReportLostStepper() {
  const [activeStep, setActiveStep] = useState(0);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();

  const [formData, setFormData] = useState({
    pet: {
      microchip: "",
      species: "",
      breed: "",
      sex: "",
      color: "",
      size: "",
      features: "",
      photo: "",
    },
    loss: {
      date: "",
      time: "",
      area: "",
      notes: "",
    },
    contact: {
      name: "",
      phone: "",
      email: "",
    },
  });

  useEffect(() => {
    setErrors({});
  }, [activeStep]);

  const updateField = (section, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const validateStep = () => {
    const newErrors = {};

    if (activeStep === 0) {
      if (!formData.pet.microchip.trim()) newErrors["pet.microchip"] = "Υποχρεωτικό";
      if (!formData.pet.species) newErrors["pet.species"] = "Υποχρεωτικό";
    }

    if (activeStep === 1) {
      if (!formData.loss.date) newErrors["loss.date"] = "Υποχρεωτικό";
      if (!formData.loss.area.trim()) newErrors["loss.area"] = "Υποχρεωτικό";
    }

    if (activeStep === 2) {
      if (!formData.contact.name.trim()) newErrors["contact.name"] = "Υποχρεωτικό";
      if (!formData.contact.phone.trim()) newErrors["contact.phone"] = "Υποχρεωτικό";
      if (!formData.contact.email.trim()) newErrors["contact.email"] = "Υποχρεωτικό";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    const ok = validateStep();
    if (ok) setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => setActiveStep((prev) => prev - 1);

  const handleSubmit = async () => {
    // Placeholder: later connect to db/api
    // eslint-disable-next-line no-console
    console.log("Lost report submit (placeholder)", formData);
    setActiveStep((prev) => prev + 1);
  };

  const getStepContent = (stepIndex) => {
    switch (stepIndex) {
      case 0:
        return <StepPetDetails formData={formData} updateField={updateField} errors={errors} />;
      case 1:
        return <StepLossDetails formData={formData} updateField={updateField} errors={errors} />;
      case 2:
        return <StepContactDetails formData={formData} updateField={updateField} errors={errors} />;
      case 3:
        return <StepConfirmation formData={formData} />;
      case 4:
        return <StepSummary />;
      default:
        return "Άγνωστο";
    }
  };

  const steps = ["Στοιχεία Ζώου", "Στοιχεία Απώλειας", "Επικοινωνία", "Σύνοψη", "Ολοκλήρωση"];

  const isDone = activeStep >= steps.length - 1;
  const isConfirmStep = activeStep === steps.length - 2;

  if (!isLoggedIn)
  {
    return (
      <>
          <Typography variant="h6" color= "error" textAlign="center" sx={{ mt: "15%", fontWeight: "bold" }}>
            Απαιτείται σύνδεση για να κάνετε δήλωση απώλειας κατοικιδίου.
          </Typography>
      </>
    );
  }

  return (
    
    <Box
      sx={{
        // minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
        px: 2,
      }}
    >

      <Paper
        sx={{
          p: 4,
          maxWidth: 1100,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Typography variant="h4" align="center" sx={{ mb: 4, fontWeight: "bold", color: "#373721" }}>
          Δήλωση Απώλειας
        </Typography>

        <Grid container spacing={4} sx={{ flexGrow: 1 }}>
          <Grid item xs={12} md={3} sx={{ borderRight: { md: "1px solid #e0e0e0" }, pr: { md: 2 } }}>
            <Stepper
              activeStep={activeStep}
              orientation="vertical"
              sx={{
                "& .MuiStepIcon-root": {
                  transition: "all 250ms ease-out",
                },
                "& .MuiStepLabel-label": {
                  transition: "color 250ms ease-out, font-weight 250ms ease-out, transform 250ms ease-out",
                },
                "& .MuiStepLabel-label.Mui-active": {
                  fontWeight: 700,
                  transform: "translateX(2px)",
                },
                "& .MuiStepLabel-label.Mui-completed": {
                  opacity: 0.85,
                },
                "& .MuiStepConnector-line": {
                  transition: "border-color 250ms ease-out",
                },
              }}
            >
              {steps.map((label) => (
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
            <Box sx={{ width: "100%", px: 2, pt: 2 }}>
              <SwitchTransition mode="out-in">
                <Collapse key={activeStep} in timeout={300} easing={{ enter: "ease-out", exit: "ease-in" }}>
                  <Box sx={{ width: "100%", maxWidth: 520 }}>{getStepContent(activeStep)}</Box>
                </Collapse>
              </SwitchTransition>
            </Box>

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
              )}

              {isDone ? (
                <Button
                  variant="contained"
                  color="success"
                  onClick={() => navigate("/lost-found")}
                  sx={{ px: 4, py: 1, fontWeight: "bold", ml: "auto" }}
                >
                  ΕΠΙΣΤΡΟΦΗ
                </Button>
              ) : isConfirmStep ? (
                <Button variant="contained" color="success" onClick={handleSubmit} sx={{ px: 4, py: 1, fontWeight: "bold", ml: "auto" }}>
                  ΟΛΟΚΛΗΡΩΣΗ
                </Button>
              ) : (
                <Button variant="contained" onClick={handleNext} sx={{ px: 4, py: 1, fontWeight: "bold", ml: "auto" }}>
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
