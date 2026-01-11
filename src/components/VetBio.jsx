import React from 'react';
import { 
  Box, Typography, Grid, Paper, List, ListItem, ListItemIcon, ListItemText 
} from '@mui/material';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord'; // Η τελεία (bullet)
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';

// Λεξικό για μετάφραση των services από το JSON στα Ελληνικά
const serviceTranslations = {
  // Services
  general: "Γενικός έλεγχος υγείας",
  vacinations: "Εμβόλια / Προληπτική φροντίδα", // Προσοχή στο typo του JSON (vacinations αντί vaccinations)
  nutrition: "Διατροφική συμβουλευτική",
  consulting: "Συμβουλές συμπεριφοράς",
  
  // Diagnostics
  blood: "Αιματολογικές / Βιοχημικές αναλύσεις",
  xrays: "Ακτινογραφίες / Υπέρηχοι",
  odontology: "Οδοντιατρικός έλεγχος",
  other: "Άλλες διαγνωστικές εξετάσεις",
  
  // Surgeries
  generalSurgery: "Γενικές χειρουργικές επεμβάσεις", 
  castration: "Στειρώσεις / Αναπαραγωγή",
  emergency: "Επείγοντα περιστατικά"
};

const VetBio = ({ vet }) => {
  
  // Μετατροπή των jobs από Object σε Array για να κάνουμε map
  const jobsArray = vet.jobs ? Object.values(vet.jobs) : [];

  return (
    <Box sx={{ maxWidth: '100%', mx: 'auto', px: 2, py: 4 }}>
        
        {/* 1. ΜΕΡΙΚΑ ΛΟΓΙΑ ΓΙΑ ΤΟΝ ΕΙΔΙΚΟ */}
        <Box sx={{ mb: 4 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
                Μερικά λόγια για τον/την ειδικό
            </Typography>
            <Typography variant="body1" sx={{ lineHeight: 1.8, color: '#333' }}>
                {/* Αφαιρούμε τα εισαγωγικά αν υπάρχουν στο string */}
                {vet.description ? vet.description.replace(/^"|"$/g, '') : "Δεν υπάρχει διαθέσιμη περιγραφή."}
            </Typography>
        </Box>

        <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ mb: 2 }}>
            Βιογραφικό
        </Typography>

        {/* 2. ΣΠΟΥΔΕΣ & ΕΜΠΕΙΡΙΑ (GRID) */}
        <Grid container spacing={4} sx={{ mb: 6 }}>
            
            {/* Αριστερά: Σπουδές */}
            <Grid item xs={12} md={6}>
                <Paper 
                    elevation={0} 
                    sx={{ 
                        bgcolor: '#F3F6E0', // Το ανοιχτό πράσινο/μπεζ του screenshot
                        p: 3, 
                        borderRadius: 2,
                        height: '100%' 
                    }}
                >
                    <Typography variant="subtitle1" fontWeight="bold" textAlign="center" gutterBottom>
                        Σπουδές
                    </Typography>
                    <List dense>
                        {/* Πτυχίο */}
                        {vet.degreeInst && (
                            <ListItem alignItems="flex-start" sx={{ px: 0 }}>
                                <ListItemIcon sx={{ minWidth: '24px', mt: 1 }}>
                                    <FiberManualRecordIcon sx={{ fontSize: 10, color: '#333' }} />
                                </ListItemIcon>
                                <ListItemText 
                                    primary={
                                        <span>
                                            Πτυχίο Κτηνιατρικής από το <strong>{vet.degreeInst}</strong> ({vet.DgraduationYear})
                                        </span>
                                    } 
                                />
                            </ListItem>
                        )}
                        
                        {/* Μεταπτυχιακό */}
                        {vet.masterInst && (
                            <ListItem alignItems="flex-start" sx={{ px: 0 }}>
                                <ListItemIcon sx={{ minWidth: '24px', mt: 1 }}>
                                    <FiberManualRecordIcon sx={{ fontSize: 10, color: '#333' }} />
                                </ListItemIcon>
                                <ListItemText 
                                    primary={
                                        <span>
                                            Μεταπτυχιακές σπουδές στο <strong>{vet.masterInst}</strong> ({vet.MgraduationYear})
                                        </span>
                                    } 
                                />
                            </ListItem>
                        )}

                        {/* Διδακτορικό */}
                        {vet.phdInst && (
                            <ListItem alignItems="flex-start" sx={{ px: 0 }}>
                                <ListItemIcon sx={{ minWidth: '24px', mt: 1 }}>
                                    <FiberManualRecordIcon sx={{ fontSize: 10, color: '#333' }} />
                                </ListItemIcon>
                                <ListItemText 
                                    primary={
                                        <span>
                                            Διδακτορικό στο <strong>{vet.phdInst}</strong>
                                        </span>
                                    } 
                                />
                            </ListItem>
                        )}
                    </List>
                </Paper>
            </Grid>

            {/* Δεξιά: Επαγγελματική Εμπειρία */}
            <Grid item xs={12} md={6}>
                <Paper 
                    elevation={0} 
                    sx={{ 
                        bgcolor: '#F3F6E0', 
                        p: 3, 
                        borderRadius: 2,
                        height: '100%' 
                    }}
                >
                    <Typography variant="subtitle1" fontWeight="bold" textAlign="center" gutterBottom>
                        Επαγγελματική εμπειρία
                    </Typography>
                    <List dense>
                        {jobsArray.length > 0 ? (
                            jobsArray.map((job, index) => (
                                <ListItem key={index} alignItems="flex-start" sx={{ px: 0 }}>
                                    <ListItemIcon sx={{ minWidth: '24px', mt: 1 }}>
                                        <FiberManualRecordIcon sx={{ fontSize: 10, color: '#333' }} />
                                    </ListItemIcon>
                                    <ListItemText 
                                        primary={
                                            <span>
                                                <strong>{job.role}</strong> στην {job.company}
                                            </span>
                                        }
                                        secondary={`${job.startYear} - ${job.endYear}`}
                                    />
                                </ListItem>
                            ))
                        ) : (
                            <Typography variant="body2" sx={{ mt: 2, textAlign: 'center' }}>
                                Δεν έχουν καταχωρηθεί πληροφορίες.
                            </Typography>
                        )}
                    </List>
                </Paper>
            </Grid>
        </Grid>

        {/* 3. ΥΠΗΡΕΣΙΕΣ (GRID 3 ΣΤΗΛΕΣ) */}
        <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ mb: 3 }}>
            Παρεχόμενες υπηρεσίες
        </Typography>
        
        <Grid container spacing={3}>
            {/* Κάρτα 1: Προληπτική */}
            <Grid item xs={12} md={4}>
                <ServiceCard title="Προληπτική Υγεία και Φροντίδα" servicesObj={vet.services} />
            </Grid>
            {/* Κάρτα 2: Διαγνωστικές */}
            <Grid item xs={12} md={4}>
                <ServiceCard title="Διαγνωστικές Εξετάσεις" servicesObj={vet.diagnostics} />
            </Grid>
            {/* Κάρτα 3: Χειρουργικές */}
            <Grid item xs={12} md={4}>
                <ServiceCard title="Χειρουργικές επεμβάσεις" servicesObj={vet.surgeries} />
            </Grid>
        </Grid>

    </Box>
  );
};

// --- HELPER COMPONENT: Κάρτα Υπηρεσιών ---
const ServiceCard = ({ title, servicesObj }) => {
    if (!servicesObj) return null;

    return (
        <Paper 
            elevation={0} 
            sx={{ 
                bgcolor: '#FFF', // Λευκό φόντο όπως στο screenshot
                p: 3, 
                borderRadius: 2, 
                height: '100%',
                border: '1px solid #f0f0f0' // Διακριτικό περίγραμμα
            }}
        >
            <Typography variant="subtitle2" fontWeight="bold" textAlign="center" gutterBottom sx={{ mb: 2 }}>
                {title}
            </Typography>
            <List dense sx={{ p: 0 }}>
                {Object.keys(servicesObj).map((key) => {
                    const isProvided = servicesObj[key];
                    const label = serviceTranslations[key] || key;
                    
                    return (
                        <ListItem key={key} disablePadding sx={{ mb: 1.5, alignItems: 'flex-start' }}>
                            <ListItemIcon sx={{ minWidth: '32px', mt: -0.5 }}>
                                {isProvided 
                                    ? <CheckBoxIcon sx={{ color: '#000' }} /> // Μαύρο τικ για true
                                    : <CheckBoxOutlineBlankIcon sx={{ color: '#ccc' }} /> // Γκρι για false
                                }
                            </ListItemIcon>
                            <ListItemText 
                                primary={label} 
                                primaryTypographyProps={{ 
                                    variant: 'body2', 
                                    color: isProvided ? 'textPrimary' : 'textSecondary',
                                    fontWeight: isProvided ? 500 : 400,
                                    lineHeight: 1.3
                                }}
                            />
                        </ListItem>
                    );
                })}
            </List>
        </Paper>
    );
};

export default VetBio;