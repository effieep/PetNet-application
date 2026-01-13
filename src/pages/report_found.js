import { useEffect, useMemo, useState } from "react";
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
  MenuItem,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import AddressPicker from "../components/AddressPicker";
import { API_URL } from "../api";

// ==============================================
// SUB-COMPONENTS (STEP CONTENT)
// ==============================================

const StepFoundDetails = ({ formData, updateField, errors }) => (
  <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
    <Box>
      <Typography variant="h6" sx={{ fontWeight: "bold", color: "#9a9b6a", mb: 2 }}>
        Στοιχεία Εύρεσης
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Ημερομηνία εύρεσης"
            type="date"
            variant="outlined"
            size="small"
            InputLabelProps={{ shrink: true }}
            value={formData.found.date}
            onChange={(e) => updateField("found", "date", e.target.value)}
            error={!!errors["found.date"]}
            helperText={errors["found.date"]}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Ώρα εύρεσης"
            type="time"
            variant="outlined"
            size="small"
            InputLabelProps={{ shrink: true }}
            value={formData.found.time}
            onChange={(e) => updateField("found", "time", e.target.value)}
          />
        </Grid>

        <Grid item xs={12}>
          <AddressPicker
            label="Διεύθυνση / Περιοχή που βρέθηκε"
            value={formData.found.area}
            onChange={(val) => updateField("found", "area", val)}
            coords={{ lat: formData.found.lat, lon: formData.found.lon }}
            onCoordsChange={(c) => {
              updateField("found", "lat", c.lat);
              updateField("found", "lon", c.lon);
            }}
            error={!!errors["found.area"]}
            helperText={errors["found.area"]}
          />
        </Grid>
      </Grid>
    </Box>
  </Box>
);

const StepAnimalDetails = ({ formData, updateField, errors, onAddPhotos, onRemovePhoto }) => (
  <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
    <Box>
      <Typography variant="h6" sx={{ fontWeight: "bold", color: "#9a9b6a", mb: 2 }}>
        Στοιχεία Ζώου
      </Typography>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <TextField
          select
          fullWidth
          label="Είδος"
          variant="outlined"
          size="small"
          sx={{ maxWidth: { xs: "100%", sm: 360 } }}
          value={formData.animal.species}
          onChange={(e) => updateField("animal", "species", e.target.value)}
          error={!!errors["animal.species"]}
          helperText={errors["animal.species"]}
        >
          <MenuItem value="">-</MenuItem>
          <MenuItem value="Σκύλος">Σκύλος</MenuItem>
          <MenuItem value="Γάτα">Γάτα</MenuItem>
          <MenuItem value="Κουνέλι">Κουνέλι</MenuItem>
          <MenuItem value="Χάμστερ">Χάμστερ</MenuItem>
          <MenuItem value="Άλλο">Άλλο</MenuItem>
        </TextField>

        <TextField
          fullWidth
          label="Φυλή"
          variant="outlined"
          size="small"
          sx={{ maxWidth: { xs: "100%", sm: 360 } }}
          value={formData.animal.breed}
          onChange={(e) => updateField("animal", "breed", e.target.value)}
          error={!!errors["animal.breed"]}
          helperText={errors["animal.breed"]}
        />

        <TextField
          select
          fullWidth
          label="Φύλο"
          variant="outlined"
          size="small"
          sx={{ maxWidth: { xs: "100%", sm: 360 } }}
          value={formData.animal.gender}
          onChange={(e) => updateField("animal", "gender", e.target.value)}
          error={!!errors["animal.gender"]}
          helperText={errors["animal.gender"]}
        >
          <MenuItem value="">-</MenuItem>
          <MenuItem value="Αρσενικό">Αρσενικό</MenuItem>
          <MenuItem value="Θηλυκό">Θηλυκό</MenuItem>
          <MenuItem value="Άγνωστο">Άγνωστο</MenuItem>
        </TextField>

        <TextField
          fullWidth
          label="Χρώμα"
          variant="outlined"
          size="small"
          sx={{ maxWidth: { xs: "100%", sm: 360 } }}
          value={formData.animal.color}
          onChange={(e) => updateField("animal", "color", e.target.value)}
          error={!!errors["animal.color"]}
          helperText={errors["animal.color"]}
        />

        <TextField
          select
          fullWidth
          label="Μέγεθος"
          variant="outlined"
          size="small"
          sx={{ maxWidth: { xs: "100%", sm: 360 } }}
          value={formData.animal.size}
          onChange={(e) => updateField("animal", "size", e.target.value)}
          error={!!errors["animal.size"]}
          helperText={errors["animal.size"]}
        >
          <MenuItem value="">-</MenuItem>
          <MenuItem value="Μικρό">Μικρό</MenuItem>
          <MenuItem value="Μεσαίο">Μεσαίο</MenuItem>
          <MenuItem value="Μεγάλο">Μεγάλο</MenuItem>
          <MenuItem value="Άγνωστο">Άγνωστο</MenuItem>
        </TextField>

        <Box>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 2, flexWrap: "wrap" }}>
            <Typography sx={{ fontWeight: 700 }}>
              Φωτογραφίες (υποχρεωτικό)
            </Typography>
            <Button component="label" variant="outlined" sx={{ fontWeight: 700 }}>
              Προσθήκη φωτογραφιών
              <input
                hidden
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => onAddPhotos(e.target.files)}
              />
            </Button>
          </Box>
          {errors["animal.photos"] && (
            <Typography variant="body2" color="error" sx={{ mt: 1, fontWeight: 700 }}>
              {errors["animal.photos"]}
            </Typography>
          )}

          {formData.animal.photos.length > 0 && (
            <Box sx={{ mt: 1.5, display: "flex", gap: 1.5, flexWrap: "wrap" }}>
              {formData.animal.photos.map((src, idx) => (
                <Box
                  key={`${idx}-${src.slice(0, 16)}`}
                  sx={{
                    width: 92,
                    height: 92,
                    borderRadius: 2,
                    overflow: "hidden",
                    border: "1px solid rgba(0,0,0,0.15)",
                    position: "relative",
                    backgroundColor: "#fff",
                  }}
                >
                  <img
                    src={src}
                    alt={`photo-${idx + 1}`}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                  <Button
                    size="small"
                    onClick={() => onRemovePhoto(idx)}
                    sx={{
                      position: "absolute",
                      top: 4,
                      right: 4,
                      minWidth: 0,
                      px: 1,
                      py: 0.25,
                      backgroundColor: "rgba(255,255,255,0.9)",
                      border: "1px solid rgba(0,0,0,0.12)",
                      fontWeight: 900,
                      lineHeight: 1,
                      "&:hover": { backgroundColor: "rgba(255,255,255,1)" },
                    }}
                  >
                    ×
                  </Button>
                </Box>
              ))}
            </Box>
          )}
        </Box>

        <TextField
          fullWidth
          multiline
          minRows={3}
          label="Επιπλέον περιγραφή (προαιρετικό)"
          variant="outlined"
          size="small"
          value={formData.animal.description}
          onChange={(e) => updateField("animal", "description", e.target.value)}
        />
      </Box>
    </Box>
  </Box>
);

const StepContactDetails = ({ formData, updateField, errors, showAltContact, onToggleAltContact }) => (
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

const StepOverview = ({ formData, submitError }) => (
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
          <strong>Ημερομηνία εύρεσης:</strong> {formData.found.date || "-"}
        </li>
        {formData.found.time && (
          <li>
            <strong>Ώρα εύρεσης:</strong> {formData.found.time}
          </li>
        )}
        <li>
          <strong>Περιοχή:</strong> {formData.found.area || "-"}
        </li>
        <li style={{ marginTop: 8, opacity: 0.9 }}>
          <strong>Ζώο:</strong>
        </li>
        <li>
          <strong>Είδος:</strong> {formData.animal.species || "-"}
        </li>
        <li>
          <strong>Φυλή:</strong> {formData.animal.breed || "-"}
        </li>
        <li>
          <strong>Φύλο:</strong> {formData.animal.gender || "-"}
        </li>
        <li>
          <strong>Χρώμα:</strong> {formData.animal.color || "-"}
        </li>
        <li>
          <strong>Μέγεθος:</strong> {formData.animal.size || "-"}
        </li>
        <li>
          <strong>Φωτογραφίες:</strong> {formData.animal.photos.length}
        </li>
        {formData.animal.description && (
          <li>
            <strong>Περιγραφή:</strong> {formData.animal.description}
          </li>
        )}
        <li style={{ marginTop: 8, opacity: 0.9 }}>
          <strong>Επικοινωνία:</strong>
        </li>
        <li>
          <strong>Όνομα:</strong> {formData.contact.name || "-"}
        </li>
        <li>
          <strong>Τηλέφωνο:</strong> {formData.contact.phone || "-"}
        </li>
        <li>
          <strong>Email:</strong> {formData.contact.email || "-"}
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

    {formData.animal.photos.length > 0 && (
      <Box sx={{ mt: 2 }}>
        <Divider sx={{ mb: 2 }} />
        <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
          Φωτογραφίες
        </Typography>
        <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap" }}>
          {formData.animal.photos.map((src, idx) => (
            <Box
              key={`ov-${idx}-${src.slice(0, 16)}`}
              sx={{
                width: 110,
                height: 110,
                borderRadius: 2,
                overflow: "hidden",
                border: "1px solid rgba(0,0,0,0.15)",
                backgroundColor: "#fff",
              }}
            >
              <img
                src={src}
                alt={`overview-photo-${idx + 1}`}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </Box>
          ))}
        </Box>
      </Box>
    )}
  </Box>
);

const StepSummary = () => (
  <Box sx={{ textAlign: "center", py: 5 }}>
    <Typography variant="h5" color="success.main" gutterBottom>
      Έτοιμο!
    </Typography>
    <Typography>Η δήλωση εύρεσης καταχωρήθηκε επιτυχώς.</Typography>
  </Box>
);

// ==============================================
// MAIN COMPONENT
// ==============================================

export default function ReportFoundStepper() {
  const [activeStep, setActiveStep] = useState(0);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const [showAltContact, setShowAltContact] = useState(false);

  const [formData, setFormData] = useState({
    found: {
      date: "",
      time: "",
      area: "",
      lat: null,
      lon: null,
    },
    animal: {
      species: "",
      breed: "",
      gender: "",
      color: "",
      size: "",
      photos: [],
      description: "",
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

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    setErrors({});
    setSubmitError("");
  }, [activeStep]);

  const steps = useMemo(
    () => ["Στοιχεία Εύρεσης", "Στοιχεία Ζώου", "Επικοινωνία", "Σύνοψη", "Ολοκλήρωση"],
    []
  );

  const isDone = activeStep >= steps.length - 1;
  const isConfirmStep = activeStep === steps.length - 2;

  const updateField = (section, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const formatDateToDDMMYYYY = (dateStr) => {
    if (!dateStr) return "";
    if (/^\d{2}-\d{2}-\d{4}$/.test(dateStr)) return dateStr;
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

  const validateStep = () => {
    const newErrors = {};

    if (activeStep === 0) {
      if (!formData.found.date) newErrors["found.date"] = "Υποχρεωτικό";
      if (!formData.found.area.trim()) newErrors["found.area"] = "Υποχρεωτικό";
    }

    if (activeStep === 1) {
      if (!formData.animal.species) newErrors["animal.species"] = "Υποχρεωτικό";
      if (!formData.animal.gender) newErrors["animal.gender"] = "Υποχρεωτικό";
      if (!formData.animal.size) newErrors["animal.size"] = "Υποχρεωτικό";
      if (!formData.animal.photos || formData.animal.photos.length === 0) {
        newErrors["animal.photos"] = "Ανεβάστε τουλάχιστον 1 φωτογραφία";
      }
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

  const fileListToArray = (fileList) => {
    if (!fileList) return [];
    return Array.from(fileList);
  };

  const readFileAsDataUrl = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result || ""));
      reader.onerror = () => reject(new Error("Αποτυχία ανάγνωσης αρχείου"));
      reader.readAsDataURL(file);
    });

  const handleAddPhotos = async (fileList) => {
    const files = fileListToArray(fileList);
    if (files.length === 0) return;

    // soft limit: keep UI snappy
    const nextFiles = files.slice(0, 6);

    try {
      const urls = await Promise.all(nextFiles.map(readFileAsDataUrl));
      setFormData((prev) => ({
        ...prev,
        animal: {
          ...prev.animal,
          photos: [...prev.animal.photos, ...urls],
        },
      }));
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy["animal.photos"];
        return copy;
      });
    } catch {
      setErrors((prev) => ({ ...prev, "animal.photos": "Δεν ήταν δυνατή η φόρτωση φωτογραφιών" }));
    }
  };

  const handleRemovePhoto = (index) => {
    setFormData((prev) => ({
      ...prev,
      animal: {
        ...prev.animal,
        photos: prev.animal.photos.filter((_, i) => i !== index),
      },
    }));
  };

  const handleSubmit = async () => {
    if (submitting) return;
    setSubmitError("");

    // Ensure last validation
    const ok = validateStep();
    if (!ok) return;

    const payload = {
      type: "FOUND",
      status: "SUBMITTED",
      createdAt: todayDDMMYYYY(),
      createdTime: nowHHMM(),
      foundDate: formatDateToDDMMYYYY(formData.found.date),
      foundTime: formData.found.time || "",
      location: {
        address: formData.found.area,
        ...(formData.found.lat != null && formData.found.lon != null
          ? { lat: formData.found.lat, lon: formData.found.lon }
          : {}),
      },
      petType: formData.animal.species,
      pet: {
        species: formData.animal.species,
        breed: formData.animal.breed,
        gender: formData.animal.gender,
        color: formData.animal.color,
        size: formData.animal.size,
        photos: formData.animal.photos,
      },
      description: formData.animal.description || "",
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

      setActiveStep((prev) => prev + 1);
    } catch (e) {
      setSubmitError(e?.message || "Παρουσιάστηκε σφάλμα κατά την αποθήκευση.");
    } finally {
      setSubmitting(false);
    }
  };

  const getStepContent = (stepIndex) => {
    switch (stepIndex) {
      case 0:
        return <StepFoundDetails formData={formData} updateField={updateField} errors={errors} />;
      case 1:
        return (
          <StepAnimalDetails
            formData={formData}
            updateField={updateField}
            errors={errors}
            onAddPhotos={handleAddPhotos}
            onRemovePhoto={handleRemovePhoto}
          />
        );
      case 2:
        return (
          <StepContactDetails
            formData={formData}
            updateField={updateField}
            errors={errors}
            showAltContact={showAltContact}
            onToggleAltContact={handleToggleAltContact}
          />
        );
      case 3:
        return <StepOverview formData={formData} submitError={submitError} />;
      case 4:
        return <StepSummary />;
      default:
        return "Άγνωστο";
    }
  };

  const layout = (() => {
    // Keep the overall card tighter on wide screens.
    // Step 2 (animal details) should be a narrow, readable column.
    if (activeStep === 0) return { paperMaxWidth: 900, contentMaxWidth: 680 };
    if (activeStep === 1) return { paperMaxWidth: 900, contentMaxWidth: 420 };
    if (activeStep === 2) return { paperMaxWidth: 900, contentMaxWidth: 420 };
    if (activeStep === 3) return { paperMaxWidth: 900, contentMaxWidth: 620 };
    return { paperMaxWidth: 900, contentMaxWidth: 520 };
  })();

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
        px: 2,
      }}
    >
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
          Δήλωση Εύρεσης
        </Typography>

        <Box
          sx={{
            flexGrow: 1,
            display: { xs: "block", md: "flex" },
            gap: 3,
          }}
        >
          <Box
            sx={{
              width: { xs: "100%", md: 240 },
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
              )}
            </Box>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}
