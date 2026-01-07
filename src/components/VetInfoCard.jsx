import {
  TextField,
  Paper,
  Typography,
  Box,
  IconButton,
  MenuItem,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import dayjs from 'dayjs';

const VetInfoCard = ({
  data,
  isEditing,
  onChange,
  errors,
  
}) => {

  const jobs = (data?.jobs || {});




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
        Μερικά λόγια για εσάς
      </Typography>

        <TextField
        fullWidth
        label="Γράψτε μία περίληψη για εσάς, την εμπειρία σας στο χώρο και έμμεσα λόγους για τους οποίους κανείς 
               θα επέλεγε εσάς ως κτηνίατρο."
        name="description"
        value={data?.description || ''}
        onChange={onChange}
        disabled={!isEditing}
        multiline    
        minRows={4}   
        maxRows={8}     
        InputLabelProps={{
          sx: {
            whiteSpace: 'normal', 
            wordWrap: 'break-word',
          },
        }}
      />

      <Typography sx={{ my: 2, fontWeight: 'bold' }}>
        Oί σπουδές σας
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <TextField
            label="Ίδρυμα Απόκτησης Πτυχίου"
            name="degreeInst"
            value={data?.degreeInst || ''}
            onChange={onChange}
            disabled={!isEditing}
            sx={{ flex: 1, minWidth: '250px' }}
          />
          <TextField
            select
            label="Έτος Αποφοίτησης"
            name="DgraduationYear"
            value={data?.DgraduationYear || ''}
            onChange={onChange}
            disabled={!isEditing}
            type="number"
            sx={{ width: '150px' }}
            SelectProps={{
                MenuProps: {
                  PaperProps: {
                    style: {
                      maxHeight: 6 * 48, // show 6 items, then scroll
                      width: 120,
                    },
                  },
                },
              }}
          >
            <MenuItem value="">--</MenuItem>
            {Array.from({ length: dayjs().year() - 1900 + 1 }, (_, i) => dayjs().year() - i).map((year) => (
              <MenuItem key={year} value={year}>
                {year}
              </MenuItem>
            ))}
          </TextField>
        </Box>

        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <TextField
            label="Ίδρυμα Απόκτησης Μεταπτυχιακού"
            name="masterInst"
            value={data?.masterInst || ''}
            onChange={onChange}
            disabled={!isEditing}
            sx={{ flex: 1, minWidth: '250px' }}
          />
          <TextField
            select
            label="Έτος Αποφοίτησης"
            name="MgraduationYear"
            value={data?.MgraduationYear || ''}
            onChange={onChange}
            disabled={!isEditing}
            type="number"
            sx={{ width: '150px' }}
            SelectProps={{
                MenuProps: {
                  PaperProps: {
                    style: {
                      maxHeight: 6 * 48, // show 6 items, then scroll
                      width: 120,
                    },
                  },
                },
              }}
          >
            <MenuItem value="">--</MenuItem>
            {Array.from({ length: dayjs().year() - 1900 + 1 }, (_, i) => dayjs().year() - i).map((year) => (
              <MenuItem key={year} value={year}>
                {year}
              </MenuItem>
            ))}
          </TextField>
        </Box>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <TextField
            label="Ίδρυμα Απόκτησης Διδακτορικού"
            name="phdInst"
            value={data?.phdInst || ''}
            onChange={onChange}
            disabled={!isEditing}
            sx={{ flex: 1, minWidth: '250px' }}
          />
          <TextField
            select
            label="Έτος Αποφοίτησης"
            name="PgraduationYear"
            value={data?.PgraduationYear || ''}
            onChange={onChange}
            disabled={!isEditing}
            type="number"
            sx={{ width: '150px' }}
            SelectProps={{
                MenuProps: {
                  PaperProps: {
                    style: {
                      maxHeight: 6 * 48, // show 6 items, then scroll
                      width: 120,
                    },
                  },
                },
              }}
          >
            <MenuItem value="">--</MenuItem>
            {Array.from({ length: dayjs().year() - 1900 + 1 }, (_, i) => dayjs().year() - i).map((year) => (
              <MenuItem key={year} value={year}>
                {year}
              </MenuItem>
            ))}
          </TextField>
        </Box>
      </Box>
      <Typography sx={{ my: 2, fontWeight: 'bold' }}>
        Επαγγελματική Εμπειρία
      </Typography>
      <TextField
        label="Χρόνια Εμπειρίας"
        name="practiceYears"
        value={data?.practiceYears ?? ''}
        onChange={onChange}
        disabled={!isEditing}
        type="number"
        inputProps={{ min: 0, max: 100 }}
        sx={{ width: '150px', mb: 2 }}
      />
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>

        {Object.entries(jobs).map(([jobKey, job]) => (
          <Box key={jobKey} sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <TextField
              label="Ρόλος"
              name={`${jobKey}.role`}      
              value={job.role || ''}       
              onChange={onChange}          
              disabled={!isEditing}
              sx={{ flex: 1, minWidth: '150px' }}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Εταιρεία"
              name={`${jobKey}.company`}
              value={job.company || ''}
              onChange={onChange}
              disabled={!isEditing}
              sx={{ flex: 1, minWidth: '150px' }}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              select
              label="Έτος Έναρξης"
              value={job.startYear || ''}
              onChange={(e) => {
                onChange({
                  target: { name: `${jobKey}.startYear`, value: e.target.value },
                });
              }}
              sx={{ width: '120px' }}
              InputLabelProps={{ shrink: true }}
              disabled={!isEditing}
              SelectProps={{
                MenuProps: {
                  PaperProps: {
                    style: {
                      maxHeight: 6 * 48, // show 6 items, then scroll
                      width: 120,
                    },
                  },
                },
              }}
              >
              <MenuItem value="">--</MenuItem>
              {Array.from({ length: dayjs().year() - 1900 + 1 }, (_, i) => dayjs().year() - i).map((year) => (
                <MenuItem key={year} value={year}>
                  {year}
                </MenuItem>
              ))}
              </TextField>
              <Typography sx={{ alignSelf: 'center' }}>-</Typography>
              <TextField
                select
                label="Έτος Λήξης"
                value={job.endYear || ''}
                onChange={(e) => {
                  onChange({
                    target: { name: `${jobKey}.endYear`, value: e.target.value },
                  });
                }}
                sx={{ width: '120px' }}
                InputLabelProps={{ shrink: true }}
                disabled={!isEditing}
                SelectProps={{
                  MenuProps: {
                    PaperProps: {
                      style: {
                        maxHeight: 6 * 48, // show 6 items, then scroll
                        width: 120,
                      },
                    },
                  },
                }}
                >
                <MenuItem value="">--</MenuItem>
                <MenuItem value="Σήμερα">Σήμερα</MenuItem>

                {Array.from({ length: dayjs().year() - 1900 + 1 }, (_, i) => dayjs().year() - i).map((year) => (
                  <MenuItem key={year} value={year}>
                    {year}
                  </MenuItem>
                ))}
            </TextField>
          </Box>
        ))}
          <Box
            sx={{
              mt: 2,
              display: 'flex',
              justifyContent: 'center',
              gap: 2,
            }}
          >
            <IconButton
              onClick={() =>
                onChange({
                  target: { name: '__REMOVE_JOB__' }
                })
              }
              disabled={!isEditing}
            >
              <RemoveIcon sx={{ fontSize: 30 }} />
            </IconButton>

            <IconButton
              onClick={() =>
                onChange({
                  target: { name: '__ADD_JOB__' }
                })
              }
              disabled={!isEditing}
            >
              <AddIcon sx={{ fontSize: 30 }} />
            </IconButton>
          </Box>

      </Box>

    </Paper>
  );
};

export default VetInfoCard;
