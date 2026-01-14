import { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { Autocomplete, Collapse, Divider, Chip } from "@mui/material";
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
  MenuItem,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import LoginDialog from "../components/login";
import PetPreviewCard from "../components/PetPreviewCard";
import PetDetailsCard from "../components/PetDetailsCard";
import AddressPicker from "../components/AddressPicker";
import { API_URL } from "../api";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import EditIcon from '@mui/icons-material/Edit';

const formatDateStr = (dateStr) => {
  if (!dateStr) return "";
  const date = dateStr.split("T")[0];
  const [years, months, days] = date.split("-");
  return `${days}/${months}/${years}`;
};

// ==============================================
// SUB-COMPONENTS (ΤΟ ΠΕΡΙΕΧΟΜΕΝΟ ΤΩΝ ΒΗΜΑΤΩΝ)
// ==============================================

const StepLogin = ({ isLoggedIn, user, onOpenLogin, logout }) => (
  <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
    {(!isLoggedIn || user.role !== 'owner') && (
      <>
        <Typography variant="h6" color="error" textAlign="center" sx={{ fontWeight: "bold" }}>
          Απαιτείται σύνδεση {!isLoggedIn ? '' : 'ως ιδιοκτήτης'} για να κάνετε δήλωση απώλειας κατοικιδίου.
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Button
            variant="contained"
            onClick={onOpenLogin} 
            sx={{ px: 4, py: 1, fontWeight: "bold", display: !isLoggedIn ? 'block' : 'none' }}
          >
            Σύνδεση
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={logout}
            sx={{ px: 4, py: 1, fontWeight: "bold", display: isLoggedIn ? 'block' : 'none', ml:2 }}
          >
            Αποσύνδεση
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
                my: 1, mx: 1
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

const StepContactDetails = ({ formData, updateField, errors, user, contactPreset, onContactPresetChange, showAltContact, onToggleAltContact }) => (
  <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
    <Box>
      <Typography variant="h6" sx={{ fontWeight: "bold", color: "#9a9b6a", mb: 2 }}>
        Στοιχεία Επικοινωνίας
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            select
            fullWidth
            label="Επιλογή στοιχείων επικοινωνίας"
            variant="outlined"
            size="small"
            value={contactPreset}
            onChange={(e) => onContactPresetChange(e.target.value)}
            helperText={
              contactPreset === "account"
                ? "Θα χρησιμοποιηθούν τα στοιχεία του λογαριασμού σας."
                : contactPreset === "empty"
                  ? "Θα καθαριστούν τα πεδία. Συμπληρώστε χειροκίνητα για να συνεχίσετε."
                  : "Συμπληρώστε χειροκίνητα τα στοιχεία επικοινωνίας."
            }
          >
            <MenuItem value="empty">Κενό</MenuItem>
            <MenuItem value="account" disabled={!user}>
              Στοιχεία χρήστη
            </MenuItem>
            <MenuItem value="manual">Άλλα στοιχεία</MenuItem>
          </TextField>
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Όνομα επικοινωνίας"
            variant="outlined"
            size="small"
            value={formData.contact.name}
            onChange={(e) => updateField("contact", "name", e.target.value)}
            disabled={contactPreset === "account"}
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
            disabled={contactPreset === "account"}
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
            disabled={contactPreset === "account"}
            error={!!errors["contact.email"]}
            helperText={errors["contact.email"]}
          />
        </Grid>

        <Grid item xs={12}>
          <Box sx={{ display: "flex", justifyContent: "flex-start" }}>
            <Button variant="outlined" onClick={onToggleAltContact} sx={{ fontWeight: 700 }}>
              {showAltContact ? "Αφαίρεση επιπλέον επαφής" : "Προσθήκη επιπλέον επαφής"}
            </Button>
          </Box>
        </Grid>

        {showAltContact && (
          <>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Επιπλέον όνομα επικοινωνίας (προαιρετικό)"
                variant="outlined"
                size="small"
                value={formData.contact.altName}
                onChange={(e) => updateField("contact", "altName", e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Επιπλέον τηλέφωνο (προαιρετικό)"
                variant="outlined"
                size="small"
                value={formData.contact.altPhone}
                onChange={(e) => updateField("contact", "altPhone", e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Επιπλέον email (προαιρετικό)"
                variant="outlined"
                size="small"
                value={formData.contact.altEmail}
                onChange={(e) => updateField("contact", "altEmail", e.target.value)}
              />
            </Grid>
          </>
        )}
      </Grid>
    </Box>
  </Box>
);

const StepConfirmation = ({ formData, submitError }) => (
  <Box>
    <Typography variant="h6" gutterBottom>
      Παρακαλώ ελέγξτε τα στοιχεία σας:
    </Typography>

    {submitError && (
      <Typography color="error" sx={{ fontWeight: 700, mb: 2 }}>
        {submitError}
      </Typography>
    )}

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
        {formData.loss.time && (
          <li>
            <strong>Ώρα:</strong> {formData.loss.time}
          </li>
        )}
        <li>
          <strong>Τηλέφωνο:</strong> {formData.contact.phone}
        </li>
        <li>
          <strong>Email:</strong> {formData.contact.email}
        </li>
        {(formData.contact.altName || formData.contact.altPhone || formData.contact.altEmail) && (
          <>
            <li style={{ marginTop: 8, opacity: 0.9 }}>
              <strong>Επιπλέον επαφή:</strong>
            </li>
            {formData.contact.altName && (
              <li>
                <strong>Όνομα:</strong> {formData.contact.altName}
              </li>
            )}
            {formData.contact.altPhone && (
              <li>
                <strong>Τηλέφωνο:</strong> {formData.contact.altPhone}
              </li>
            )}
            {formData.contact.altEmail && (
              <li>
                <strong>Email:</strong> {formData.contact.altEmail}
              </li>
            )}
          </>
        )}
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
      Η δήλωση απώλειας καταχωρήθηκε επιτυχώς.
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
  const { user, isLoggedIn, logout } = useAuth();

  const [pets, setPets] = useState([]);
  const [petsLoading, setPetsLoading] = useState(false);
  const [petsError, setPetsError] = useState("");
  const [selectedPetId, setSelectedPetId] = useState(null);
  const [previewPetId, setPreviewPetId] = useState(null);
  const [tempSavedData, setTempSavedData] = useState([]);
  const [tempSavedDataId, setTempSavedDataId] = useState(null);

  const [formData, setFormData] = useState({
    pet: {
      id: "",
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
      altName: "",
      altPhone: "",
      altEmail: "",
    },
  });

  const [contactPreset, setContactPreset] = useState("manual");
  const [showAltContact, setShowAltContact] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    setErrors({});
    setSubmitError("");
  }, [activeStep]);

  useEffect(() => {
    if (activeStep === 0 && ( isLoggedIn && user.role === 'owner') ) {
      setLoginOpen(false);
      setActiveStep(1);
    }
    if (activeStep > 0 && (!isLoggedIn || user.role !== 'owner') ) {
      setActiveStep(0);
    }
    const fetchTempSavedData = async () => {
      try{
        const response = await fetch(`${API_URL}/temp-saved-lost-form`);
        const data = await response.json();
        let userTempData = [];
        if(data.length > 0 ){
          userTempData = data.filter(item => item.userId === (user?.id || null));
        }
        if (!response.ok) throw new Error("Αποτυχία φόρτωσης προσωρινών δεδομένων.");
        setTempSavedData(userTempData);
      }
      catch (error) {
        console.error("Error fetching temp saved data:", error);
      }
    };
    fetchTempSavedData();
  }, [activeStep, isLoggedIn, user]);

  useEffect(() => {
    // When entering the contact step, default to account details (only if fields are empty).
    if (activeStep !== 3) return;
    if (!isLoggedIn || !user) return;
    const isEmpty =
      !formData.contact.name.trim() &&
      !formData.contact.phone.trim() &&
      !formData.contact.email.trim();
    if (!isEmpty) return;

    const fullName = `${user.name || ""} ${user.surname || ""}`.trim();
    setContactPreset("account");
    setFormData((prev) => ({
      ...prev,
      contact: {
        ...prev.contact,
        name: fullName,
        phone: user.phone || "",
        email: user.email || "",
      },
    }));
  }, [activeStep, isLoggedIn, user, formData.contact.email, formData.contact.name, formData.contact.phone]);

  const handleContactPresetChange = (nextPreset) => {
    setContactPreset(nextPreset);

    if (nextPreset === "empty") {
      setFormData((prev) => ({
        ...prev,
        contact: { ...prev.contact, name: "", phone: "", email: "" },
      }));
      return;
    }

    if (nextPreset === "account") {
      const fullName = `${user?.name || ""} ${user?.surname || ""}`.trim();
      setFormData((prev) => ({
        ...prev,
        contact: {
          ...prev.contact,
          name: fullName,
          phone: user?.phone || "",
          email: user?.email || "",
        },
      }));
    }
  };

  const handleToggleAltContact = () => {
    setShowAltContact((prev) => {
      const next = !prev;
      if (!next) {
        setFormData((current) => ({
          ...current,
          contact: { ...current.contact, altName: "", altPhone: "", altEmail: "" },
        }));
      }
      return next;
    });
  };

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

  const formatDateToDDMMYYYY = (dateStr) => {
    if (!dateStr) return "";
    // Already matches db.json style
    if (/^\d{2}-\d{2}-\d{4}$/.test(dateStr)) return dateStr;
    // From <input type="date"> (YYYY-MM-DD)
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
      const [yyyy, mm, dd] = dateStr.split("-");
      return `${dd}-${mm}-${yyyy}`;
    }
    return dateStr;
  };

  const todayDDMMYYYY = () => {
    const d = new Date();
    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const yyyy = String(d.getFullYear());
    return `${dd}-${mm}-${yyyy}`;
  };

  const nowHHMM = () => {
    const d = new Date();
    const hh = String(d.getHours()).padStart(2, "0");
    const min = String(d.getMinutes()).padStart(2, "0");
    return `${hh}:${min}`;
  };

  const handleSubmit = async () => {
    if (submitting) return;
    setSubmitError("");

    // Extra guards (should already be enforced by the wizard gating)
    if (!isLoggedIn || !user?.id) {
      setSubmitError("Απαιτείται σύνδεση.");
      setActiveStep(0);
      return;
    }
    if (!selectedPetId) {
      setSubmitError("Επιλέξτε κατοικίδιο πριν την ολοκλήρωση.");
      setActiveStep(1);
      return;
    }

    const payload = {
      type: "LOSS",
      status: "SUBMITTED",
      createdAt: todayDDMMYYYY(),
      createdTime: nowHHMM(),
      petId: String(selectedPetId),
      ownerId: String(user.id),
      lostDate: formatDateToDDMMYYYY(formData.loss.date),
      lostTime: formData.loss.time || "",
      location: {
        address: formData.loss.area,
        ...(formData.loss.lat != null && formData.loss.lon != null
          ? { lat: formData.loss.lat, lon: formData.loss.lon }
          : {}),
      },
      description: formData.loss.notes || "",
      contact: {
        name: formData.contact.name,
        phone: formData.contact.phone,
        email: formData.contact.email,
        ...(formData.contact.altName || formData.contact.altPhone || formData.contact.altEmail
          ? {
              alt: {
                name: formData.contact.altName,
                phone: formData.contact.altPhone,
                email: formData.contact.altEmail,
              },
            }
          : {}),
      },
    };

    setSubmitting(true);
    try {
      const res = await fetch(`${API_URL}/declarations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Αποτυχία αποθήκευσης δήλωσης.");

      // Success: go to "Ολοκλήρωση"
      if(tempSavedDataId){
        const delres = await fetch(`${API_URL}/temp-saved-lost-form/${tempSavedDataId}`, {
          method: "DELETE",
        });
        if(!delres.ok) throw new Error("Αποτυχία διαγραφής προσωρινών δεδομένων.");
        setTempSavedDataId(null);
        setTempSavedData(prevData => prevData.filter(item => item.id !== tempSavedDataId));
      }
      setActiveStep((prev) => prev + 1);
    } catch (e) {
      setSubmitError(e?.message || "Παρουσιάστηκε σφάλμα κατά την αποθήκευση.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSelectPet = (pet) => {
    setSelectedPetId(pet.id);
    setPreviewPetId(pet.id);
    setFormData((prev) => ({
      ...prev,
      pet: {
        ...prev.pet,
        id: pet.id,
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
        return <StepLogin isLoggedIn={isLoggedIn} user={user} onOpenLogin={() => setLoginOpen(true)} logout={logout} />;
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
        return (
          <StepContactDetails
            formData={formData}
            updateField={updateField}
            errors={errors}
            user={user}
            contactPreset={contactPreset}
            onContactPresetChange={handleContactPresetChange}
            showAltContact={showAltContact}
            onToggleAltContact={handleToggleAltContact}
          />
        );
      case 4:
        return <StepConfirmation formData={formData} submitError={submitError} />;
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
    if (activeStep === 1) return { paperMaxWidth: 1300, contentMaxWidth: "100%" };
    // Login step stays compact.
    if (activeStep === 0) return { paperMaxWidth: 760, contentMaxWidth: 520 };
    // Step 2 (loss details) includes the map + notes; make it wider but still centered.
    if (activeStep === 2) return { paperMaxWidth: 980, contentMaxWidth: 760 };
    // Forms are medium width (avoid huge empty white area).
    return { paperMaxWidth: 980, contentMaxWidth: 520 };
  })();

  const handleTempSave = async () => {
    setActiveStep(0);
    try{
      const existingDraft = tempSavedData.find(item => item.id === tempSavedDataId);
      if(existingDraft){
        // Update existing
        const response = await fetch(`${API_URL}/temp-saved-lost-form/${tempSavedDataId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            savedAt: new Date().toISOString(),
            data: formData,
          }),
        });
        const data = await response.json();
        if (!response.ok) throw new Error("Αποτυχία αποθήκευσης προσωρινών δεδομένων.");
        setTempSavedData(prevData => prevData.map(item => item.id === tempSavedDataId ? data : item));
        return;
      }
      else{
        const response = await fetch(`${API_URL}/temp-saved-lost-form`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: user?.id || null,
            savedAt: new Date().toISOString(),
            data: formData,
          }),
        });
        const data = await response.json();
        if (!response.ok) throw new Error("Αποτυχία αποθήκευσης προσωρινών δεδομένων.");
        setTempSavedData(prevData => [...prevData, data]);
      }
    }
    catch (error) {
      console.error("Error saving temp data:", error);
    }
  };

  const handleTempChange = (event, newValue) => {
    setTempSavedDataId(newValue?.id || null);
    setFormData(newValue?.data || 
    {
      pet: {
        id: "",
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
        altName: "",
        altPhone: "",
        altEmail: "",
      },
  });
  };

  const handleTempDelete = async () => {
    if (!tempSavedDataId) return;
    try {
      const response = await fetch(`${API_URL}/temp-saved-lost-form/${tempSavedDataId}`, {
        method: "DELETE",
      });
      setTempSavedDataId(null);
      setTempSavedData(prevData => prevData.filter(item => item.id !== tempSavedDataId));
      if(!response.ok) throw new Error("Αποτυχία διαγραφής προσωρινών δεδομένων.");
    }
    catch (error) {
      console.error("Error deleting temp saved data:", error);
    }
  };

  return (
    
    <Box
      sx={{
        // minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
        flexDirection: 'column',
        px: 2,
      }}
    >

      <LoginDialog open={loginOpen} onClose={() => setLoginOpen(false)} />
      <Box
        sx={{
          position: 'sticky',
          top: 20,
          zIndex: 1000,
          mt: 2,
          mb: 2,
          backdropFilter: 'blur(8px)',
          borderRadius: '20px',
          p: 1,
          display: 'flex',
          justifyContent: 'center'
        }}
      >
          <Chip
            icon={tempSavedDataId ? <EditIcon /> : <AddCircleOutlineIcon />}
            label={tempSavedDataId ? "Σε κατάσταση Επεξεργασίας Αποθηκευμένου Προσχεδίου" : "Σε κατάσταση Νέας Καταχώρησης"}
            color={tempSavedDataId ? "warning" : "success"}
            variant="filled"
            sx={{
              fontWeight: 'bold',
              fontSize: '0.9rem',
              py: 2.5,
              px: 1,
              borderRadius: 2,
            }}
          />
      </Box>
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
        <Box sx={{ display: "flex", flexDirection: "row", gap: 2, justifyContent: "center", alignSelf: "center" }}>
          <Autocomplete
            value={tempSavedData.find(item => item.id === tempSavedDataId) || null}
            options={tempSavedData}
            getOptionLabel={(option) => `${formatDateStr(option.savedAt)} - ${pets.find(p => p.id === option.data.pet.id)?.name || 'Άγνωστο Κατοικίδιο'}`}
            renderInput={(params) => <TextField {...params} label="Φόρτωση προσωρινής αποθήκευσης" variant="outlined" size="small" Inp />}
            sx={{ mb: 3, width: "30vw", height: "5vh" }}
            onChange={(event, newValue) => handleTempChange(event, newValue)}
          />
          <Button
            variant="contained"
            onClick={handleTempDelete}
            sx={{ fontWeight: "bold", height: "5vh", textTransform: "none", 
              color: '#dfdddd',
              backgroundColor: '#bb3d3d',
              '&:hover': { backgroundColor: '#ce5959' },
            }}
          >
            Διαγραφή Επιλεγμένου Προσχεδίου
          </Button>
        </Box>

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
                    display: activeStep === 5 ? "none" : "block",
                    color: "#000000ff",
                    outline: "solid 1px #000000ff",
                    px: 4,
                  }}
                >
                  ΠΙΣΩ
                </Button>
              )}
              <Button
                disabled={formData.pet.id === ''}
                variant="contained"
                color="success"
                onClick={handleTempSave}
                sx={{ px: 4, py: 1, fontWeight: "bold", ml: "auto",
                      borderColor: '#3b2004',
                      color: '#3b2004',
                      display: (activeStep === 4 || activeStep === 5) ? "none" : "block",
                      backgroundColor: '#d38d1e',
                      '&:hover': { 
                        backgroundColor: '#eeaf49',
                      }, 
                 }}
              >
                Προσωρινη Αποθηκευση
              </Button>

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
                  <Button
                    variant="contained"
                    color="success"
                    onClick={handleSubmit}
                    disabled={submitting}
                    sx={{ px: 4, py: 1, fontWeight: "bold", ml: "auto" }}
                  >
                    {submitting ? "..." : "ΟΛΟΚΛΗΡΩΣΗ"}
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
