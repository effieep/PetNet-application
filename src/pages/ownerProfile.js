import React, { useState, useEffect } from "react";
import { Box, Typography, TextField, Button, Grid, CircularProgress, Alert } from "@mui/material";
import { useAuth } from "../auth/AuthContext";
import ProfileLayout from "../components/profileLayout"; // Σιγουρέψου για το σωστό path

const OwnerProfile = () => {
  const { user } = useAuth(); // Παίρνουμε τον χρήστη από το Context
  const [userData, setUserData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 1. Φόρτωση δεδομένων από το db.json
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Χρησιμοποιούμε το ID του χρήστη που έκανε login
        const response = await fetch(`http://localhost:3001/users/${user.id}`);
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

  // 3. Αποστολή των αλλαγών στη βάση (PATCH)
  const handleSave = async () => {
    try {
      const response = await fetch(`http://localhost:3001/users/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        setIsEditing(false);
        alert("Τα στοιχεία αποθηκεύτηκαν!");
      }
    } catch (err) {
      alert("Σφάλμα κατά την αποθήκευση.");
    }
  };

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress /></Box>;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <ProfileLayout role={userData?.role || "owner"}>
      <Typography variant="h5" sx={{ mb: 4, fontWeight: "bold", color: "#373721" }}>
        Προσωπικά στοιχεία
      </Typography>

      <Box sx={{ maxWidth: '400px' }}>
         <Grid container spacing={3}>
          {/* Κάθε Grid item τώρα έχει xs={12}, άρα πιάνει όλο το πλάτος της δεξιάς στήλης */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Όνομα"
              name="name"
              value={userData?.name || ""}
              onChange={handleChange}
              disabled={!isEditing}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Επώνυμο"
              name="surname"
              value={userData?.surname || ""}
              onChange={handleChange}
              disabled={!isEditing}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="ΑΦΜ"
              name="afm"
              value={userData?.afm || ""}
              disabled
              variant="filled"
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Email"
              name="email"
              value={userData?.email || ""}
              onChange={handleChange}
              disabled={!isEditing}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Τηλέφωνο επικοινωνίας"
              name="phone"
              value={userData?.phone || ""}
              onChange={handleChange}
              disabled={!isEditing}
            />
          </Grid>
        </Grid>

      </Box>
    
      <Box sx={{ mt: 5, display: "flex", gap: 2 }}>
        {!isEditing ? (
          <Button
            variant="contained"
            onClick={() => setIsEditing(true)}
            sx={{
              backgroundColor: "#9a9b6a",
              px: 4,
              py: 1.5,
              borderRadius: "10px",
              fontWeight: "bold",
              "&:hover": { backgroundColor: "#8a8b5a" },
            }}
          >
            ΕΠΕΞΕΡΓΑΣΙΑ ΣΤΟΙΧΕΙΩΝ
          </Button>
        ) : (
          <>
            <Button 
                variant="contained" 
                color="success" 
                onClick={handleSave}
                sx={{ borderRadius: "10px", px: 4 }}
            >
              ΑΠΟΘΗΚΕΥΣΗ
            </Button>
            <Button 
                variant="outlined" 
                color="error" 
                onClick={() => setIsEditing(false)}
                sx={{ borderRadius: "10px", px: 4 }}
            >
              ΑΚΥΡΩΣΗ
            </Button>
          </>
        )}
      </Box>
    </ProfileLayout>
  );
};

export default OwnerProfile;