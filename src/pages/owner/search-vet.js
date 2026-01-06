import Hero from '../../components/Hero';
import { Box, Typography, FormControl, RadioGroup, FormControlLabel, Radio, Button, Autocomplete, TextField, Popper, InputAdornment } from '@mui/material';
import { useState } from 'react';
import { FaFilter, FaSearch  } from 'react-icons/fa';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';

const SearchVet = () => {

  const areas = [
    { area: 'Αγιά', city: 'Λάρισα' },
    { area: 'Αγία Βαρβάρα', city: 'Ηράκλειο' },
    { area: 'Αγία Παρασκευή', city: 'Αθήνα' },
    { area: 'Άγιος Βασίλειος', city: 'Πάτρα' },
    { area: 'Άγιος Δημήτριος', city: 'Αθήνα' },
    { area: 'Αθήνα (Κέντρο)', city: 'Αθήνα' },
    { area: 'Αιγάλεω', city: 'Αθήνα' },
    { area: 'Ακταίο', city: 'Πάτρα' },
    { area: 'Άλιμος', city: 'Αθήνα' },
    { area: 'Αμαρούσιο', city: 'Αθήνα' },
    { area: 'Αμμουδάρα', city: 'Ηράκλειο' },
    { area: 'Αμπελόκηποι', city: 'Θεσσαλονίκη' },
    { area: 'Αμπελώνας', city: 'Λάρισα' },
    { area: 'Αραχωβίτικα', city: 'Πάτρα' },
    { area: 'Αρκαλοχώρι', city: 'Ηράκλειο' },
    { area: 'Αρχάνες', city: 'Ηράκλειο' },
    { area: 'Βιάννος', city: 'Ηράκλειο' },
    { area: 'Βούτες', city: 'Ηράκλειο' },
    { area: 'Βραχναίικα', city: 'Πάτρα' },
    { area: 'Βύρωνας', city: 'Αθήνα' },
    { area: 'Γάζι', city: 'Ηράκλειο' },
    { area: 'Γαλάτσι', city: 'Αθήνα' },
    { area: 'Γιάννουλη', city: 'Λάρισα' },
    { area: 'Γλυφάδα', city: 'Αθήνα' },
    { area: 'Γόννοι', city: 'Λάρισα' },
    { area: 'Γούβες', city: 'Ηράκλειο' },
    { area: 'Δαφνές', city: 'Ηράκλειο' },
    { area: 'Δεμένικα', city: 'Πάτρα' },
    { area: 'Διαβατά', city: 'Θεσσαλονίκη' },
    { area: 'Ελασσόνα', city: 'Λάρισα' },
    { area: 'Ελευθερές', city: 'Λάρισα' },
    { area: 'Ελευθέριο-Κορδελιό', city: 'Θεσσαλονίκη' },
    { area: 'Εύοσμος', city: 'Θεσσαλονίκη' },
    { area: 'Ζωγράφου', city: 'Αθήνα' },
    { area: 'Ηλιούπολη', city: 'Αθήνα' },
    { area: 'Ηράκλειο (Κέντρο)', city: 'Ηράκλειο' },
    { area: 'Θέρμη', city: 'Θεσσαλονίκη' },
    { area: 'Θεσσαλονίκη (Κέντρο)', city: 'Θεσσαλονίκη' },
    { area: 'Καλαμαριά', city: 'Θεσσαλονίκη' },
    { area: 'Καλλιθέα', city: 'Αθήνα' },
    { area: 'Καρτερός', city: 'Ηράκλειο' },
    { area: 'Καστέλλι', city: 'Ηράκλειο' },
    { area: 'Καστρίτσι', city: 'Πάτρα' },
    { area: 'Κηφισιά', city: 'Αθήνα' },
    { area: 'Κιλελέρ', city: 'Λάρισα' },
    { area: 'Κοιλάδα', city: 'Λάρισα' },
    { area: 'Κοκκίνη Χάνι', city: 'Ηράκλειο' },
    { area: 'Λάρισα (Κέντρο)', city: 'Λάρισα' },
    { area: 'Μακρυχώρι', city: 'Λάρισα' },
    { area: 'Μάλια', city: 'Ηράκλειο' },
    { area: 'Μελισσοχώρι', city: 'Λάρισα' },
    { area: 'Μενεμένη', city: 'Θεσσαλονίκη' },
    { area: 'Μεσσάτιδα', city: 'Πάτρα' },
    { area: 'Μιντιλόγλι', city: 'Πάτρα' },
    { area: 'Μοίρες', city: 'Ηράκλειο' },
    { area: 'Μονοδένδρι', city: 'Πάτρα' },
    { area: 'Μοσχάτο', city: 'Αθήνα' },
    { area: 'Νέα Αλικαρνασσός', city: 'Ηράκλειο' },
    { area: 'Νέα Ιωνία', city: 'Αθήνα' },
    { area: 'Νέα Σμύρνη', city: 'Αθήνα' },
    { area: 'Νεάπολη', city: 'Θεσσαλονίκη' },
    { area: 'Νίκαια', city: 'Λάρισα' },
    { area: 'Ξηροκρήνη', city: 'Θεσσαλονίκη' },
    { area: 'Οβρυά', city: 'Πάτρα' },
    { area: 'Ομορφοχώρι', city: 'Λάρισα' },
    { area: 'Παλαιό Φάληρο', city: 'Αθήνα' },
    { area: 'Πανόραμα', city: 'Θεσσαλονίκη' },
    { area: 'Παραλία', city: 'Πάτρα' },
    { area: 'Πάτρα (Κέντρο)', city: 'Πάτρα' },
    { area: 'Παύλος Μελάς', city: 'Θεσσαλονίκη' },
    { area: 'Περαία', city: 'Θεσσαλονίκη' },
    { area: 'Περιστέρι', city: 'Αθήνα' },
    { area: 'Πετρούπολη', city: 'Αθήνα' },
    { area: 'Πλατάνι', city: 'Πάτρα' },
    { area: 'Πλατύκαμπος', city: 'Λάρισα' },
    { area: 'Πολίχνη', city: 'Θεσσαλονίκη' },
    { area: 'Πυλαία', city: 'Θεσσαλονίκη' },
    { area: 'Ρίο', city: 'Πάτρα' },
    { area: 'Ροΐτικα', city: 'Πάτρα' },
    { area: 'Σαραβάλι', city: 'Πάτρα' },
    { area: 'Σελλά', city: 'Πάτρα' },
    { area: 'Σκαλάνι', city: 'Ηράκλειο' },
    { area: 'Σταυράκια', city: 'Ηράκλειο' },
    { area: 'Σταυρούπολη', city: 'Θεσσαλονίκη' },
    { area: 'Συκιές', city: 'Θεσσαλονίκη' },
    { area: 'Συκούριο', city: 'Λάρισα' },
    { area: 'Τερψιθέα', city: 'Λάρισα' },
    { area: 'Τριανδρία', city: 'Θεσσαλονίκη' },
    { area: 'Τσουκαλαίικα', city: 'Πάτρα' },
    { area: 'Τυμπάκι', city: 'Ηράκλειο' },
    { area: 'Τύρναβος', city: 'Λάρισα' },
    { area: 'Φαλάνη', city: 'Λάρισα' },
    { area: 'Φάρσαλα', city: 'Λάρισα' },
    { area: 'Χαλάνδρι', city: 'Αθήνα' },
    { area: 'Χερσόνησος', city: 'Ηράκλειο' },
    { area: 'Ψαθόπυργος', city: 'Πάτρα' },
    { area: 'Ωραιόκαστρο', city: 'Θεσσαλονίκη' }
  ];

  const [inputValue, setInputValue] = useState('');
  const [specialty, setSpecialty] = useState(null);
  const [dayperiod, setDayperiod] = useState(null);
  const [timeperiod, setTimeperiod] = useState(null);
  const [area, setArea] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  function removeTones(str) {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }

  const handleChangeSpecialty = (event) => {
    setSpecialty(event.target.value);
  };

   const handleChangeDayperiod = (event) => {
    setDayperiod(event.target.value);
  };

   const handleChangeTimeperiod = (event) => {
    setTimeperiod(event.target.value);
  };

  const handleSearch = () => {
  if (!specialty || !area || !dayperiod || !timeperiod) {
    setErrorMessage('Παρακαλώ συμπληρώστε όλα τα πεδία πριν την αναζήτηση!');
    return;
  }


  console.log({
    specialty,
    area,
    dayperiod,
    timeperiod,
  });
  setErrorMessage(null);
};

  const radioProps = {
    icon: <CheckBoxOutlineBlankIcon />,
    checkedIcon: <CheckBoxIcon />, 
    
    sx: {
      color: 'black',     
      '&.Mui-checked': {
        color: 'black', 
      },
      '& .MuiSvgIcon-root': {
        fontSize: 24,            }
    }
  };

  return (
    <>
      <Hero image={'/search-vet-hero.png'} title={"Αναζήτηση Κτηνιάτρου"} subtitle={"Βρείτε τον ιδανικό κτηνίατρο για το κατοικίδιό σας, ανάλογα με τις ανάγκες του!"} height={"50vh"}/>   
      <Typography variant="h5" align="center" sx={{ mt: 4, mb: 2, fontWeight: 'bold' }}>
        <FaFilter  style={{ verticalAlign: 'middle', marginRight: 8, fontSize: '24px' }} /> Φίλτρα Αναζήτησης
      </Typography>
      
      <Box sx={{ backgroundColor: '#db934581', marginX: 20, borderRadius: 2, padding: 2, display: 'flex', flexDirection: 'row', gap: 2, justifyContent: 'space-between', position: 'relative' }}>
        <Box 
          sx={{ 
            display: "flex",        
            flexDirection: "column",  
            alignItems: "center",    
            px: 3,              
            width: '32vw'      
          }} 
        >
          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
            Ειδικότητα Κτηνιάτρου
          </Typography>

          <FormControl>
            <RadioGroup
              name="radio-buttons-specialty"
              value={specialty}
              onChange={handleChangeSpecialty}
            >
              <FormControlLabel value="general" control={<Radio {...radioProps} />} label="Γενική Κτηνιατρική" />
              <FormControlLabel value="pathology" control={<Radio {...radioProps} />} label="Παθολογία" />
              <FormControlLabel value="surgery" control={<Radio {...radioProps} />} label="Χειρουργική" />
              <FormControlLabel value="odontiology" control={<Radio {...radioProps} />} label="Οδοντιατρική" />
              <FormControlLabel value="dermatology" control={<Radio {...radioProps} />} label="Δερματολογία" />
              <FormControlLabel value="ophthalmology" control={<Radio {...radioProps} />} label="Οφθαλμολογία" />
              <FormControlLabel value="nutrition" control={<Radio {...radioProps} />} label="Διατροφολογία" />
            </RadioGroup>
          </FormControl>
        </Box>
        <Box
          sx={{
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            px: 3,
            width: '36vw',
          }}
        >
          <Typography
            variant="h6"
            sx={{ fontWeight: 'bold', mb: 2 }}
          >
            Περιοχή
          </Typography>

          <Autocomplete
          sx={{
            position: 'absolute',
            left: 0,
            top: 40,
            width: '95%',
            backgroundColor: '#ffffffdc',
            borderRadius: 2,
          }}
          options={areas
            .filter(a =>
              removeTones(a.area.toLowerCase()).includes(removeTones(inputValue.toLowerCase()))
            )
            .slice(0, 6)}
          getOptionLabel={(option) => `${option.area}, ${option.city}`}
          value={area}
          onChange={(event, newValue) => setArea(newValue)}
          inputValue={inputValue} 
          onInputChange={(event, newInputValue) => setInputValue(newInputValue)}
          PopperComponent={(props) => <Popper {...props} placement="bottom-start" />} 
          renderInput={(params) => (
            <TextField
              {...params}
              label="Πληκτρολογήστε περιοχή"
              variant="outlined"
              InputProps={{
                ...params.InputProps,  // always keep this
                endAdornment: (
                  <>
                    {params.InputProps.endAdornment} {/* keep the default clear button */}
                    <InputAdornment position="end">
                      <FaSearch />
                    </InputAdornment>
                  </>
                ),
              }}
              InputLabelProps={{
                sx: {
                  fontSize: '18px',  
                  fontWeight: 'bold', 
                },
              }}
            />
          )}
          isOptionEqualToValue={(option, value) =>
            option.area === value.area && option.city === value.city
          }
        />
        </Box>
        <Box sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              px: 3,
              width: '60vw',
            }}
          >
          <Typography variant="h6" sx={{ fontWeight: 'bold', textAlign: 'left', mb : 2 }}>
            Διαθεσιμότητα
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2 }}>
            <FormControl>
              <RadioGroup
                name="radio-buttons-dayperiod"
                value={dayperiod}
                onChange={handleChangeDayperiod}
              >
                <FormControlLabel value="today" control={<Radio {...radioProps} />} label="Σήμερα" />
                <FormControlLabel value="tomorrow" control={<Radio {...radioProps} />} label="Αύριο" />
                <FormControlLabel value="next3" control={<Radio {...radioProps} />} label="Επόμενες 3 ημέρες" />
                <FormControlLabel value="nextweek" control={<Radio {...radioProps} />} label="Επόμενη εβδομάδα" />
                <FormControlLabel value="nextmonth" control={<Radio {...radioProps} />} label="Επόμενος μήνας" />
              </RadioGroup>
            </FormControl>
            <FormControl>
              <RadioGroup
                name="radio-buttons-timeperiod"
                value={timeperiod}
                onChange={handleChangeTimeperiod}
              >
                <FormControlLabel value="early" control={<Radio {...radioProps} />} label="Πρωί (8:00-12:00)" />
                <FormControlLabel value="noon" control={<Radio {...radioProps} />} label="Μεσημέρι (12:00-16:00)" />
                <FormControlLabel value="afternoon" control={<Radio {...radioProps} />} label="Απόγευμα (16:00-20:00)" />
              </RadioGroup>
            </FormControl>
          </Box>
          {errorMessage && (
            <Typography
              variant="body1"
              sx={{ color: 'red', mt: 2, fontWeight: 'bold', textAlign: 'center' }}
            >
              {errorMessage}
            </Typography>
          )}
        </Box>
        <Button 
          variant="contained" 
          color="black"
          onClick={handleSearch}
          sx={{
            transform: 'translateX(50%)',
            border: '2px solid black',
            position: "absolute",
            bottom: -25,           
            right: "50%",            
            fontWeight: 'bold',
            textTransform: 'none',
            boxShadow: 3,
            borderRadius: 3,
            width: '240px',
            height: '60px',
            bgcolor: '#A4C3DD',
            '&:hover': {
              bgcolor: '#c4dff5ff',
            },
          }}
        >
          <FaSearch style={{ marginRight: 8}}/>
          <Typography variant="h6" sx ={{ fontWeight: 'bold' }}>
          Αναζήτηση
          </Typography>
        </Button>
      </Box>
    </>
  );
};

export default SearchVet;