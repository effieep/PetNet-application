import { Box, Stack, Typography } from '@mui/material';

const AppointmentHistoryCard = ({ appointment }) => {
  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: '60vw',
        backgroundColor: '#C1D1CB',
        borderRadius: '20px',
        border: '2px solid #4A5552',
        p: 3,
        boxShadow: 1,
        mb: 3,                     
      }}
    >
      <Stack spacing={2}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="body2" sx={{ color: '#5A6663', fontWeight: 'bold' }}>Ημερομηνία</Typography>
          <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#1A1A1A' }}>
            {appointment.date.replace(/-/g, '/')}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="body2" sx={{ color: '#5A6663', fontWeight: 'bold' }}>Ώρα</Typography>
          <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#1A1A1A' }}>
            {appointment.time}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="body2" sx={{ color: '#5A6663', fontWeight: 'bold' }}>Κατάσταση</Typography>
          <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#1A1A1A' }}>
            {appointment.status === 'COMPLETED' ? 'Ολοκληρωμένο' : 'Ακυρωμένο'}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="body2" sx={{ color: '#5A6663', fontWeight: 'bold' }}>Τύπος Ραντεβού</Typography>
          <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#1A1A1A' }}>
            {appointment.reason || 'Άγνωστος'}
          </Typography>
        </Box>
      </Stack>
    </Box>
  );
};

export default AppointmentHistoryCard;
