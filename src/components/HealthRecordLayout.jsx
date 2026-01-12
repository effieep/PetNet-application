import React from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Paper,
  Button,
  IconButton
} from '@mui/material';

// Icons
import VisibilityIcon from '@mui/icons-material/Visibility';
import VaccinesIcon from '@mui/icons-material/Vaccines'; 
import HistoryEduIcon from '@mui/icons-material/HistoryEdu'; 
import PetsIcon from '@mui/icons-material/Pets'; 
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PrintIcon from '@mui/icons-material/Print'; 
import { FaBookMedical } from "react-icons/fa";

import { Link, useLocation, useNavigate } from 'react-router-dom';

const SIDEBAR_WIDTH = 280; 
const THEME_COLOR = '#1ea596'; // Το Τιρκουάζ

const HealthRecordLayout = ( {petData, children }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { 
      text: 'Προεπισκόπηση', 
      icon: <VisibilityIcon />, 
      path: `/healthRecord` 
    },
    { 
      text: 'Εμβολιασμοί & Αποπαρασιτώσεις', 
      icon: <VaccinesIcon />, 
      path: `/healthRecord/vaccinations` 
    },
    { 
      text: 'Ιστορικό Ιατρικών Πράξεων', 
      icon: <HistoryEduIcon />, 
      path: `/healthRecord/medicalHistory` 
    },
    { 
      text: 'Στοιχεία Ζώου', 
      icon: <PetsIcon />, 
      path: `/healthRecord/petInfo` 
    },
  ];

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', py: 4, minHeight: '100vh' }}>
      <Box
        sx={{
          display: 'flex',
          width: '100%',
          maxWidth: '100%',
          px: { xs: 2, md: 4 },
          gap: 4,
          flexDirection: { xs: 'column', md: 'row' }
        }}
      >
        {/* SIDEBAR */}
        <Box sx={{ width: { xs: '100%', md: SIDEBAR_WIDTH }, flexShrink: 0 }}>
          
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={(() => (localStorage.getItem("viewHealthRecordFrom") === "ownerPets") ? navigate('/owner/pets') : localStorage.getItem("viewHealthRecordFrom") === "viewHealth" ? navigate('/vet/manage-pets/view-health-record') : navigate('/vet/manage-pets/record-medical-action'))}
            sx={{ mb: 2, color: 'text.secondary', textTransform: 'none', fontWeight: 'bold' }}
          >
            {(localStorage.getItem("viewHealthRecordFrom") === "ownerPets") ? 'Πίσω στα Κατοικίδιά μου' : localStorage.getItem("viewHealthRecordFrom") === "viewHealth" ? 'Πίσω στην Προβολή Βιβλιαρίου Υγείας' : 'Πίσω στην Καταγραφή Ιατρικής Πράξης'}
          </Button>
          
          {/* Πληροφορίες Ζώου */}
          <Box sx={{ px: 2, mb: 3 }}>
             <Typography variant="body2" color="text.secondary">Είδος Ζώου - Όνομα</Typography>
             <Typography fontWeight="bold" sx={{ mb: 1 }}> {petData?.species} - {petData?.name}</Typography>

             <Typography variant="body2" color="text.secondary">Microchip</Typography>
             <Typography fontWeight="bold">{petData?.microchip}</Typography>
          </Box>

          <Paper
            elevation={0}
            sx={{
              p: 2,
              borderRadius: '20px',
              backgroundColor: 'white', // Λευκό φόντο για το μενού
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
            }}
          >
            {/* Τίτλος Μενού */}
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 2, px: 2, color: '#333', fontSize: '1rem' }}>
              ΜΕΝΟΥ ΒΙΒΛΙΑΡΙΟΥ
            </Typography>

            <List sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {menuItems.map((item) => {
                const isActive = location.pathname === item.path;

                return (
                  <ListItem key={item.text} disablePadding>
                    <ListItemButton
                      component={Link}
                      to={item.path}
                      selected={isActive}
                      state={{ pet: petData }}
                      sx={{
                        borderRadius: '12px',
                        py: 1.5,
                        px: 2,
                        transition: 'all 0.3s ease',
                        border: `1px solid ${isActive ? THEME_COLOR : 'transparent'}`,
                        backgroundColor: isActive ? THEME_COLOR : 'transparent',
                        color: isActive ? 'white' : 'text.primary',
                        
                        '&:hover': {
                          backgroundColor: isActive ? '#178a7d' : '#f0f0f0',
                        },
                        '&.Mui-selected': {
                          backgroundColor: THEME_COLOR,
                          color: 'white',
                          '&:hover': { backgroundColor: '#178a7d' },
                        },
                      }}
                    >
                      <ListItemIcon 
                        sx={{ 
                          minWidth: 35, 
                          color: isActive ? 'white' : THEME_COLOR 
                        }}
                      >
                        {item.icon}
                      </ListItemIcon>
                      <ListItemText
                        primary={item.text}
                        primaryTypographyProps={{
                          fontSize: '0.9rem',
                          fontWeight: isActive ? 'bold' : '500',
                        }}
                      />
                    </ListItemButton>
                  </ListItem>
                );
              })}
            </List>
          </Paper>
        </Box>

        {/* ΚΥΡΙΩΣ ΠΕΡΙΕΧΟΜΕΝΟ */}
        <Box sx={{ flex: 1 }}>
          <Paper
            elevation={0}
            sx={{
              maxWidth: '95%',
              minHeight: 600,
              p: { xs: 2, md: 4 },
              borderRadius: '30px', 
              backgroundColor: '#fffbe6', 
              border: '1px solid rgba(0,0,0,0.05)',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                maxWidth: '100%',
                justifyContent: 'center',
                alignItems: 'center',
                position: 'relative',
                backgroundColor: '#cbdcd9', 
                border: '1px solid #1ea596',
                borderRadius: '12px',
                py: 2,
                mb: 4,
                boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
              }}
            >
              <Typography variant="h5" 
                          fontWeight="bold" 
                          sx={{ 
                            color: '#2c3e50',
                            display: 'flex',      
                            alignItems: 'center',  
                            justifyContent: 'center', 
                            gap: 1.5               
                          }}
                        >
                <FaBookMedical />
                Βιβλιάριο Υγείας Ζώου
              </Typography>

              <Box sx={{ position: 'absolute', right: 16 }}>
                <IconButton sx={{ color: '#333' }}>
                    <PrintIcon />
                </IconButton>
              </Box>
            </Box>
            {children}
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default HealthRecordLayout;