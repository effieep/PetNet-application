import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, Grid, Paper, Divider, CircularProgress, Stack} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import { API_URL, supabase } from '../api';

const PetDetailsCard = ({ petId, edit = false }) => {
  const [pet, setPet] = useState(null);
  const [owner, setOwner] = useState(null);
  const [loading, setLoading] = useState(true);
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  const handleImageClick = () => {
    if (edit && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${petId}_${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;
      if(pet?.photoUrl && (pet.photoUrl !== '' || pet.photoUrl !== null || pet.photoUrl !== undefined)) {
        const oldFileName = pet.photoUrl.split('/').pop();
        const { error: deleteError } = await supabase.storage
          .from('pet-photos')
          .remove([oldFileName]);
        if (deleteError) console.warn("Failed to delete old image:", deleteError);
      }

      const { error: uploadError } = await supabase.storage
        .from('pet-photos') 
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('pet-photos')
        .getPublicUrl(filePath);

      const updateRes = await fetch(`${API_URL}/pets/${petId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ photoUrl: publicUrl })
      });

      if (!updateRes.ok) throw new Error("Failed to update pet record");

      setPet(prev => ({ ...prev, photoUrl: publicUrl }));

    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // 1. Κλήση για τα δεδομένα του κατοικιδίου
        const petRes = await fetch(`${API_URL}/pets/${petId}`);
        const petData = await petRes.json();
        setPet(petData);

        // 2. Κλήση για τα δεδομένα του ιδιοκτήτη
        const ownerRes = await fetch(`${API_URL}/users/${petData.ownerId}`);
        const ownerData = await ownerRes.json();
        setOwner(ownerData);
      } catch (error) {
        console.error("Σφάλμα κατά την ανάκτηση δεδομένων:", error);
      } finally {
        setLoading(false);
      }
    };

    if (petId) {
      fetchData();
    }
  }, [petId]);

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}><CircularProgress /></Box>;
  if (!pet) return null;

  return (
    <Paper 
      elevation={0} 
      sx={{ 
        p: 4, 
        maxWidth: 900,
        backgroundColor: '#F1D77A', 
        borderRadius: '20px', 
        border: '1px solid #000',
        mt: 3 // Προσθέτουμε λίγο κενό από τις πάνω κάρτες
      }}
    >
      <Grid container spacing={4}>
        {/* ΑΡΙΣΤΕΡΗ ΠΛΕΥΡΑ: ΣΤΟΙΧΕΙΑ ΖΩΟΥ */}
        <Grid item xs={12} md={7} sx={{ display: 'flex', gap: 3 }}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2 }}>{pet.name}</Typography>
            <Box 
              onClick={handleImageClick}
              sx={{ 
                width: 120, 
                height: 120, 
                border: '1px solid #000', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                position: 'relative',
                overflow: 'hidden',
                cursor: (edit && !uploading) ? 'pointer' : 'default',
                backgroundColor: '#fff',
                '&:hover .edit-overlay': { 
                    opacity: (edit && !uploading) ? 1 : 0 
                }
              }}
            >
                {uploading ? (
                  <CircularProgress size={30} sx={{ color: '#000' }} />
                ) : pet.photoUrl ? (
                  <img src={pet.photoUrl} alt={pet.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <CameraAltIcon sx={{ fontSize: 40 }} />
                )}

                {edit && !uploading && (
                  <Box
                    className="edit-overlay"
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      backgroundColor: 'rgba(0,0,0,0.5)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      opacity: 0,
                      transition: 'opacity 0.2s ease-in-out',
                    }}
                  >
                    <EditIcon sx={{ color: '#fff', fontSize: 30 }} />
                  </Box>
                )}
            </Box>

            <input 
              type="file" 
              ref={fileInputRef} 
              style={{ display: 'none' }} 
              accept="image/*" 
              onChange={handleFileChange}
            />
          </Box>

          <Box sx={{ flex: 1, minWidth: '250px', backgroundColor: 'rgba(255,255,255,0.2)', p: 2, borderRadius: '15px' }}>
            <Stack spacing={3}>
              <DetailRow label="Microchip:" value={pet.microchip} />
              <DetailRow label="Είδος:" value={pet.species} />
              <DetailRow label="Φύλο:" value={pet.gender || "Μη ορισμένο"} />
              <DetailRow label="Φυλή:" value={pet.breed || "Ημίαιμο"} />
              <DetailRow label="Ημ/νία Γέννησης:" value={pet.birthDate || "-"} />
              <DetailRow label="Βάρος:" value={pet.weight || "-"} />
              <DetailRow label="Χρώμα:" value={pet.color || "-"} />
            </Stack>
          </Box>
        </Grid>

        <Divider orientation="vertical" flexItem sx={{ borderColor: '#000', display: { xs: 'none', md: 'block' }, mx: 2 }} />

        {/* ΔΕΞΙΑ ΠΛΕΥΡΑ: ΣΤΟΙΧΕΙΑ ΙΔΙΟΚΤΗΤΗ */}
        <Grid item xs={12} md={4}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>{!pet.ownerId.startsWith('FILOZ-') ? 'Στοιχεία Ιδιοκτήτη' : 'Στοιχεία Φιλοζωϊκής'}</Typography>
          <OwnerField label={pet.ownerId.startsWith('FILOZ-') ? 'Όνομα Φιλοζωϊκής Οργάνωσης' : 'Ονοματεπώνυμο'} value={pet.ownerId.startsWith('FILOZ-') ? `${pet.ownerId.split('FILOZ-')[1]}` : `${owner?.name || ""} ${owner?.surname || ""}`} />
          {!pet.ownerId.startsWith('FILOZ-') && (  
          <>
            <OwnerField label="Τηλέφωνο επικοινωνίας" value={owner?.phone || "-"} />
            <OwnerField label="E-mail" value={owner?.email || "-"} />
            <OwnerField label="Διεύθυνση κατοικίας" value={owner?.street ? `${owner.street} ${owner.city}, ${owner.postalCode}` : "Δεν έχει οριστεί"} />
          </>
          )}
        </Grid>
      </Grid>
    </Paper>
  );
};

// Helper Components
export const DetailRow = ({ label, value }) => (
  <Box sx={{ display: 'flex', mb: 1.2 }}>
    <Typography sx={{ fontWeight: '600', minWidth: '160px' }}>{label}</Typography>
    <Typography>{value}</Typography>
  </Box>
);

export const OwnerField = ({ label, value }) => (
  <Box sx={{ mb: 2 }}>
    <Typography variant="caption" sx={{ fontWeight: 'bold', mb: 0.5, display: 'block' }}>{label}</Typography>
    <Box sx={{ backgroundColor: '#FFE58F', p: 1, borderRadius: '20px', border: '1px solid rgba(0,0,0,0.1)' }}>
      <Typography variant="body2">{value}</Typography>
    </Box>
  </Box>
);

export default PetDetailsCard;