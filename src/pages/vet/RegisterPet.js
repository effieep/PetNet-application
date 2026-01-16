import Submenu from '../../components/SubMenu';
import { Box, Typography, Stepper, Step, StepLabel, StepConnector, Button, TextField, Divider, Snackbar, Alert, Autocomplete, Paper, Grid, Stack, Chip } from '@mui/material';
import { useState, Fragment, useEffect } from 'react';
import { useAuth } from '../../auth/AuthContext';
import { styled } from '@mui/material/styles';
import { stepConnectorClasses } from '@mui/material/StepConnector';
import { API_URL } from '../../api';
import { MdAlternateEmail } from 'react-icons/md';
import { FaPhoneAlt  } from 'react-icons/fa';
import { FaLocationDot } from 'react-icons/fa6';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import { OwnerField, DetailRow } from '../../components/PetDetailsCard';
import EditIcon from '@mui/icons-material/Edit';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

const steps = ['Στοιχεία Κατοικιδίου', 'Ανάθεση σε Ιδιοκτήτη', 'Επιβεβαίωση & Υποβολή'];

const reverseDateString = (dateStr) => {
  return dateStr.split('-').reverse().join('-');
}

const PetItems = [
  { label: "Φυλή", type: "text", name: "breed" },
  { label: "Χρώμα", type: "text", name: "color" },
  { label: "Είδος", type: "select", name: "species", options: ["Σκύλος", "Γάτα"] },
  { label: "Φύλο", type: "select", name: "gender", options: ["Αρσενικό", "Θηλυκό"] },
  { label: "Βάρος (kg)", type: "text", name: "weight", inputProps: { type: "number", min: 0, max: 100 } },
  { label: "Ημερομηνία Γέννησης", type: "date", name: "birthDate" },
];



const submenuItems = [
  { label: "Καταγραφή νέου Κατοικιδίου", path: "/vet/manage-pets/register-pet" },
  { label: "Kαταγραφή Ιατρικής Πράξης", path: "/vet/manage-pets/record-medical-action" },
  { label: "Καταγραφή Συμβάντος Ζωής", path: "/vet/manage-pets/record-life-event" },
  { label: "Προβολή Βιβλιαρίου Υγείας", path: "/vet/manage-pets/view-health-record" },
  { label: "Ιστορικό Ενεργειών", path: "/vet/manage-pets/actions-history" },
];

// Adjust top to match your StepIcon height
const STEP_ICON_SIZE = 50;
const ColorlibConnector = styled(StepConnector)(() => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: STEP_ICON_SIZE / 2 - 1.5, // center line vertically
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 2,
    border: 0,
    backgroundColor: '#000000',
    borderRadius: 1,
    marginLeft: STEP_ICON_SIZE / 7,
    marginRight: STEP_ICON_SIZE / 7,
  },
}));



const RegisterPet = () => {
  const [manualMode, setManualMode] = useState(false);
  const [tempSavedData, setTempSavedData] = useState([]);
  const [tempSavedDataId, setTempSavedDataId] = useState(null);
  const [formData, setFormData] = useState({
    microchip: '',
    weight: '',
    name: '',
    breed: '',
    color: '',
    species: '',
    gender: '',
    birthDate: '',
    ownerId: '',
    health: 
    { 
      neutered: false, 
      overview: {
        lastVaccine: {
          name: '',
          date: '',
          nextDate: '',
        },
        lastDeworming: {
          internal: '',
          external: '',
          nextInternal: '',
          nextExternal: '',
        },
        activeMedication: {
          name: '',
          instructions: '',
          endDate: '',
        },
      },
      history: {
        vaccinations: [],
        deworming: [],
        medicalActs: {
          tests: [],
          surgeries: [],
          medication: [],
        },
        lifeEvents: [],
      }
    },

  });
  const { user, isLoggedIn } = useAuth();
  const [activeStep, setActiveStep] = useState(0);
  const [owners, setOwners] = useState([]);
  const [existingMicrochips, setExistingMicrochips] = useState([]);
  const [errors, setErrors] = useState({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  useEffect(() => {
    const fetchOwners = async () => {
      try {
        const response = await fetch(`${API_URL}/users?role=owner`);
        const data = await response.json();
        setOwners(data);
      } catch (error) {
        console.error('Error fetching owners:', error);
      }
    };
    const fetchAllMicrochips = async () => {
      try {
        const response = await fetch(`${API_URL}/pets`);
        const data = await response.json();
        const microchips = data.map(pet => pet.microchip);
        setExistingMicrochips(microchips);
      } catch (error) {
        console.error('Error fetching microchips:', error);
      }
    };
    const fetchAllTempSavedData = async () => {
      try {
        const response = await fetch(`${API_URL}/temp-saved-vet-form`);
        const data = await response.json();
        if(data.length > 0) {
          const myData = data.filter(item => item.vetId === user.id);
          setTempSavedData(myData);
        }
        else {
          setTempSavedData([]);
        }

      } catch (error) {
        console.error('Error fetching temp saved data:', error);
      }
    };
    fetchAllTempSavedData();
    fetchOwners();
    fetchAllMicrochips();
  }, [user]);


  const handleTempChange = (e, newValue) => {
    setFormData(newValue ? newValue.formData : {
      microchip: '',
      weight: '',
      name: '',
      breed: '',
      color: '',
      species: '',
      gender: '',
      birthDate: '',
      ownerId: '',
      health: 
      { 
        neutered: false, 
        overview: {
          lastVaccine: {
            name: '',
            date: '',
            nextDate: '',
          },
          lastDeworming: {
            internal: '',
            external: '',
            nextInternal: '',
            nextExternal: '',
          },
          activeMedication: {
            name: '',
            instructions: '',
            endDate: '',
          },
        },
        history: {
          vaccinations: [],
          deworming: [],
          medicalActs: {
            tests: [],
            surgeries: [],
            medication: [],
          },
          lifeEvents: [],
        }
      },
    });
    setTempSavedDataId(newValue ? newValue.id : null);
  }

  const handleTempSave = async () => {

    try {
      const response = await fetch(`${API_URL}/temp-saved-vet-form?vetId=${user.id}`);
      const myDrafts = await response.json();

      let existingDraft = myDrafts.find(item => ((item.id === tempSavedDataId) || (item.formData.microchip === formData.microchip)));
      if (existingDraft) {

        await fetch(`${API_URL}/temp-saved-vet-form/${existingDraft.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            formData: formData
          }),
        });

        openSnackbar('Η ενημέρωση της προσωρινής αποθήκευσης ολοκληρώθηκε', 'success');
        setTempSavedData(prevData => prevData.map(draft =>
          ((draft.id === tempSavedDataId) || (draft.formData.microchip === formData.microchip))
            ? { ...draft, formData: formData }
            : draft
        ));

      } else {
        const createRes = await fetch(`${API_URL}/temp-saved-vet-form`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            vetId: user.id,
            formData: formData
          }),
        });

        const newDraft = await createRes.json();
        setTempSavedData(prevData => [...prevData, newDraft]);

        openSnackbar('Η προσωρινή αποθήκευση δημιουργήθηκε', 'success');

        setFormData({
          microchip: '',
          weight: '',
          name: '',
          breed: '',
          color: '',
          species: '',
          gender: '',
          birthDate: '',
          ownerId: '',
          health: 
          { 
            neutered: false, 
            overview: {
              lastVaccine: {
                name: '',
                date: '',
                nextDate: '',
              },
              lastDeworming: {
                internal: '',
                external: '',
                nextInternal: '',
                nextExternal: '',
              },
              activeMedication: {
                name: '',
                instructions: '',
                endDate: '',
              },
            },
            history: {
              vaccinations: [],
              deworming: [],
              medicalActs: {
                tests: [],
                surgeries: [],
                medication: [],
              },
              lifeEvents: [],
            }
          },
        });
      }

    } catch (error) {
      console.error("Save failed", error);
      openSnackbar('Σφάλμα αποθήκευσης', 'error');
    }
  };

  const handleNext = () => {
    if(!validateForm()) {
      return;
    }
    setActiveStep(prev => Math.min(prev + 1, steps.length - 1))
  };
  const handleBack = () => setActiveStep(prev => Math.max(prev - 1, 0));
  const handleChange = (e) => {
  const { name, value } = e.target;
    let newValue = value;

    if (name === "weight") {
      const num = Number(value);
      if (!isNaN(num)) {
        newValue = Math.min(100, Math.max(0, num));
      } else {
        newValue = "";
      }
    }

    if(name === "microchip") {
      newValue = newValue.slice(0, 15);
    }
    
    setFormData(prevData => ({
      ...prevData,
      [name]: newValue,
    }));
  };
  
  const PetBox = (label, type, name, options, value, handleChange, inputProps={}) => {
    if(type === 'text')
      {
        return (
        <TextField label={label} variant="outlined" name={name} fullWidth onChange={handleChange} value={value} {...inputProps} />
      );
    }
    else if (type === 'select')
    {
      return (
        <Box>
          <TextField
            select
            {...inputProps}
            value={value}
            label={label}
            variant="outlined"
            name={name}
            fullWidth
            SelectProps={{ native: true }}
            onChange={handleChange}
            helperText={errors[name]} error={Boolean(errors[name])}
          >
            <option value="" />
            {options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </TextField>
        </Box>
      );
    }
    else if (type === 'date')
    {
      return (
        <TextField
          {...inputProps}
          label={label}
          value={value}
          type="date"
          variant="outlined"
          name={name}
          fullWidth
          inputProps={{ max: (new Date()).toISOString().split("T")[0] }}
          helperText={errors[name]} error={Boolean(errors[name])}
          onChange={handleChange}
          InputLabelProps={{
            shrink: true,
          }}
        />
      );
    }
  }
  
  const openSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const closeSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const handleTempDelete = async () => {
    try {
      await fetch(`${API_URL}/temp-saved-vet-form/${tempSavedDataId}`, {
        method: 'DELETE',
      });
      setTempSavedData(prevData => prevData.filter(item => item.id !== tempSavedDataId));
      setTempSavedDataId(null);
      openSnackbar('Η προσωρινή αποθήκευση διαγράφηκε επιτυχώς', 'success');
    } catch (error) {
      console.error('Error deleting temp saved data:', error);
      openSnackbar('Σφάλμα κατά τη διαγραφή της προσωρινής αποθήκευσης', 'error');
    }
  };

  const checkTempSaveDisabled = () => {
    const trimmedmicrochip = formData.microchip.trim();
    const trimmedname = formData.name.trim();

    if (trimmedmicrochip === '' || isNaN(Number(trimmedmicrochip)) || !/^\d{15}$/.test(trimmedmicrochip)) {
      return true;
    }
    if (trimmedname === '') {
      return true;
    }
    if(existingMicrochips.includes(trimmedmicrochip)) {
      return true;
    }
    return false;
  }

  const validateForm = () => {
    const newErrors = {};
    const trimmedmicrochip = formData.microchip.trim();
    const trimmedname = formData.name.trim();
    const trimmedspecies = formData.species.trim();
    if (trimmedmicrochip === '' || isNaN(Number(trimmedmicrochip)) || !/^\d{15}$/.test(trimmedmicrochip)) {
      newErrors.microchip = 'Παρακαλώ εισάγετε έναν έγκυρο αριθμό microchip 15 ψηφίων.';
    }
    if(existingMicrochips.includes(trimmedmicrochip)) {
      newErrors.microchip = 'Ο αριθμός microchip υπάρχει ήδη.';
    }
    if (trimmedname === '') {
      newErrors.name = 'Παρακαλώ εισάγετε το όνομα του κατοικιδίου.';
    }
    if (trimmedspecies === '') {
      newErrors.species = 'Παρακαλώ εισάγετε το είδος του κατοικιδίου.';
    }
    if(formData.gender === '') {
      newErrors.gender = 'Παρακαλώ επιλέξτε το φύλο του κατοικιδίου.';
    }
    if(formData.birthDate === '') {
      newErrors.birthDate = 'Παρακαλώ επιλέξτε την ημερομηνία γέννησης του κατοικιδίου.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextOrCompleteFunction = async (activeStep) => {
    if(activeStep >= steps.length - 1) {
      try {
        await fetch(`${API_URL}/pets`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...formData, birthDate: reverseDateString(formData.birthDate) }),
        });
        openSnackbar('Το κατοικίδιο καταχωρήθηκε επιτυχώς!', 'success');
        if(tempSavedDataId) {
            await fetch(`${API_URL}/temp-saved-vet-form/${tempSavedDataId}`, {
            method: 'DELETE',
          });
        }
        setTempSavedData(prevData => prevData.filter(item => item.id !== tempSavedDataId));
        setTempSavedDataId(null);
        setActiveStep(0);
        setFormData({
          microchip: '',
          weight: '',
          name: '',
          breed: '',
          color: '',
          species: '',
          gender: '',
          birthDate: '',
          ownerId: '',
          health:
          {
            neutered: false,
            overview: {
              lastVaccine: {
                name: '',
                date: '',
                nextDate: '',
              },
              lastDeworming: {
                internal: '',
                external: '',
                nextInternal: '',
                nextExternal: '',
              },
              activeMedication: {
                name: '',
                instructions: '',
                endDate: '',
              },
            },
            history: {
              vaccinations: [],
              deworming: [],
              medicalActs: {
                tests: [],
                surgeries: [],
                medication: [],
              },
              lifeEvents: [],
            }
          },
        });
        return;
      } catch (error) {
        openSnackbar('Σφάλμα κατά την καταχώρηση του κατοικιδίου.', 'error');
      }
    }
    handleNext();
  }

  function removeTones(str) {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  }

  const stepsContent = [
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <Box sx={{ display: 'flex', flexDirection: 'row', gap: 8}}>
        <TextField label="Αριθμός Microchip" variant="outlined" fullWidth name="microchip" type="number" value={formData["microchip"]}  onChange={handleChange} 
          sx={{
            '& input[type=number]::-webkit-outer-spin-button': {
              '-webkit-appearance': 'none',
              margin: 0,
            },
            '& input[type=number]::-webkit-inner-spin-button': {
              '-webkit-appearance': 'none',
              margin: 0,
            },
            '& input[type=number]': {
              '-moz-appearance': 'textfield',
            },
          }}
          helperText={errors.microchip} error={Boolean(errors.microchip)}
        />
        <TextField label="Όνομα Κατοικιδίου" variant="outlined" fullWidth name="name" value={formData["name"]} onChange={handleChange} 
          helperText={errors.name} error={Boolean(errors.name)}
        />
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2 }}>
        {PetItems.map((item) => (
          <Fragment key={item.name}>
            <Box key={item.name} sx={{ flex: 1 }}>
              {PetBox(item.label, item.type, item.name, item.options, formData[item.name], handleChange, item.inputProps)}
            </Box>
            { item.type !== 'date' && (
              <Divider orientation="vertical" flexItem sx={{ mx: 2, width: '0px', backgroundColor: '#42422B' }} />
            )
          } 
          </Fragment>
        ))}
      </Box>
    </Box>,
    <>
    <Box sx={{ mt: 2, flexDirection: 'column', display: 'flex', gap: 2, justifyContent: 'center', alignItems: 'center' }}>
      {!manualMode ? (
        <>
          <Autocomplete
            noOptionsText="Δεν βρέθηκαν αποτελέσματα"
            options={owners}
            filterOptions={(options, { inputValue }) => {
              const normalizedInput = removeTones(inputValue);
              return options.filter(option =>
                removeTones(`${option.name} ${option.surname} ${option.afm}`).includes(normalizedInput)
              );
            }}
            getOptionLabel={(option) => `${option.name} ${option.surname} - ${option.afm}`}
            value={owners.find(o => o.id === formData.ownerId) || null}
            onChange={(event, newValue) => {
              setFormData(prev => ({ ...prev, ownerId: newValue ? newValue.id : ''}));
            }}
            ListboxProps={{
              sx: { maxHeight: '20vh', overflowY: 'auto' }
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Ιδιοκτήτης"
                variant="outlined"
                fullWidth
                sx={{ '& .MuiInputBase-root': { width: '50vh' } }}
              />
            )}
          />
          <Button
            variant="text"
            sx={{ 
                mt: 1,
                borderRadius: 2,
                border: '1px solid #1a7ab9',
             }}
            onClick={() => {
              setManualMode(true);
              setFormData(prev => ({ ...prev, ownerId: '' }));
            }}
          >
            Ανάθεση σε Φιλοζωϊκή
          </Button>

          {/* Selected owner info */}
          {formData.ownerId !== '' && (
            <Box
              sx={{
                width: '45vw',
                mt: 2,
                backgroundColor: '#96a50b7c',
                borderRadius: 3,
                boxShadow: 3,
                textAlign: 'center',
              }}
            >
              <Fragment>
                {(() => {
                  const owner = owners.find(o => o.id === formData.ownerId);
                  if (!owner) return null;
                  return (
                    <>
                      <Typography variant="h5" sx={{ color: '#000000', fontWeight: 'bold', p: 2 }}>
                        {owner.name} {owner.surname}
                      </Typography>
                      <Typography variant="h6" sx={{ color: '#535252' }}>
                        Α.Φ.Μ.: {owner.afm}
                      </Typography>
                      <Typography variant="h6" sx={{ color: '#535252' }}>
                        <MdAlternateEmail style={{ verticalAlign: 'middle', marginRight: '8px' }} /> {owner.email}
                      </Typography>
                      <Typography variant="h6" sx={{ color: '#535252' }}>
                        <FaPhoneAlt style={{ verticalAlign: 'middle', marginRight: '8px' }} /> {owner.phone}
                      </Typography>
                      <Typography variant="h6" sx={{ color: '#535252', pb: 2 }}>
                        <FaLocationDot style={{ verticalAlign: 'middle', marginRight: '8px' }} /> {owner.street} {owner.city}, {owner.postalCode}
                      </Typography>
                    </>
                  );
                })()}
              </Fragment>
            </Box>
          )}
        </>
      ) : (
        <>
          {/* Manual input mode */}
          <TextField
            label="'Ονομα Φιλοζωϊκής Οργάνωσης"
            variant="outlined"
            fullWidth
            sx = {{
              width: "28vw"
            }}
            value={(formData.ownerId).split('FILOZ-')[1] || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, ownerId: 'FILOZ-' + e.target.value }))}
          />
          <Button
            variant="text"
            sx={{ 
              mt: 1,
              borderRadius: 2,
              border: '1px solid #1a7ab9'
            }}
            onClick={() => {
              setManualMode(false);
              setFormData(prev => ({ ...prev, ownerId: '' }));
            }}
          >
            Ανάθεση σε Υφιστάμενο Ιδιοκτήτη
          </Button>
        </>
      )}
    </Box>
    </>
    ,
    <Fragment>
      {(() => {
        const owner = owners.find(o => o.id === formData.ownerId);
        return (
          <Paper 
            elevation={0} 
            sx={{ 
              p: 4, 
              maxWidth: 900,
              backgroundColor: '#F1D77A', 
              borderRadius: '20px', 
              border: '1px solid #000',
              mt: 3
            }}
          >
            <Grid container spacing={4}>
              {/* ΑΡΙΣΤΕΡΗ ΠΛΕΥΡΑ: ΣΤΟΙΧΕΙΑ ΖΩΟΥ */}
              <Grid item xs={12} md={7} sx={{ display: 'flex', gap: 3 }}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2 }}>{formData.name}</Typography>
                  <Box sx={{ width: 120, height: 120, border: '1px solid #000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <CameraAltIcon sx={{ fontSize: 40 }} />
                  </Box>
                </Box>

                <Box sx={{ flex: 1, minWidth: '250px', backgroundColor: 'rgba(255,255,255,0.2)', p: 2, borderRadius: '15px' }}>
                  <Stack spacing={3}>
                    <DetailRow label="Microchip:" value={formData.microchip} />
                    <DetailRow label="Είδος:" value={formData.species} />
                    <DetailRow label="Φύλο:" value={formData.gender || "Μη ορισμένο"} />
                    <DetailRow label="Φυλή:" value={formData.breed || "Ημίαιμο"} />
                    <DetailRow label="Ημ/νία Γέννησης:" value={formData.birthDate || "-"} />
                    <DetailRow label="Βάρος:" value={formData.weight || "-"} />
                    <DetailRow label="Χρώμα:" value={formData.color || "-"} />
                  </Stack>
                </Box>
              </Grid>

              <Divider orientation="vertical" flexItem sx={{ borderColor: '#000', display: { xs: 'none', md: 'block' }, mx: 2 }} />

              {/* ΔΕΞΙΑ ΠΛΕΥΡΑ: ΣΤΟΙΧΕΙΑ ΙΔΙΟΚΤΗΤΗ */}
              <Grid item xs={12} md={4}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>{!formData.ownerId.startsWith('FILOZ-') ? 'Στοιχεία Ιδιοκτήτη' : 'Στοιχεία Φιλοζωϊκής'}</Typography>
                <OwnerField label={formData.ownerId.startsWith('FILOZ-') ? 'Όνομα Φιλοζωϊκής Οργάνωσης' : 'Ονοματεπώνυμο'} value={formData.ownerId.startsWith('FILOZ-') ? `${formData.ownerId.split('FILOZ-')[1]}` : `${owner?.name || ""} ${owner?.surname || ""}`} />
                {!formData.ownerId.startsWith('FILOZ-') && (  
                <>
                  <OwnerField label="Τηλέφωνο επικοινωνίας" value={owner?.phone || "-"} />
                  <OwnerField label="E-mail" value={owner?.email || "-"} />
                  <OwnerField label="Διεύθυνση κατοικίας" value={owner?.street ? `${owner.street} ${owner.city}, ${owner.postalCode}` : "Δεν έχει οριστεί"} />
                </>
                )}
              </Grid>
            </Grid>
          </Paper>
        );
      })()}
    </Fragment>


  ];

  return (isLoggedIn && user?.role === 'vet') ? (
    <Box sx={{ display: 'flex', p: 2, flexDirection: 'row' }}>
      <Submenu submenuItems={submenuItems} />
      <Box sx={{ width: '75vw', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center' }}>
        <Typography variant="h4" sx={{ color: '#000000', fontWeight: 'bold' }}>
          Καταγραφή Νέου Κατοικιδίου
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap : 2 }}>
          <Autocomplete
            key="auto-1"
            value={tempSavedData.find(item => item.id === tempSavedDataId) || null}
            sx={{ mt: 2, mb: 1, width: '30vw', backgroundColor: '#ffffff' }}
            options={tempSavedData ? tempSavedData : []}
            getOptionLabel={(option) => `${option.formData.microchip} - ${option.formData.name}`}
            onChange={(e, newValue) => handleTempChange(e, newValue)}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Φόρτωση Προσωρινά Αποθηκευμένων Δεδομένων"
                variant="outlined"
              />
            )}
          />
          <Button
            variant="contained"
            disabled={!tempSavedDataId}
            onClick={handleTempDelete}
            sx={{
              color: '#000000',
              backgroundColor: '#bb3d3d',
              '&:hover': { backgroundColor: '#ce5959' },
              borderRadius: 2,
              mt: 1,
            }}
          >
            Διαγραφή Επιλεγμένης Αποθήκευσης
          </Button>
        </Box>
        <Typography variant="body2" sx={{ color: '#000000', fontStyle: 'italic' }}>
          *Για προσωρινή αποθήκευση της φόρμας, παρακαλώ συμπληρώστε έγκυρο Αριθμό Microchip και το όνομα του κατοικιδίου
        </Typography>

        <Box sx={{ width: '100%', mt: 4 }}>
          <Stepper
            activeStep={activeStep}
            alternativeLabel
            connector={<ColorlibConnector />}
            sx={{
              '& .MuiStepIcon-root': {
                fontSize: '2.5rem',
                width: STEP_ICON_SIZE,
                height: STEP_ICON_SIZE,
              },
              '& .MuiStepIcon-root.Mui-active': { color: '#4caf50' },
              '& .MuiStepIcon-root.Mui-completed': { color: '#81c784' },
            }}
          >
            {steps.map(label => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>


        <Box sx={{mt: 2, display: 'flex', gap: 2, alignItems: 'center' }}>

          <Chip
            icon={tempSavedDataId ? <EditIcon /> : <AddCircleOutlineIcon />}
            
            label={tempSavedDataId ? "Σε κατάσταση Επεξεργασίας Αποθηκευμένου Προσχεδίου" : "Σε κατάσταση Νέας Καταχώρησης"}
            
            color={tempSavedDataId ? "warning" : "success"}
            
            variant="filled"
            
            sx={{ 
              fontWeight: 'bold',
              fontSize: '0.9rem',
              py: 2.5,
              px: 1,
              borderRadius: 2,
            }}
          />

        </Box>
        <Box sx={{ width: '70vw', ml: 3, boxShadow: 3, backgroundColor: '#ffffff9f', mt: 3, mb: 3, borderRadius: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Box sx={{ m: 4, display: 'flex', flexDirection: 'column', gap: 4, width: '60vw', alignItems: 'center' }}>
            {stepsContent[activeStep]}
          </Box>
        </Box>

        <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
          <Button variant="contained" onClick={handleBack} disabled={activeStep === 0}
            sx ={{
              backgroundColor: '#9a9b6a',
              '&:hover': { backgroundColor: '#8a8b5a' },
            }}
          >
            Προηγούμενο
          </Button>
          <Button 
            variant="contained"
            disabled={checkTempSaveDisabled()}
            onClick={handleTempSave}
            sx = {{
              borderColor: '#3b2004',
              color: '#3b2004',
              backgroundColor: '#d38d1e',
              '&:hover': { 
                backgroundColor: '#eeaf49',
              },
            }}
          >
            Προσωρινή Αποθήκευση
          </Button>
          <Button variant="contained" color="primary" onClick={() => nextOrCompleteFunction(activeStep)} 
            disabled={activeStep === 1 && !formData.ownerId}
            sx ={{
              backgroundColor: (activeStep === steps.length - 1) ? '#4caf50' : 'primary.main',
              '&:hover': { backgroundColor: (activeStep === steps.length - 1) ? '#62d166' : 'primary.dark', },
            }}
          >
            {(activeStep === steps.length - 1) ? 'Ολοκλήρωση' : 'Επόμενο'}
          </Button>
        </Box>
      </Box>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={closeSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={closeSnackbar}
          severity={snackbar.severity}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  ) : (
    <Typography variant="h6" color="error" textAlign="center" sx={{ mt: 10 }}>
      Παρακαλώ συνδεθείτε ως Κτηνίατρος για να συνεχίσετε.
    </Typography>
  );
}

export default RegisterPet;