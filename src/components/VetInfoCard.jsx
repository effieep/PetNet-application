import {
  Grid,
  TextField,
  Paper,
  Typography,
} from '@mui/material';

const VetInfoCard = ({
  data,
  isEditing,
  onChange,
  errors,
  
}) => {
  return (
    <Paper
      elevation={0}
      sx={{
        width: '100%',
        p: 4,
        borderRadius: '20px',
        backgroundColor: '#ffffff',
        border: '1px solid rgba(58, 78, 27, 0.15)',
      }}
    >
      {/* ===== ΠΡΟΣΩΠΙΚΑ ΣΤΟΙΧΕΙΑ ===== */}
      <Typography sx={{ mb: 2, fontWeight: 'bold' }}>
        Προσωπικά στοιχεία
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={4}>
          <TextField
            fullWidth
            label="Όνομα"
            name="name"
            value={data?.name || ''}
            onChange={onChange}
            disabled={!isEditing}
          />
        </Grid>

        <Grid item xs={4}>
          <TextField
            fullWidth
            label="Επώνυμο"
            name="surname"
            value={data?.surname || ''}
            onChange={onChange}
            disabled={!isEditing}
          />
        </Grid>

        <Grid item xs={4}>
          <TextField
            fullWidth
            label="ΑΦΜ"
            name="afm"
            value={data?.afm || ''}
            disabled
            variant="filled"
            sx={{ backgroundColor: '#f2f3ed', borderRadius: '8px' }}
          />
        </Grid>
      </Grid>

      {/* ===== ΣΤΟΙΧΕΙΑ ΕΠΙΚΟΙΝΩΝΙΑΣ ===== */}
      <Typography sx={{ mt: 4, mb: 2, fontWeight: 'bold' }}>
        Στοιχεία επικοινωνίας
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={6}>
          <TextField
            fullWidth
            label="Email"
            name="email"
            value={data?.email || ''}
            onChange={onChange}
            disabled={!isEditing}
            helperText={errors?.email || ''}
            error={Boolean(errors?.email)}
          />
        </Grid>

        <Grid item xs={6}>
          <TextField
            fullWidth
            label="Τηλέφωνο"
            name="phone"
            value={data?.phone || ''}
            onChange={onChange}
            disabled={!isEditing}
            helperText={errors?.phone || ''}
            error={Boolean(errors?.phone)}
          />
        </Grid>
      </Grid>

      {/* ===== ΔΙΕΥΘΥΝΣΗ ===== */}
      <Typography sx={{ mt: 4, mb: 2, fontWeight: 'bold' }}>
        Διεύθυνση
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Οδός και αριθμός"
            name="street"
            value={data?.street || ''}
            onChange={onChange}
            disabled={!isEditing}
          />
        </Grid>

        <Grid item xs={12} sm={3}>
          <TextField
            fullWidth
            label="Πόλη"
            name="city"
            value={data?.city || ''}
            onChange={onChange}
            disabled={!isEditing}
          />
        </Grid>

        <Grid item xs={12} sm={3}>
          <TextField
            fullWidth
            label="Ταχυδρομικός Κώδικας"
            name="postalCode"
            value={data?.postalCode || ''}
            onChange={onChange}
            disabled={!isEditing}
            helperText={errors?.postalCode || ''}
            error={Boolean(errors?.postalCode)}
          />
        </Grid>
      </Grid>

      {/* ===== ΔΙΕΥΘΥΝΣΗ ===== */}
      <Typography sx={{ mt: 4, mb: 2, fontWeight: 'bold' }}>
        Διεύθυνση Ιατρείου
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Οδός και αριθμός"
            name="clinicAddress"
            value={data?.clinicAddress || ''}
            onChange={onChange}
            disabled={!isEditing}
          />
        </Grid>

        <Grid item xs={12} sm={3}>
          <TextField
            fullWidth
            label="Πόλη"
            name="clinicCity"
            value={data?.clinicCity || ''}
            onChange={onChange}
            disabled={!isEditing}
          />
        </Grid>

        <Grid item xs={12} sm={3}>
          <TextField
            fullWidth
            label="Ταχυδρομικός Κώδικας"
            name="clinicZip"
            value={data?.clinicZip || ''}
            onChange={onChange}
            disabled={!isEditing}
            helperText={errors?.clinicZip || ''}
            error={Boolean(errors?.clinicZip)}
          />
        </Grid>
      </Grid>
    </Paper>
  );
};

export default VetInfoCard;
