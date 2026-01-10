import { Box, Button } from '@mui/material';
import QuickActions from '../../../components/QuickActions';

const RecordDeworming = () => {
  return (
  <Box sx=
        {{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
          height: '100%',
          mt: 4,
        }}
      >

        <Box 
          sx={{ 
            p: 4, 
            borderRadius: 2,
            width: '70vw'
          }}
        >
          
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
            <Button
              variant="contained"
              sx={{
                backgroundColor: '#2bad08', // Bright Green
                color: 'black',
                fontWeight: 'bold',
                textTransform: 'none',
                border: '1px solid black',
                fontSize: '1.1rem',
                px: 6,
                py: 1,
                boxShadow: 'none',
                borderRadius: '6px',
                '&:hover': {
                  backgroundColor: '#249407',
                  boxShadow: 'none',
                }
              }}
            >
              Καταχώρηση
            </Button>
          </Box>
          <QuickActions />
        </Box>
      </Box >
  );
};

export default RecordDeworming;