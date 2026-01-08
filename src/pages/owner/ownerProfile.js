import React, { useState, useEffect } from "react";
import { Box, Typography, CircularProgress, Alert, Button, Snackbar } from "@mui/material";
import { useAuth } from "../../auth/AuthContext";
import ProfileLayout from "../../components/profileLayout"; // Σιγουρέψου για το σωστό path
import UserInfoCard from "../../components/UserInfoCard";
import {API_URL} from "../../api";



const OwnerProfile = () => {
  
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success', // 'success' | 'error'
  });

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
        const response = await fetch(`${API_URL}/users/${user.id}`);
        if (!response.ok) throw new Error("Δεν βρέθηκαν τα στοιχεία του χρήστη.");
        const data = await response.json();
        setUserData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchUserData();
    } else {
      setLoading(false);
    }
  }, [user]);

  // 2. Ενημέρωση του τοπικού state όταν γράφουμε στα inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCancel = () => {
    // Επαναφορά των δεδομένων από το db.json
    setIsEditing(false);
    setErrors({});
    fetch(`${API_URL}/users/${user.id}`)
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

    // Phone: exactly 10 digits
    if (!/^\d{10}$/.test(userData?.phone || '')) {
      newErrors.phone = "Το τηλέφωνο πρέπει να έχει 10 αριθμούς";
    }

    // Postal code: exactly 5 digits
    if (!/^\d{5}$/.test(userData?.postalCode || '')) {
      newErrors.postalCode = "Ο ταχυδρομικός κώδικας πρέπει να έχει 5 αριθμούς";
    }

    // Email: simple email regex
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData?.email || '')) {
      newErrors.email = "Το email δεν είναι έγκυρο";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // true if no errors
  };

  // 3. Αποστολή των αλλαγών στη βάση (PATCH)
  const handleSave = async () => {

    if (!validateFields()) return

    try {
      const response = await fetch(`${API_URL}/users/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
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
    (isLoggedIn && userData?.role === "owner") ?
    (
    <>
    <ProfileLayout role={userData?.role || "owner"}>
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
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h5"
          sx={{ mb: 4, fontWeight: "bold", color: "#373721" }}
        >
          Στοιχεία Προφίλ Ιδιοκτήτη
        </Typography>

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            width: '100%',
          }}
        >
          <UserInfoCard
            data={userData}
            isEditing={isEditing}
            onChange={handleChange}
            errors={errors}
          />
        </Box>
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
      Παρακαλώ συνδεθείτε ως Ιδιοκτήτης για να δείτε το προφίλ σας.
    </Typography>
  )
  );
};

export default OwnerProfile;