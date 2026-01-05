import React from 'react';
import { 
  Box, 
  Container, 
  Grid, 
  List, 
  ListItem, 
  ListItemButton, 
  ListItemIcon, 
  ListItemText, 
  Typography, 
  Paper,
  Divider
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import PetsIcon from '@mui/icons-material/Pets';
import AssignmentIcon from '@mui/icons-material/Assignment';
import EventIcon from '@mui/icons-material/Event';
import SettingsIcon from '@mui/icons-material/Settings';

const ProfileLayout = ({ children, role }) => {
  
  // Ορίζουμε τα menu items ανάλογα με το ρόλο
  const menuItems = role === 'vet' ? [
    { text: 'Τα στοιχεία μου', icon: <PersonIcon />, path: '/vet/profile' },
    { text: 'Δημόσιο Προφίλ', icon: <SettingsIcon />, path: '/vet/public-profile' },
    { text: 'Διαχείριση Ραντεβού', icon: <EventIcon />, path: '/vet/appointments' },
    { text: 'Διαχείριση Ζώων', icon: <PetsIcon />, path: '/vet/animals' },
  ] : [
    { text: 'Τα στοιχεία μου', icon: <PersonIcon />, path: '/owner/profile' },
    { text: 'Τα κατοικίδιά μου', icon: <PetsIcon />, path: '/owner/pets' },
    { text: 'Οι δηλώσεις μου', icon: <AssignmentIcon />, path: '/owner/declarations' },
    { text: 'Τα ραντεβού μου', icon: <EventIcon />, path: '/owner/appointments' },
  ];

  return (
    <Container sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        
        {/* Sidebar - Αριστερή Στήλη */}
        <Grid item xs={12} md={3}>
          <Paper elevation={0} sx={{ border: '1px solid #0f4b32ff', borderRadius: 2 }}>
            <Box sx={{ p: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                Το προφίλ μου
              </Typography>
            </Box>
            <Divider />
            <List>
              {menuItems.map((item) => (
                <ListItem key={item.text} disablePadding>
                  <ListItemButton>
                    <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
                    <ListItemText primary={item.text} primaryTypographyProps={{ fontSize: '0.9rem' }} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Main Content - Δεξιά Στήλη */}
        <Grid item xs={12} md={9}>
          <Paper elevation={0} sx={{ p: 3, border: '1px solid #3a4e1bff', borderRadius: 2 , backgroundColor: '#ffffffff'}}>
            {children}
          </Paper>
        </Grid>

      </Grid>
    </Container>
  );
};

export default ProfileLayout;