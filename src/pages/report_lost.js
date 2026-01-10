import { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { Collapse, Divider } from "@mui/material";
import { SwitchTransition } from "react-transition-group";
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
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import LoginDialog from "../components/login";
import PetPreviewCard from "../components/PetPreviewCard";
import PetDetailsCard from "../components/PetDetailsCard";
import AddressPicker from "../components/AddressPicker";
import { API_URL } from "../api";

// ==============================================
// SUB-COMPONENTS (ΤΟ ΠΕΡΙΕΧΟΜΕΝΟ ΤΩΝ ΒΗΜΑΤΩΝ)
// ==============================================

const StepLogin = ({ isLoggedIn, onOpenLogin }) => (
  <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
    {!isLoggedIn && (
      <>
        <Typography variant="h6" color="error" textAlign="center" sx={{ fontWeight: "bold" }}>
          Απαιτείται σύνδεση για να κάνετε δήλωση απώλειας κατοικιδίου.
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Button
            variant="contained"
            onClick={onOpenLogin}
            sx={{ px: 4, py: 1, fontWeight: "bold" }}
          >
            Σύνδεση
          </Button>
        </Box>
      </>
    )}
  </Box>
);

const StepSelectPet = ({ pets, loading, selectedPetId, previewPetId, errorText, onSelectPet, onPreviewPet }) => (
  <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
    <Typography variant="h6" sx={{ fontWeight: "bold", color: "#9a9b6a" }}>
      Επιλογή Κατοικιδίου
    </Typography>
    <Typography sx={{ fontSize: 13, opacity: 0.8 }}>
      Επιλέξτε το κατοικίδιο που θέλετε να δηλώσετε ως χαμένο.
    </Typography>

    {errorText && (
      <Typography variant="body2" color="error" sx={{ fontWeight: 700 }}>
        {errorText}
      </Typography>
    )}

    {loading ? (
      <Typography sx={{ opacity: 0.8 }}>Φόρτωση...</Typography>
    ) : pets.length === 0 ? (
      <Typography sx={{ opacity: 0.8 }}>Δεν βρέθηκαν κατοικίδια στο προφίλ σας.</Typography>
    ) : (
      <Box
        sx={{
          display: "flex",
          // Match OwnerPets Grid spacing={3} (24px)
          gap: 3,
          overflowX: "auto",
          pb: 1,
          WebkitOverflowScrolling: "touch",
        }}
      >
        {pets.map((pet) => (
          <Box
            key={pet.id}
            sx={{
              flex: "0 0 auto",
              // Mimic Grid item widths: xs=12, sm=6, md=4 with spacing={3}
              width: {
                xs: "100%",
                sm: "calc((100% - 24px) / 2)",
                md: "calc((100% - 48px) / 3)",
              },
            }}
          >
            <PetPreviewCard
              pet={pet}
              wrapInGrid={false}
              selected={selectedPetId === pet.id}
              onCardClick={() => onSelectPet(pet)}
              onPreview={() => onPreviewPet(pet)}
              cardSx={{
                transition: "transform 150ms ease",
                "&:hover": { transform: "translateY(-1px)" },
              }}
            />
          </Box>
        ))}
      </Box>
    )}

    {previewPetId && (
      <Box sx={{ mt: 2 }}>
        <Divider sx={{ mb: 2 }} />
        <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
          Λεπτομέρειες Κατοικιδίου
        </Typography>
        <PetDetailsCard petId={previewPetId} />
      </Box>
    )}
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
          <AddressPicker
            label="Διεύθυνση / Περιοχή που χάθηκε"
            value={formData.loss.area}
            onChange={(val) => updateField("loss", "area", val)}
            coords={{
              lat: formData.loss.lat,
              lon: formData.loss.lon,
            }}
            onCoordsChange={(c) => {
              updateField("loss", "lat", c.lat);
              updateField("loss", "lon", c.lon);
            }}
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
  const [loginOpen, setLoginOpen] = useState(false);
  const navigate = useNavigate();
  const { user, isLoggedIn } = useAuth();

  const [pets, setPets] = useState([]);
  const [petsLoading, setPetsLoading] = useState(false);
  const [petsError, setPetsError] = useState("");
  const [selectedPetId, setSelectedPetId] = useState(null);
  const [previewPetId, setPreviewPetId] = useState(null);

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
      lat: null,
      lon: null,
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

  useEffect(() => {
    if (activeStep === 0 && isLoggedIn) {
      setLoginOpen(false);
      setActiveStep(1);
    }
    if (activeStep > 0 && !isLoggedIn) {
      setActiveStep(0);
    }
  }, [activeStep, isLoggedIn]);

  useEffect(() => {
    if (!isLoggedIn || !user?.id) {
      setPets([]);
      setPetsError("");
      setPetsLoading(false);
      setSelectedPetId(null);
      setPreviewPetId(null);
      return;
    }

    setPetsLoading(true);
    setPetsError("");
    fetch(`${API_URL}/pets?ownerId=${user.id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Αποτυχία φόρτωσης κατοικιδίων");
        return res.json();
      })
      .then((data) => setPets(Array.isArray(data) ? data : []))
      .catch(() => setPetsError("Δεν ήταν δυνατή η φόρτωση των κατοικιδίων."))
      .finally(() => setPetsLoading(false));
  }, [isLoggedIn, user?.id]);

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

    if (activeStep === 1) {
      if (!selectedPetId) newErrors["pet.selected"] = "Επιλέξτε κατοικίδιο";
    }

    if (activeStep === 2) {
      if (!formData.loss.date) newErrors["loss.date"] = "Υποχρεωτικό";
      if (!formData.loss.area.trim()) newErrors["loss.area"] = "Υποχρεωτικό";
    }

    if (activeStep === 3) {
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

  const handleSelectPet = (pet) => {
    setSelectedPetId(pet.id);
    setPreviewPetId(pet.id);
    setFormData((prev) => ({
      ...prev,
      pet: {
        ...prev.pet,
        microchip: pet.microchip || "",
        species: pet.species || "",
        breed: pet.breed || "",
        sex: pet.gender || "",
        color: pet.color || "",
      },
    }));
  };

  const handlePreviewPet = (pet) => {
    setPreviewPetId(pet.id);
  };

  const getStepContent = (stepIndex) => {
    switch (stepIndex) {
      case 0:
        return <StepLogin isLoggedIn={isLoggedIn} onOpenLogin={() => setLoginOpen(true)} />;
      case 1:
        return (
          <StepSelectPet
            pets={pets}
            loading={petsLoading}
            selectedPetId={selectedPetId}
            previewPetId={previewPetId}
            errorText={errors["pet.selected"] || petsError}
            onSelectPet={handleSelectPet}
            onPreviewPet={handlePreviewPet}
          />
        );
      case 2:
        return <StepLossDetails formData={formData} updateField={updateField} errors={errors} />;
      case 3:
        return <StepContactDetails formData={formData} updateField={updateField} errors={errors} />;
      case 4:
        return <StepConfirmation formData={formData} />;
      case 5:
        return <StepSummary />;
      default:
        return "Άγνωστο";
    }
  };

  const steps = ["Σύνδεση", "Επιλογή Κατοικιδίου", "Στοιχεία Απώλειας", "Επικοινωνία", "Σύνοψη", "Ολοκλήρωση"];

  const isDone = activeStep >= steps.length - 1;
  const isConfirmStep = activeStep === steps.length - 2;

  const isLoginGateStep = activeStep === 0;
  const shouldShowFooterActions = !(isLoginGateStep && !isLoggedIn);

  const layout = (() => {
    // Step 1 (pet selection) needs room for horizontal cards + details preview.
    if (activeStep === 1) return { paperMaxWidth: 1200, contentMaxWidth: "100%" };
    // Login step stays compact.
    if (activeStep === 0) return { paperMaxWidth: 760, contentMaxWidth: 520 };
    // Forms are medium width (avoid huge empty white area).
    return { paperMaxWidth: 980, contentMaxWidth: 520 };
  })();

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

      <LoginDialog open={loginOpen} onClose={() => setLoginOpen(false)} />

      <Paper
        sx={{
          p: { xs: 2.5, sm: 3, md: 4 },
          width: "100%",
          maxWidth: layout.paperMaxWidth,
          display: "flex",
          flexDirection: "column",
          transition: "max-width 250ms ease-out",
        }}
      >
        <Typography variant="h4" align="center" sx={{ mb: 4, fontWeight: "bold", color: "#373721" }}>
          Δήλωση Απώλειας
        </Typography>

        <Box
          sx={{
            flexGrow: 1,
            display: { xs: "block", md: "flex" },
            gap: 4,
          }}
        >
          <Box
            sx={{
              width: { xs: "100%", md: 280 },
              flexShrink: 0,
              borderRight: { md: "1px solid #e0e0e0" },
              pr: { md: 2 },
              mb: { xs: 3, md: 0 },
            }}
          >
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
          </Box>

          <Box
            sx={{
              flex: 1,
              minWidth: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Box sx={{ width: "100%", px: 2, pt: 2 }}>
              <SwitchTransition mode="out-in">
                <Collapse key={activeStep} in timeout={300} easing={{ enter: "ease-out", exit: "ease-in" }}>
                  <Box sx={{ width: "100%", maxWidth: layout.contentMaxWidth }}>{getStepContent(activeStep)}</Box>
                </Collapse>
              </SwitchTransition>
            </Box>

            <Box sx={{ flexGrow: 1 }} />

            <Box
              sx={{
                width: "100%",
                maxWidth: layout.contentMaxWidth,
                mt: 2,
                pt: 2,
                borderTop: "1px solid #f0f0f0",
                display: "flex",
                justifyContent: "space-between",
                px: 2,
                pb: 1,
              }}
            >
              {shouldShowFooterActions && activeStep !== 0 && (
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

              {shouldShowFooterActions && (
                isDone ? (
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
                )
              )}
            </Box>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}
