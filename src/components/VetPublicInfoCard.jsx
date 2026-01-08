import {
  TextField,
  Paper,
  Typography,
  Box,
  IconButton,
  MenuItem,
  FormControlLabel,
  FormGroup,
  Checkbox,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import dayjs from 'dayjs';
const SPECIALIZATIONS = [
  "Γενική Κτηνιατρική",
  "Παθολογία",
  "Χειρουργική",
  "Οδοντιατρική",
  "Δερματολογία",
  "Οφθαλμολογία",
  "Διατροφολογία"
];

const VetPublicInfoCard = ({
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
      {/* ===== ΦΩΤΟΓΡΑΦΙΑ ΠΡΟΦΙΛ ===== */}
      <Typography sx={{ mb: 2, fontWeight: 'bold' }}>
        Φωτογραφία Προφίλ & μερικά λόγια για εσάς
      </Typography>
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'flex-end', gap: 2 }}>
        <Box
          sx={{
            position: 'relative',
            width: 200,
            height: 200,
            border: '2px solid #e2d082ff',
            borderRadius: '8px',
            overflow: 'hidden',
            cursor: 'pointer',
            '&:hover .hoverOverlay': {
              opacity: isEditing ? 1 : 0,
            },
          }}
          onClick={() => 
            {
              if (isEditing){
                document.getElementById('profile-upload-input').click();
              }
            }
          }
        >
          {/* Profile image */}
          <Box
            component="img"
            src={data?.profilePic || '/default_profile_pic.png'}
            alt="Profile"
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: '0.3s',
            }}
          />

          {/* Hover overlay */}
          <Box
            className="hoverOverlay"
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              bgcolor: 'rgba(0,0,0,0.5)',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: 0, 
              transition: '0.3s',
              fontWeight: 'bold',
              fontSize: '16px',
              textAlign: 'center',
              pointerEvents: 'none', 
            }}
          >
            📷 Επιλέξτε για αλλαγή
          </Box>

          {/* Hidden input */}
          <input
            name="profilePic"
            type="file"
            id="profile-upload-input"
            accept="image/*"
            style={{ display: 'none' }}
            disabled={!isEditing}
            onChange={onChange}
          />
        </Box>

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
      </Box>

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
        Επαγγελματικά Στοιχεία
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
      <TextField
        label="Αριθμός Μητρώου Π.Κ.Σ."
        name="registryNum"
        value={data?.registryNum ?? ''}
        onChange={onChange}
        disabled={!isEditing}
        type="number"
        inputProps={{ min: 0, max: 100 }}
        sx={{ width: '250px', mx: 2 }}
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
              border : '1px dashed rgba(0, 0, 0, 0.25)',
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
      <Typography sx={{ my: 2, fontWeight: 'bold' }}>
        Παρεχόμενες Υπηρεσίες & Ειδικότητες
      </Typography>
      <Box sx={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        {/* ===== Προληπτική Υγεία ===== */}
        <Box>
          <Typography sx={{ mb: 1, fontWeight: 'bold' }}>Προληπτική Υγεία και Φροντίδα</Typography>
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  checked={data.services?.general || true}
                  onChange={onChange}
                  name="services.general"
                  disabled={true}
                />
              }
              label="Γενικός έλεγχος υγείας"
            />

            <FormControlLabel
              control={
                <Checkbox
                  checked={data.services?.vacinations || false}
                  onChange={onChange}
                  name="services.vacinations"
                  disabled={!isEditing}
                />
              }
              label="Εμβόλια / Προληπτική φροντίδα"
            />

            <FormControlLabel
              control={
                <Checkbox
                  checked={data.services?.nutrition || false}
                  onChange={onChange}
                  name="services.nutrition"
                  disabled={!isEditing}
                />
              }
              label="Διατροφική συμβουλευτική"
            />

            <FormControlLabel
              control={
                <Checkbox
                  checked={data.services?.consulting || false}
                  onChange={onChange}
                  name="services.consulting"
                  disabled={!isEditing}
                />
              }
              label="Συμβουλές συμπεριφοράς"
            />
          </FormGroup>
        </Box>

        {/* ===== Διαγνωστικά ===== */}
        <Box>
          <Typography sx={{ mb: 1, fontWeight: 'bold' }}>Διαγνωστικά Τεστ</Typography>
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  checked={data.diagnostics?.blood || false}
                  onChange={onChange}
                  name="diagnostics.blood"
                  disabled={!isEditing}
                />
              }
              label="Αιματολογικές / Βιοχημικές"
            />

            <FormControlLabel
              control={
                <Checkbox
                  checked={data.diagnostics?.xrays || false}
                  onChange={onChange}
                  name="diagnostics.xrays"
                  disabled={!isEditing}
                />
              }
              label="Απεικονιστικές εξετάσεις"
            />

            <FormControlLabel
              control={
                <Checkbox
                  checked={data.diagnostics?.odontology || false}
                  onChange={onChange}
                  name="diagnostics.odontology"
                  disabled={!isEditing}
                />
              }
              label="Οδοντιατρικός έλεγχος"
            />

            <FormControlLabel
              control={
                <Checkbox
                  checked={data.diagnostics?.other || false}
                  onChange={onChange}
                  name="diagnostics.other"
                  disabled={!isEditing}
                />
              }
              label="Άλλες εξετάσεις"
            />
          </FormGroup>
        </Box>

        {/* ===== Χειρουργεία ===== */}
        <Box>
          <Typography sx={{ mb: 1, fontWeight: 'bold' }}>Χειρουργικές επεμβάσεις</Typography>
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  checked={data.surgeries?.general || false}
                  onChange={onChange}
                  name="surgeries.general"
                  disabled={!isEditing}
                />
              }
              label="Γενικές επεμβάσεις"
            />

            <FormControlLabel
              control={
                <Checkbox
                  checked={data.surgeries?.castration || false}
                  onChange={onChange}
                  name="surgeries.castration"
                  disabled={!isEditing}
                />
              }
              label="Στείρωση"
            />

            <FormControlLabel
              control={
                <Checkbox
                  checked={data.surgeries?.emergency || false}
                  onChange={onChange}
                  name="surgeries.emergency"
                  disabled={!isEditing}
                />
              }
              label="Επείγουσες επεμβάσεις"
            />
          </FormGroup>
        </Box>
      </Box>
      <Typography sx={{ my: 2, fontWeight: 'bold' }}>
        Ειδικεύσεις
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        {SPECIALIZATIONS.map((spec) => (
          <FormControlLabel
            key={spec} 
            control={
              <Checkbox
                checked={(data?.specialization?.includes(spec)) || false}
                onChange={onChange}
                name={`specialization.${spec}`}
                disabled={
                  spec === "Γενική Κτηνιατρική" || !isEditing
                }
              />
            }
            label={spec}
          />
        ))}
      </Box>
    </Paper>
  );
};

export default VetPublicInfoCard;