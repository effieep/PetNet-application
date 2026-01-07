import React, { useState, useEffect } from "react";
import { Box, Typography, CircularProgress, Alert, Button, Snackbar } from "@mui/material";
import { useAuth } from "../../auth/AuthContext";
import ProfileLayout from "../../components/profileLayout"; // Σιγουρέψου για το σωστό path
import VetInfoCard from "../../components/VetInfoCard";

const VetProfile = () => {
  
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success', // 'success' | 'error'
  });

  const normalizeJobs = (jobs) => {
    if (!jobs) return {};

    // Remove completely empty jobs
    const filtered = Object.entries(jobs).reduce((acc, [key, job]) => {
      const hasValue = Object.values(job).some(
        v => v !== "" && v !== null && v !== undefined
      );

      if (hasValue) {
        acc[key] = job;
      }

      return acc;
    }, {});

    // If user filled at least one job → save only those
    if (Object.keys(filtered).length > 0) {
      return filtered;
    }

    return null;
  };
  
  const [errors, setErrors] = useState({});
  const { user, isLoggedIn } = useAuth(); // Παίρνουμε τον χρήστη από το Context
  const [userData, setUserData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const showSnackbar = (message, severity = 'success') => {
  setSnackbar({
    open: true,
    message,
    severity,
  });
};

  // 1. Φόρτωση δεδομένων από το db.json
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`http://localhost:3001/users/${user.id}`);
        const data = await response.json();

        setUserData({
          ...data,
          jobs: data.jobs || {
            "job-0": { role: "", company: "", startYear: "", endYear: "" },
          }
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) fetchUserData();
  }, [user]);

  // 2. Ενημέρωση του τοπικού state όταν γράφουμε στα inputs
  const handleChange = (e) => {
    const { name, value } = e.target;

    // ADD JOB
    if (name === '__ADD_JOB__') {
      setUserData(prev => {
        const keys = Object.keys(prev.jobs || {});
        const newKey = `job-${keys.length}`;

        return {
          ...prev,
          jobs: {
            ...prev.jobs,
            [newKey]: { role: "", company: "", startYear: "", endYear: "" }
          }
        };
      });
      return;
    }

    // REMOVE LAST JOB (keep at least 1)
    if (name === '__REMOVE_JOB__') {
      setUserData(prev => {
        const keys = Object.keys(prev.jobs || {});
        if (keys.length <= 1) return prev;

        const lastKey = keys[keys.length - 1];
        const { [lastKey]: _, ...rest } = prev.jobs;

        return {
          ...prev,
          jobs: rest
        };
      });
      return;
    }

    // JOB FIELD CHANGE
    if (name.includes('.')) {
      const [jobKey, field] = name.split('.');
      setUserData(prev => ({
        ...prev,
        jobs: {
          ...prev.jobs,
          [jobKey]: {
            ...prev.jobs[jobKey],
            [field]: value
          }
        }
      }));
      return;
    }

    // NORMAL FIELD
    setUserData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCancel = () => {
    // Επαναφορά των δεδομένων από το db.json
    setIsEditing(false);
    setErrors({});
    fetch(`http://localhost:3001/users/${user.id}`)
      .then((response) => response.json())
      .then((data) => {
        setUserData(data);
      })
      .catch((err) => {
        setError(err.message);
      });
  };

  const validateFields = () => {
    const newErrors = {};
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // true if no errors
  };

  // 3. Αποστολή των αλλαγών στη βάση (PATCH)
  const handleSave = async () => {
    if (!validateFields()) return;

    // Prepare data for saving
    const dataToSave = {
      ...userData,
      jobs: normalizeJobs(userData.jobs),
    };

    try {
      const response = await fetch(`http://localhost:3001/users/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSave),
      });

      if (response.ok) {
        setIsEditing(false);
        setErrors({});
        showSnackbar("Τα στοιχεία αποθηκεύτηκαν!", "success");
      } else {
        showSnackbar("Σφάλμα κατά την αποθήκευση.", "error");
      }
    } catch (err) {
      showSnackbar("Σφάλμα κατά την αποθήκευση.", "error");
    }
  };

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress /></Box>;
  if (error) return <Alert severity="error">{error}</Alert>;

  return ( 
    (isLoggedIn && userData?.role === "vet") ?
    (
    <>
    <ProfileLayout role={userData?.role || "vet"}>
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h5"
          sx={{ mb: 4, fontWeight: "bold", color: "#373721" }}
        >
          Στοιχεία Προφίλ Κτηνίατρου
        </Typography>

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            width: '100%',
          }}
        >
          <VetInfoCard
            data={userData}
            isEditing={isEditing}
            onChange={handleChange}
            errors={errors}
          />
        </Box>
      </Box>
      <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
        {!isEditing ? (
          <Button
            variant="contained"
            onClick={() => setIsEditing(true)}
            sx={{
              backgroundColor: '#9a9b6a',
              px: 4,
              borderRadius: '10px',
              fontWeight: 'bold',
              '&:hover': { backgroundColor: '#8a8b5a' },
            }}
          >
            ΕΠΕΞΕΡΓΑΣΙΑ
          </Button>
        ) : (
          <>
            <Button
              variant="contained"
              color="success"
              onClick={handleSave}
              sx={{ borderRadius: '10px', px: 4 }}
            >
              ΑΠΟΘΗΚΕΥΣΗ
            </Button>
            <Button
              variant="outlined"
              color="error"
              onClick={handleCancel}
              sx={{ borderRadius: '10px', px: 4 }}
            >
              ΑΚΥΡΩΣΗ
            </Button>
          </>
        )}
      </Box>
    </ProfileLayout>
    <Snackbar
      open={snackbar.open}
      autoHideDuration={3000} // 3 seconds
      onClose={() => setSnackbar({ ...snackbar, open: false })}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
    >
      <Alert
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        severity={snackbar.severity}
        sx={{ width: '100%' }}
      >
        {snackbar.message}
      </Alert>
    </Snackbar>
    </>
  ) :
  (
    <Typography variant="h6" color="error" textAlign="center" sx={{ mt: 10 }}>
      Παρακαλώ συνδεθείτε ως Κτηνίατρος για να δείτε το προφίλ σας.
    </Typography>
  )
  );
};

export default VetProfile;