import {
  Box,
  Grid,
  TextField,
  Paper,
  Button,
} from '@mui/material';

const UserInfoCard = ({
  fields,
  data,
  isEditing,
  onChange,
  onEdit,
  onSave,
}) => {
  return (
    <Paper
      elevation={0}
      sx={{
        maxWidth: 460,
        p: 4,
        borderRadius: '20px',
        backgroundColor: '#ffffff',
        border: '1px solid rgba(58, 78, 27, 0.15)',
        mx: 'auto'
      }}
    >

      {/* FIELDS */}
      <Grid container spacing={2}>
        {fields.map((field) => (
          <Grid item xs={12}>
            <TextField
              fullWidth
              label={field.label}
              name={field.name}
              value={data?.[field.name] || ''}
              onChange={onChange}
              disabled={field.disabled || !isEditing}
              variant={field.disabled ? 'filled' : 'outlined'}
              sx={
                field.disabled
                  ? {
                      backgroundColor: '#f2f3ed',
                      borderRadius: '8px',
                    }
                  : {}
              }
            />
          </Grid>
        ))}
      </Grid>

      {/* ACTIONS */}
      <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
        {!isEditing ? (
          <Button
            variant="contained"
            onClick={onEdit}
            sx={{
              backgroundColor: '#9a9b6a',
              px: 4,
              py: 1.5,
              borderRadius: '10px',
              fontWeight: 'bold',
              '&:hover': { backgroundColor: '#8a8b5a' },
            }}
          >
            ΕΠΕΞΕΡΓΑΣΙΑ ΣΤΟΙΧΕΙΩΝ
          </Button>
        ) : (
          <>
            <Button
              variant="contained"
              color="success"
              onClick={onSave}
              sx={{ borderRadius: '10px', px: 4 }}
            >
              ΑΠΟΘΗΚΕΥΣΗ
            </Button>
            <Button 
                variant="outlined" 
                color="error" 
                onClick={() => onEdit(false)}
                sx={{ borderRadius: "10px", px: 4 }}
            >
              ΑΚΥΡΩΣΗ
            </Button>
          </>
        )}
      </Box>
    </Paper>
  );
};

export default UserInfoCard;
