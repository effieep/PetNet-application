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
  Divider,
} from '@mui/material';

import PersonIcon from '@mui/icons-material/Person';
import PetsIcon from '@mui/icons-material/Pets';
import AssignmentIcon from '@mui/icons-material/Assignment';
import EventIcon from '@mui/icons-material/Event';
import { FaGlobe } from 'react-icons/fa';
import { IoStarHalf } from 'react-icons/io5';

import { Link, useLocation } from 'react-router-dom';

const SIDEBAR_WIDTH = 260;

const ProfileLayout = ({ children, role = 'owner' }) => {
  const location = useLocation();

  const menuItems =
    role === 'vet'
      ? [
          { text: 'Τα στοιχεία μου', icon: <PersonIcon />, path: '/vet/info' },
          { text: 'Δημόσιο Προφίλ', icon: <FaGlobe  />, path: '/vet/public-profile' },
          { text: 'Iστορικό Ραντεβού', icon: <EventIcon  />, path: '/vet/randezvous-history' },
          { text: 'Οι αξιολογήσεις μου', icon: <IoStarHalf />, path: '/vet/reviews' },
        ]
      : [
          { text: 'Τα στοιχεία μου', icon: <PersonIcon />, path: '/owner/info' },
          { text: 'Τα κατοικίδιά μου', icon: <PetsIcon />, path: '/owner/pets' },
          { text: 'Οι δηλώσεις μου', icon: <AssignmentIcon />, path: '/owner/declarations' },
          { text: 'Τα ραντεβού μου', icon: <EventIcon />, path: '/owner/appointments' },
        ];

  return (
    <Box
     sx={{
        display: 'flex',
        justifyContent: 'center',
        py: 4,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          width: '100%',
          maxWidth: 1400,   // 👈 ΤΟ ΚΛΕΙΔΙ
          px: { xs: 2, md: 4 },
          gap: 3,
        }}
      >
         {/* SIDEBAR */}
        <Box
          sx={{
            width: SIDEBAR_WIDTH,
            flexShrink: 0,
          }}
        >
          <Paper
          elevation={0}
            sx={{
              height: '100%',
              borderRadius: '18px',
              backgroundColor: '#fbfbf7',
              border: '1px solid rgba(58, 78, 27, 0.18)',
              boxShadow: '0 10px 30px rgba(0,0,0,0.06)',}}
          >
            <Box sx={{ p: 2 }}>
              <Typography variant="h6" fontWeight="bold">
                Το προφίλ μου
              </Typography>
            </Box>

            <Divider />

            <List>
              {menuItems.map((item) => {
                const isActive = location.pathname === item.path;

                return (
                  <ListItem key={item.text} disablePadding>
                    <ListItemButton
                      component={Link}
                      to={item.path}
                      selected={isActive}
                      sx={{
                        px: 2.5,
                        py: 1.5,
                        '&.Mui-selected': {
                          backgroundColor: 'rgba(154, 155, 106, 0.12)',
                          borderRight: '4px solid #9a9b6a',
                        },
                        '&:hover': {
                          backgroundColor: 'rgba(154, 155, 106, 0.08)',
                        },
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 40, color: '#9a9b6a' }}>
                        {item.icon}
                      </ListItemIcon>
                      <ListItemText
                        primary={item.text}
                        primaryTypographyProps={{
                          fontSize: '0.95rem',
                          fontWeight: isActive ? 'bold' : 'normal',
                        }}
                      />
                    </ListItemButton>
                  </ListItem>
                );
              })}
            </List>
          </Paper>
        </Box>

        {/* MAIN CONTENT */}
       <Box
          sx={{
            flex: 1,
            display: 'flex',
          }}
        >
          <Paper
            elevation={10}
            sx={{
              width: '100%',
              p: { xs: 2, md: 4 },
              borderRadius: '18px',
              backgroundColor: '#fbfbf7',
              // backgroundImage: `url('/pet-pattern.jpg')`,
              border: '1px solid rgba(58, 78, 27, 0.18)',
              boxShadow: '0 10px 30px rgba(0,0,0,0.06)',

            }}
          >
            {children}
          </Paper>
        </Box>
      </Box>
     
    </Box>
  );
};

export default ProfileLayout;
