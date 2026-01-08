import React, { useState, useEffect } from "react";
import { Box, Typography, CircularProgress, Alert, Button, Snackbar } from "@mui/material";
import { useAuth } from "../../auth/AuthContext";
import ProfileLayout from "../../components/profileLayout";
import VetPublicInfoCard from "../../components/VetPublicInfoCard";
import { supabase, API_URL } from "../../api";

const VetProfile = () => {
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success', // 'success' | 'error'
  });

  const [userData, setUserData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [errors, setErrors] = useState({});
  
  // Queue of old pictures to delete on save
  const [picsToDelete, setPicsToDelete] = useState([]);
  // Temp pics uploaded in current edit session (for cancel)
  const [tempPics, setTempPics] = useState([]);

  const { user, isLoggedIn } = useAuth();

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  // Normalize jobs
  const normalizeJobs = (jobs) => {
    if (!jobs) return {};
    const filtered = Object.entries(jobs).reduce((acc, [key, job]) => {
      if (Object.values(job).some(v => v !== "" && v !== null && v !== undefined)) {
        acc[key] = job;
      }
      return acc;
    }, {});
    return Object.keys(filtered).length > 0 ? filtered : null;
  };

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`${API_URL}/users/${user.id}`);
        const data = await response.json();
        setUserData({
          ...data,
          jobs: data.jobs || { "job-0": { role: "", company: "", startYear: "", endYear: "" } },
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    if (user?.id) fetchUserData();
  }, [user]);

  // Handle input changes
  const handleChange = async (e) => {
    const { name, value, checked, type } = e.target;

    // ================= PROFILE PIC =================
    if (name === 'profilePic') {
      const file = e.target.files?.[0];
      if (!file) return;

      // Queue old pic for deletion on save
      if (userData?.profilePic) {
        setPicsToDelete(prev => [...prev, userData.profilePic]);
      }

      // Upload new file
      const fileExt = file.name.split('.').pop();
      const newFileName = `${user.id}_${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('profile-pics')
        .upload(newFileName, file);

      if (uploadError) {
        console.error("Upload error:", uploadError);
        showSnackbar("Σφάλμα κατά την αποθήκευση εικόνας!", "error");
        return;
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('profile-pics')
        .getPublicUrl(newFileName);

      // Track temp pic for cancel
      setTempPics(prev => [...prev, urlData.publicUrl]);

      // Update state
      setUserData(prev => ({
        ...prev,
        profilePic: urlData.publicUrl
      }));

      return;
    }

    // ================= ADD JOB =================
    if (name === '__ADD_JOB__') {
      setUserData(prev => {
        const keys = Object.keys(prev.jobs || {});
        const newKey = `job-${keys.length}`;
        return {
          ...prev,
          jobs: { ...prev.jobs, [newKey]: { role: "", company: "", startYear: "", endYear: "" } }
        };
      });
      return;
    }

    // ================= REMOVE JOB =================
    if (name === '__REMOVE_JOB__') {
      setUserData(prev => {
        const keys = Object.keys(prev.jobs || {});
        if (keys.length <= 1) return prev;
        const lastKey = keys[keys.length - 1];
        const { [lastKey]: _, ...rest } = prev.jobs;
        return { ...prev, jobs: rest };
      });
      return;
    }

    // ================= SPECIALIZATION =================
    if (name.startsWith('specialization.')) {
      const spec = name.split('.')[1];
      setUserData(prev => {
        const current = Array.isArray(prev.specialization) ? prev.specialization : [];
        return { ...prev, specialization: checked ? [...current, spec] : current.filter(s => s !== spec) };
      });
      return;
    }

    // ================= NESTED FIELDS =================
    if (name.includes('.')) {
      const [group, field] = name.split('.');
      if (group.startsWith('job-')) {
        setUserData(prev => ({
          ...prev,
          jobs: { ...prev.jobs, [group]: { ...prev.jobs[group], [field]: value } }
        }));
        return;
      }
      setUserData(prev => ({
        ...prev,
        [group]: { ...prev[group], [field]: type === 'checkbox' ? checked : value }
      }));
      return;
    }

    // ================= NORMAL FIELD =================
    setUserData(prev => ({ ...prev, [name]: value }));
  };

  // Cancel edits
  const handleCancel = async () => {
    setIsEditing(false);
    setErrors({});

    // Delete any temp pics uploaded in this session
    for (const url of tempPics) {
      try {
        const filePath = new URL(url).pathname.split('/').pop();
        if (filePath) {
          const { error } = await supabase.storage.from('profile-pics').remove([filePath]);
          if (error) console.error("Error deleting temp profile pic:", error);
        }
      } catch (err) {
        console.error("Failed to delete temp profile pic:", err);
      }
    }
    setTempPics([]);
    setPicsToDelete([]);

    // Revert state to DB
    try {
      const response = await fetch(`${API_URL}/users/${user.id}`);
      const data = await response.json();
      setUserData(data);
    } catch (err) {
      setError(err.message);
    }
  };

  // Save edits
  const handleSave = async () => {

    const dataToSave = { ...userData, jobs: normalizeJobs(userData.jobs) };

    try {
      const response = await fetch(`${API_URL}/users/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSave),
      });

      if (response.ok) {
        // Delete old queued pics
        for (const url of picsToDelete) {
          try {
            const filePath = new URL(url).pathname.split('/').pop();
            if (filePath) {
              const { error } = await supabase.storage.from('profile-pics').remove([filePath]);
              if (error) console.error("Error deleting old profile pic:", error);
            }
          } catch (err) {
            console.error("Failed to delete old profile pic:", err);
          }
        }

        setPicsToDelete([]);
        setTempPics([]);
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

  return (isLoggedIn && userData?.role === "vet") ? (
    <>
      <ProfileLayout role={userData?.role || "vet"}>
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
          <Typography variant="h5" sx={{ mb: 4, fontWeight: "bold", color: "#373721" }}>
            Στοιχεία Προφίλ Κτηνίατρου
          </Typography>

          <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
            <VetPublicInfoCard
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
        autoHideDuration={3000}
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
  ) : (
    <Typography variant="h6" color="error" textAlign="center" sx={{ mt: 10 }}>
      Παρακαλώ συνδεθείτε ως Κτηνίατρος για να δείτε το προφίλ σας.
    </Typography>
  );
};

export default VetProfile;
