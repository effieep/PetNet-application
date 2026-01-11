import { Typography, Box, Button } from '@mui/material';
import { TbVaccine } from 'react-icons/tb';
import { FaEyeDropper } from 'react-icons/fa';
import { LiaNotesMedicalSolid } from 'react-icons/lia';
import { LuPillBottle } from 'react-icons/lu';
import { PiScissorsBold  } from 'react-icons/pi';
import {Link, useLocation} from 'react-router-dom';

const actions = [
    { label: 'Εμβολιασμός', icon: <TbVaccine />, path: '/vet/manage-pets/record-medical-action/record-vaccine' },
    { label: 'Αποπαρασίτωση', icon: <FaEyeDropper />, path: '/vet/manage-pets/record-medical-action/record-deworming' },
    { label: 'Διαγνωστικό Τεστ', icon: <LiaNotesMedicalSolid />, path: '/vet/manage-pets/record-medical-action/record-diagnostic-test' },
    { label: 'Θεραπεία', icon: <LuPillBottle />, path: '/vet/manage-pets/record-medical-action/record-treatment' },
    { label: 'Χειρουργείο', icon: <PiScissorsBold />, path: '/vet/manage-pets/record-medical-action/record-surgery' },
  ];

const QuickActions = () => {
  const location = useLocation();
  return (
    <>
      <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: 'black' }}>
        Γρήγορες ενέργειες
      </Typography>
      <Box 
        sx={{ 
          display: 'flex', 
          gap: 2, 
          flexWrap: 'wrap', // Ensures it looks good on mobile too
          justifyContent: 'space-between' // Spreads them out
        }}
      >
        {actions.map((action, index) => {
          if (location.pathname === action.path) return null; // skip current page
          return (
            <Button
              component={Link}
              to={action.path}
              key={index}
              variant="contained"
              startIcon={action.icon}
              sx={{
                backgroundColor: '#9ccfa0', // Sage/Light Green
                color: 'black',
                textTransform: 'none',
                fontWeight: 'bold',
                border: '1px solid #4a6344',
                borderRadius: '8px',
                boxShadow: 'none',
                flex: '1 1 200px', // Responsive width
                justifyContent: 'flex-start', // Align text/icon left
                px: 2,
                py: 1.5,
                '&:hover': {
                  backgroundColor: '#8bc28f',
                  boxShadow: 'none',
                },
                '& .MuiButton-startIcon': {
                  color: '#222', 
                  marginRight: 1.5,
                },
              }}
            >
              {action.label}
            </Button>
          );
        })}
      </Box>
  
    </>
  );
};
    
export default QuickActions;  