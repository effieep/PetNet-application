import React, { useState, useEffect } from "react";
import { Box, Typography, CircularProgress, Alert } from "@mui/material";
import { useAuth } from "../../auth/AuthContext";
import ProfileLayout from "../../components/profileLayout"; // Σιγουρέψου για το σωστό path
import UserInfoCard from "../../components/UserInfoCard";

const ownerFields = [
  { name: 'name', label: 'Όνομα', half: true },
  { name: 'surname', label: 'Επώνυμο', half: true },
  { name: 'afm', label: 'ΑΦΜ', disabled: true },
  { name: 'email', label: 'Email' },
  { name: 'phone', label: 'Τηλέφωνο επικοινωνίας' },
];

const OwnerProfile = () => {
  const { user, isLoggedIn } = useAuth(); // Παίρνουμε τον χρήστη από το Context
  const [userData, setUserData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 1. Φόρτωση δεδομένων από το db.json
  useEffect(() => {
    const fetchUserData = async () => {
      try {
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
    isLoggedIn ?
    (
    <ProfileLayout role={userData?.role || "owner"}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" sx={{ mb: 4, fontWeight: "bold", color: "#373721" }}>
          Προσωπικά στοιχεία
        </Typography>

        <Box sx={{ position: 'relative', maxWidth: '400px' }}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '60vh',
              }}
            >
              <UserInfoCard
                fields={ownerFields}
                data={userData}
                isEditing={isEditing}
                onChange={handleChange}
                onEdit={() => setIsEditing(true)}
                onSave={handleSave}
              />
            </Box>
        </Box>
      </Box>
    </ProfileLayout>
  ) :
  (
    <Typography variant="h6" color="error" textAlign="center" sx={{ mt: 10 }}>
      Παρακαλώ συνδεθείτε για να δείτε το προφίλ σας.
    </Typography>
  )
  );
};

export default OwnerProfile;