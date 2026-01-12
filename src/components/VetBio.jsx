import React from 'react';
import { 
  Box, Typography, Grid, Paper, List, ListItem, ListItemIcon, ListItemText, Divider 
} from '@mui/material';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import SchoolIcon from '@mui/icons-material/School'; // Εικονίδιο για Σπουδές
import WorkIcon from '@mui/icons-material/Work';     // Εικονίδιο για Εμπειρία
import CircleIcon from '@mui/icons-material/Circle'; // Μικρή τελεία για λίστα


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
    <Box sx={{ width: '100%', mx: 'auto', px: 2, py: 4 }}>
        
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

        <Grid container spacing={3} sx={{ width: '100%'}}>
            
            {/* --- ΣΠΟΥΔΕΣ --- */}
            <Grid item md={6} sx={{ minWidth: 0 }}>
                <Paper 
                    elevation={2} 
                    sx={{ 
                        borderRadius: 3, 
                        overflow: 'hidden', // Για να κόβει τις γωνίες του Header
                        height: '100%',
                        display: 'flex', flexDirection: 'column',
                        width: '100%',
                        maxWidth: '520px' 
                    }}
                >
                    {/* Header Κάρτας */}
                    <Box sx={{ 
                        bgcolor: '#6D5D4B', // Σκούρο καφέ (ίδιο με active tab)
                        py: 2, px: 3, 
                        display: 'flex', alignItems: 'center', gap: 2 
                    }}>
                        <SchoolIcon sx={{ color: '#E8D58E', fontSize: 28 }} /> {/* Χρυσό εικονίδιο */}
                        <Typography variant="h6" fontWeight="bold" color="white">
                            Σπουδές
                        </Typography>
                    </Box>

                    {/* Περιεχόμενο */}
                    <Box sx={{ p: 3, bgcolor: '#fff', flexGrow: 1 }}>
                        <List>
                            {vet.degreeInst && (
                                <StyledListItem 
                                    text={<span>Πτυχίο Κτηνιατρικής από <strong>{vet.degreeInst}</strong></span>}
                                    subtext={`Έτος αποφοίτησης: ${vet.DgraduationYear}`}
                                />
                            )}
                            {vet.masterInst && (
                                <>
                                    <Divider variant="inset" component="li" sx={{ my: 1 }} />
                                    <StyledListItem 
                                        text={<span>Μεταπτυχιακό στο <strong>{vet.masterInst}</strong></span>}
                                        subtext={`Έτος: ${vet.MgraduationYear}`}
                                    />
                                </>
                            )}
                            {vet.phdInst && (
                                <>
                                    <Divider variant="inset" component="li" sx={{ my: 1 }} />
                                    <StyledListItem 
                                        text={<span>Διδακτορικό στο <strong>{vet.phdInst}</strong></span>}
                                    />
                                </>
                            )}
                        </List>
                    </Box>
                </Paper>
            </Grid>

            {/* --- ΕΠΑΓΓΕΛΜΑΤΙΚΗ ΕΜΠΕΙΡΙΑ --- */}
            <Grid item md={6} sx={{ minWidth: 0 }}>
                <Paper 
                    elevation={3} 
                    sx={{ 
                        borderRadius: 3, 
                        overflow: 'hidden',
                        height: '100%',
                        display: 'flex', flexDirection: 'column',
                        width: '100%',
                        maxWidth: '520px' 
                    }}
                >
                    {/* Header Κάρτας */}
                    <Box sx={{ 
                        bgcolor: '#6D5D4B', 
                        py: 2, px: 3, 
                        display: 'flex', alignItems: 'center', gap: 2 
                    }}>
                        <WorkIcon sx={{ color: '#E8D58E', fontSize: 28 }} />
                        <Typography variant="h6" fontWeight="bold" color="white">
                            Επαγγελματική εμπειρία
                        </Typography>
                    </Box>

                    {/* Περιεχόμενο */}
                    <Box sx={{ p: 3, bgcolor: '#fff', flexGrow: 1 }}>
                        <List>
                            {jobsArray.length > 0 ? (
                                jobsArray.map((job, index) => (
                                    <React.Fragment key={index}>
                                        {index > 0 && <Divider variant="inset" component="li" sx={{ my: 1 }} />}
                                        <StyledListItem 
                                            text={<span><strong>{job.role}</strong> στην {job.company}</span>}
                                            subtext={`${job.startYear} - ${job.endYear}`}
                                        />
                                    </React.Fragment>
                                ))
                            ) : (
                                <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic', textAlign: 'center', mt: 2 }}>
                                    Δεν υπάρχουν καταχωρημένες πληροφορίες.
                                </Typography>
                            )}
                        </List>
                    </Box>
                </Paper>
            </Grid>
        </Grid>

        {/* 3. ΥΠΗΡΕΣΙΕΣ (GRID 3 ΣΤΗΛΕΣ) */}
        <Box sx={{ mt: 6 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ mb: 3 }}>
                Παρεχόμενες υπηρεσίες
            </Typography>
        </Box>
        
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

// --- Helper Component: Στυλιζαρισμένο Item Λίστας ---
const StyledListItem = ({ text, subtext }) => (
    <ListItem alignItems="flex-start" sx={{ px: 0 }}>
        <ListItemIcon sx={{ minWidth: '30px', mt: 0.5 }}>
            <CircleIcon sx={{ fontSize: 12, color: '#E8D58E' }} /> {/* Χρυσή τελεία */}
        </ListItemIcon>
        <ListItemText 
            primary={<Typography variant="body1" sx={{ color: '#333' }}>{text}</Typography>}
            secondary={subtext && (
                <Typography variant="body2" sx={{ color: '#666', mt: 0.5, fontWeight: 500 , wordBreak: 'break-word'}}>
                </Typography>
            )}
        />
    </ListItem>
);

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