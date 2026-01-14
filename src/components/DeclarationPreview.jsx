import React from 'react';
import { Modal, Box, IconButton, Typography, Backdrop, Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import LocationOnIcon from '@mui/icons-material/LocationOn';

// Μικρό βοηθητικό component για τα χρωματιστά κουτάκια κειμένου
const DataBox = ({ text, bgColor = "#f1e9c9", height = 34 }) => (
    <Box 
        sx={{ 
            minHeight: height, 
            borderRadius: 1.2, 
            backgroundColor: bgColor, 
            display: 'flex', 
            alignItems: 'center', 
            px: 1.5, 
            py: 0.5 
        }}
    >
        <Typography sx={{ fontWeight: 600, fontSize: 13, wordBreak: 'break-word', color: '#333' }}>
            {text || "-"}
        </Typography>
    </Box>
);

const DeclarationPreview = ({ open, onClose, declaration, foundOnClick }) => {
    // Αν δεν υπάρχει δήλωση, δεν δείχνουμε τίποτα (για ασφάλεια)
    if (!declaration) return null;

    // 1. ΑΝΑΓΝΩΡΙΣΗ ΤΥΠΟΥ (LOSS ή FOUND)
    const isLoss = declaration.type === 'LOSS';
    const titleLabel = isLoss ? "Δήλωση Απώλειας" : "Δήλωση Εύρεσης";
    
    // 2. ΕΠΙΛΟΓΗ ΣΩΣΤΩΝ ΠΕΔΙΩΝ
    // Στο Loss είναι lostDate, στο Found είναι foundDate
    const date = isLoss ? declaration.lostDate : declaration.foundDate;
    const time = isLoss ? declaration.lostTime : declaration.foundTime;

    // Στοίχιση δεδομένων τοποθεσίας (παίρνουμε το πρώτο μέρος της διεύθυνσης για συντομία)
    const fullAddress = declaration.location?.address || "";
    const displayAddress = fullAddress.split(',').slice(0, 2).join(',') || "Άγνωστη τοποθεσία";

    // Στοιχεία Ζώου & Φωτογραφία
    // Υποθέτουμε ότι το parent component έχει κάνει join το pet object
    const pet = declaration.pet || {};
    // Αν υπάρχει φωτογραφία στο array, παίρνουμε την πρώτη
    const photoUrl = pet.photos && pet.photos.length > 0 ? pet.photos[0] : null;

    // Στοιχεία Επικοινωνίας
    const contact = declaration.contact || {};

    return (
        <Modal
            open={open}
            onClose={onClose}
            closeAfterTransition
            slots={{ backdrop: Backdrop }}
            slotProps={{
                backdrop: {
                    sx: { backgroundColor: "rgba(0,0,0,0.4)", backdropFilter: "blur(4px)" },
                },
            }}
        >
            <Box 
                sx={{ 
                    minHeight: "100vh", 
                    display: "flex", 
                    alignItems: "center", 
                    justifyContent: "center", 
                    p: { xs: 2, md: 3 },
                    outline: 'none' 
                }}
            >
                <Box
                    onClick={(e) => e.stopPropagation()} // Για να μην κλείνει αν πατήσεις μέσα στο κουτί
                    sx={{
                        width: "100%", 
                        maxWidth: 900, 
                        backgroundColor: "#ffffff",
                        borderRadius: 2, 
                        border: "1px solid #ccc",
                        boxShadow: "0 10px 30px rgba(0,0,0,0.2)", 
                        position: "relative",
                        p: { xs: 2, md: 4 }, 
                        maxHeight: '90vh', 
                        overflowY: 'auto'
                    }}
                >
                    {/* Κουμπί Κλεισίματος */}
                    <IconButton 
                        onClick={onClose} 
                        sx={{ 
                            position: "absolute", 
                            top: 10, 
                            left: 10, 
                            border: "1px solid #ccc",
                            bgcolor: '#fff',
                            '&:hover': { bgcolor: '#f5f5f5' }
                        }}
                    >
                        <CloseIcon />
                    </IconButton>

                    {/* ΤΙΤΛΟΣ */}
                    <Typography sx={{ fontWeight: 900, fontSize: 24, textAlign: 'center', mb: 4, mt: 1, color: '#333' }}>
                        {titleLabel}
                    </Typography>

                    {/* GRID: ΔΥΟ ΣΤΗΛΕΣ (Αριστερά Φώτο/Info, Δεξιά Pet Details/Contact) */}
                    <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "350px 1fr" }, gap: 4, alignItems: "start" }}>
                        
                        {/* --- ΑΡΙΣΤΕΡΗ ΣΤΗΛΗ --- */}
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                            
                            {/* Κουτί Φωτογραφίας */}
                            <Box 
                                sx={{ 
                                    height: 240, 
                                    border: "1px solid #999", 
                                    backgroundColor: "#f4f1e5", 
                                    display: "flex", 
                                    alignItems: "center", 
                                    justifyContent: "center", 
                                    overflow: 'hidden',
                                    borderRadius: 1
                                }}
                            >
                                {photoUrl ? (
                                    <Box 
                                        component="img" 
                                        src={photoUrl} 
                                        alt="Pet" 
                                        sx={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                                    />
                                ) : (
                                    <Typography sx={{ fontWeight: 800, fontSize: 13, color: '#666' }}>
                                        Χωρίς Φωτογραφία
                                    </Typography>
                                )}
                            </Box>

                            {/* Κουτί Βασικών Πληροφοριών */}
                            <Box sx={{ border: "1px solid #ccc", borderRadius: 2, p: 2 }}>
                                
                                {/* Ημερομηνία & Ώρα */}
                                <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2, mb: 2 }}>
                                    <Box>
                                        <Typography sx={{ fontSize: 12, fontWeight: 800, mb: 0.5 }}>Ημερομηνία</Typography>
                                        <DataBox text={date} />
                                    </Box>
                                    <Box>
                                        <Typography sx={{ fontSize: 12, fontWeight: 800, mb: 0.5 }}>Ώρα</Typography>
                                        <DataBox text={time} />
                                    </Box>
                                </Box>

                                {/* Περιοχή */}
                                <Typography sx={{ fontSize: 12, fontWeight: 800, mb: 0.5 }}>Περιοχή</Typography>
                                <Box 
                                    sx={{ 
                                        minHeight: 34, 
                                        borderRadius: 1.2, 
                                        backgroundColor: "#f1e9c9", 
                                        display: "flex", 
                                        alignItems: "center", 
                                        gap: 1, 
                                        px: 1.5, 
                                        mb: 2, 
                                        py: 0.5 
                                    }}
                                >
                                    <LocationOnIcon fontSize="small" sx={{ opacity: 0.7 }} />
                                    <Typography sx={{ fontSize: 13, fontWeight: 600 }}>{displayAddress}</Typography>
                                </Box>

                                {/* Περιγραφή */}
                                <Typography sx={{ fontSize: 12, fontWeight: 800, mb: 0.5 }}>Περιγραφή / Σχόλια</Typography>
                                <DataBox text={declaration.description} height={60} />
                            </Box>
                        </Box>

                        {/* --- ΔΕΞΙΑ ΣΤΗΛΗ --- */}
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                            
                            {/* Στοιχεία Κατοικιδίου */}
                            <Box>
                                <Typography sx={{ fontWeight: 900, fontSize: 18, mb: 2, borderBottom: '2px solid #f1e9c9', display: 'inline-block' }}>
                                    Στοιχεία Κατοικιδίου
                                </Typography>
                                
                                {/* Είδος & Φύλο */}
                                <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2, mb: 2 }}>
                                    <Box>
                                        <Typography sx={{ fontSize: 12, fontWeight: 800, mb: 0.5 }}>Είδος</Typography>
                                        <DataBox text={declaration.petType || pet.species} bgColor="#fbf3d6" />
                                    </Box>
                                    <Box>
                                        <Typography sx={{ fontSize: 12, fontWeight: 800, mb: 0.5 }}>Φύλο</Typography>
                                        <DataBox text={pet.gender} bgColor="#fbf3d6" />
                                    </Box>
                                </Box>

                                {/* Φυλή */}
                                <Typography sx={{ fontSize: 12, fontWeight: 800, mb: 0.5 }}>Φυλή</Typography>
                                <DataBox text={pet.breed} bgColor="#fbf3d6" />
                                <Box sx={{ height: 16 }} />

                                {/* Χρώμα & Μέγεθος */}
                                <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
                                    <Box>
                                        <Typography sx={{ fontSize: 12, fontWeight: 800, mb: 0.5 }}>Χρώμα</Typography>
                                        <DataBox text={pet.color} bgColor="#fbf3d6" />
                                    </Box>
                                    <Box>
                                        <Typography sx={{ fontSize: 12, fontWeight: 800, mb: 0.5 }}>Μέγεθος</Typography>
                                        <DataBox text={pet.size} bgColor="#fbf3d6" />
                                    </Box>
                                </Box>
                            </Box>

                            {/* Στοιχεία Επικοινωνίας */}
                            <Box sx={{display: "flex", flexDirection: "column"}}>
                                <Typography sx={{ fontWeight: 900, fontSize: 18, mb: 2, borderBottom: '2px solid #eef0d2', display: 'inline-block' }}>
                                    Στοιχεία Επικοινωνίας
                                </Typography>
                                
                                <Typography sx={{ fontSize: 12, fontWeight: 800, mb: 0.5 }}>Όνομα</Typography>
                                <DataBox text={contact.name} bgColor="#eef0d2" />
                                <Box sx={{ height: 16 }} />

                                <Typography sx={{ fontSize: 12, fontWeight: 800, mb: 0.5 }}>Τηλέφωνο</Typography>
                                <DataBox text={contact.phone} bgColor="#eef0d2" />
                                <Box sx={{ height: 16 }} />

                                <Typography sx={{ fontSize: 12, fontWeight: 800, mb: 0.5 }}>Email</Typography>
                                <DataBox text={contact.email} bgColor="#eef0d2" />
                                <Button
                                  variant='contained'
                                  onClick={foundOnClick}
                                  sx={{display: (isLoss && declaration.status === "SUBMITTED") ? 'block' : 'none', mt: 3, alignSelf: 'center', textTransform: 'none', backgroundColor: '#4caf50', '&:hover': {backgroundColor: '#45a040'}, borderRadius: 2}}
                                >
                                    Το κατοικίδιο βρέθηκε
                                </Button>
                            </Box>
                        </Box>

                    </Box>
                </Box>
            </Box>
        </Modal>
    );
};

export default DeclarationPreview;