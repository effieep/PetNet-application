import {
  TextField,
  Paper,
  Typography,
  Box,
  IconButton
} from '@mui/material';
import { useState } from 'react';
import AddIcon from '@mui/icons-material/Add';

const UserInfoCard = ({
  data,
  isEditing,
  onChange,
  errors,
  
}) => {




  const [rows, setRows] = useState(() => data?.length ? data : [{ role: '', company: '', startYear: '', endYear: '' }, { role: '', company: '', startYear: '', endYear: '' }, { role: '', company: '', startYear: '', endYear: '' }]);

  const handleAddRow = () => {
    setRows([...rows, { role: '', company: '', startYear: '', endYear: '' }]);
  };

  const handleChangeAdd = (index, field, value) => {
    const newRows = [...rows];
    newRows[index][field] = value;
    setRows(newRows);
    if (onChange) onChange(newRows); // lift state up
  };

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
        multiline           // ← makes it multi-line
        minRows={4}         // ← sets default height
        maxRows={8}         // ← optional, limits max height
        InputLabelProps={{
          sx: {
            whiteSpace: 'normal',   // allow wrapping
            wordWrap: 'break-word', // break long words if needed
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
            sx={{ flex: 1, minWidth: '250px' }} // takes remaining space
          />
          <TextField
            label="Έτος Αποφοίτησης"
            name="DgraduationYear"
            value={data?.DgraduationYear || ''}
            onChange={onChange}
            disabled={!isEditing}
            type="number"
            inputProps={{ min: 1900, max: new Date().getFullYear() }}
            sx={{ width: '150px' }} // fixed width for year
          />
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
            label="Έτος Αποφοίτησης"
            name="MgraduationYear"
            value={data?.MgraduationYear || ''}
            onChange={onChange}
            disabled={!isEditing}
            type="number"
            inputProps={{ min: 1900, max: new Date().getFullYear() }}
            sx={{ width: '150px' }}
          />
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
            label="Έτος Αποφοίτησης"
            name="PgraduationYear"
            value={data?.PgraduationYear || ''}
            onChange={onChange}
            disabled={!isEditing}
            type="number"
            inputProps={{ min: 1900, max: new Date().getFullYear() }}
            sx={{ width: '150px' }}
          />
        </Box>
      </Box>
      <Typography sx={{ my: 2, fontWeight: 'bold' }}>
        Επαγγελματική Εμπειρία
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Typography sx={{ fontWeight: 'bold' }}>Επαγγελματική Εμπειρία</Typography>

      {rows.map((row, index) => (
        <Box key={index} sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <TextField
            name={[`job-${index}`]?.role}
            value={data?.jobs?.[`job-${index}`]?.role || ''}
            label="Ρόλος"
            onChange={(e) => handleChangeAdd(index, 'role', e.target.value)}
            disabled={!isEditing}
            sx={{ flex: 1, minWidth: '150px' }}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Εταιρεία"
            name={[`job-${index}`]?.company}
            value={data?.jobs?.[`job-${index}`]?.company || ''}
            onChange={(e) => handleChangeAdd(index, 'company', e.target.value)}
            disabled={!isEditing}
            sx={{ flex: 1, minWidth: '150px' }}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Έτος Έναρξης"
            name={[`job-${index}`]?.startYear}
            value={data?.jobs?.[`job-${index}`]?.startYear || ''}
            onChange={(e) => handleChangeAdd(index, 'startYear', e.target.value)}
            disabled={!isEditing}
            type="number"
            inputProps={{ min: 1900, max: new Date().getFullYear() }}
            sx={{ width: '120px' }}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Έτος Λήξης"
            name={[`job-${index}`]?.endYear}
            value={data?.jobs?.[`job-${index}`]?.endYear || ''}
            onChange={(e) => handleChangeAdd(index, 'endYear', e.target.value)}
            disabled={!isEditing}
            type="number"
            inputProps={{ min: 1900, max: new Date().getFullYear() }}
            sx={{ width: '120px' }}
            InputLabelProps={{ shrink: true }}
          />
        </Box>
      ))}

      <Box>
        <IconButton onClick={handleAddRow} disabled={!isEditing}>
          <AddIcon />
        </IconButton>
      </Box>
    </Box>

    </Paper>
  );
};

export default UserInfoCard;
