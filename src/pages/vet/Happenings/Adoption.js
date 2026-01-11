import { Box, Typography } from '@mui/material';

const Adoption = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2 }}>
        Υιοθεσίες Κατοικιδίων
      </Typography>
      <Typography variant="body1">
        Εδώ μπορείτε να διαχειριστείτε τις υιοθεσίες κατοικιδίων.
      </Typography>
    </Box>
  );
}

export default Adoption;