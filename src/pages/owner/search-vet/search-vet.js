import Hero from '../../../components/Hero.jsx';
import { Box, Typography, FormControl, RadioGroup, FormControlLabel, Radio, Button, Autocomplete, TextField, Popper, InputAdornment, Divider } from '@mui/material';
import { useState, useEffect } from 'react';
import { API_URL } from '../../../api.js';
import CircularProgress from '@mui/material/CircularProgress';
import { FaFilter, FaSearch  } from 'react-icons/fa';
import VetCard from '../../../components/VetCard.jsx';
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

  const toggleRadio = (name, setter) => {
    const value = document.querySelector(`input[name="${name}"]:checked`)?.value;
    setter(prev => (prev === value ? null : value));
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

  const [vets, setVets] = useState([]);
  const [availableVets, setAvailableVets] = useState({list:[], searching: false});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVets = async () => {
      try {
        const response = await fetch(`${API_URL}/users?role=vet`);
        if (!response.ok) {
          throw new Error('Σφάλμα κατά την ανάκτηση των κτηνιάτρων');
        } 
        const data = await response.json();
        setVets(data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching all vets:", err);
        setError(err.message);
        setLoading(false);
      } 
    };
    fetchVets();
  }, []);

  const handleSearch = () => {
    if (!specialty && !area && !dayperiod && !timeperiod) {
      setErrorMessage('Παρακαλώ συμπληρώστε τουλάχιστον ένα κριτήριο αναζήτησης.');
      return;
    }
    setAvailableVets({list: [], searching: true}); 
    setErrorMessage(null); 
    for (let i = 0; i < vets.length; i++) {
      const vet = vets[i];
      if(!vet.availability || vet.availability.length === 0) {
        continue; 
      }
      if (specialty && vet.specialization.includes(specialty) === false) {
        continue; 
      }
      if(area) {
        let areaFilter = area.area;
        let cityFilter = area.city;
        if(areaFilter.includes("(Κέντρο)")) {
          areaFilter = areaFilter.split(" ")[0];
        } 
        areaFilter = removeTones(areaFilter.toLowerCase());
        cityFilter = removeTones(cityFilter.toLowerCase());
        const vetCity = removeTones(vet.clinicCity.toLowerCase());
        if(areaFilter !== vetCity && cityFilter !== vetCity) {
          continue;
        }
      }
      const todayDate = new Date();
      let filteredSlots = vet.availability?.filter(slot => {


        let slotDate = slot.date.replace('/', '-').replace('/', '-');
        const day = slotDate.split('-')[0];
        const month = slotDate.split('-')[1];
        const year = slotDate.split('-')[2]; 
        const hour = slot.time.split(':')[0];
        const minute = slot.time.split(':')[1];

        slotDate = new Date(year, month - 1, day, hour, minute, 0);
        const compareDates = slotDate - todayDate
        if(compareDates >= 0) {
          return true;
        }
        return false;
      });
      if(filteredSlots?.length === 0) {
        continue;
      }
      if(dayperiod) {
        if(dayperiod === 'today') {
          if(!filteredSlots?.some(slot => {
            const slotDate = slot.date.replace('/', '-').replace('/', '-');
            const day = slotDate.split('-')[0];
            const month = slotDate.split('-')[1];
            const year = slotDate.split('-')[2];
            const nowDay = todayDate.getDate().toString().padStart(2, '0');
            const nowMonth = (todayDate.getMonth() + 1).toString().padStart(2, '0');
            const nowYear = todayDate.getFullYear().toString();
            if(day === nowDay && month === nowMonth && year === nowYear){
              return true;
            }
            return false;
          })){
            continue;
          }
        }
        if(dayperiod === 'tomorrow') {
          const tomorrow = new Date(todayDate);
          tomorrow.setDate(tomorrow.getDate() + 1);
          if(!filteredSlots?.some(slot => {
            const slotDate = slot.date.replace('/', '-').replace('/', '-');
            const day = slotDate.split('-')[0];
            const month = slotDate.split('-')[1];
            const year = slotDate.split('-')[2];
            const tomDay = tomorrow.getDate().toString().padStart(2, '0');
            const tomMonth = (tomorrow.getMonth() + 1).toString().padStart(2, '0');
            const tomYear = tomorrow.getFullYear().toString();

            if(day === tomDay && month === tomMonth && year === tomYear){
              return true;
            }
            return false;
          })){
            continue;
          }
        }
        if(dayperiod === 'next3') {
          const next3 = new Date(todayDate);
          next3.setDate(next3.getDate() + 3);
          if(!filteredSlots?.some(slot => {
            let slotDate = slot.date.replace('/', '-').replace('/', '-');
            const day = slotDate.split('-')[0];
            const month = slotDate.split('-')[1];
            const year = slotDate.split('-')[2];
            slotDate = new Date(year, month - 1, day);
            if(slotDate <= next3){
              return true;
            }
            return false;
          })){
            continue;
          }
        }
        if(dayperiod === 'nextweek') {
          const nextweek = new Date(todayDate);
          nextweek.setDate(nextweek.getDate() + 7);
          if(!filteredSlots?.some(slot => {
            let slotDate = slot.date.replace('/', '-').replace('/', '-');
            const day = slotDate.split('-')[0];
            const month = slotDate.split('-')[1];
            const year = slotDate.split('-')[2];
            slotDate = new Date(year, month - 1, day);
            if(slotDate <= nextweek){
              return true;
            }
            return false;
          })){
            continue;
          }
        }
        if(dayperiod === 'nextmonth') {
          const nextmonth = new Date(todayDate);
          nextmonth.setMonth(nextmonth.getMonth() + 1);
          if(!filteredSlots?.some(slot => {
            let slotDate = slot.date.replace('/', '-').replace('/', '-');
            const day = slotDate.split('-')[0];
            const month = slotDate.split('-')[1];
            const year = slotDate.split('-')[2];
            slotDate = new Date(year, month - 1, day);
            if(slotDate <= nextmonth){
              return true;
            }
            return false;
          })){
            continue;
          }
        }
      }
      if(timeperiod) {
        if(timeperiod === 'early') {
          filteredSlots = filteredSlots?.filter(slot => {
            const hour = parseInt(slot.time.split(':')[0], 10);
            return hour >= 8 && hour < 12;
          });
        }
        if(timeperiod === 'noon') {
          filteredSlots = filteredSlots?.filter(slot => {
            const hour = parseInt(slot.time.split(':')[0], 10);
            return hour >= 12 && hour < 16;
          });
        }
        if(timeperiod === 'afternoon') {
          filteredSlots = filteredSlots?.filter(slot => {
            const hour = parseInt(slot.time.split(':')[0], 10);
            return hour >= 16 && hour < 20;
          });
        }
      }
      if(filteredSlots?.length === 0) {
        continue;
      }
      setAvailableVets(prev => ({list: [...prev.list, vet], searching: true}) );
    }
  };


  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Typography color="error" align="center" sx={{ mt: 10 }}>
        Σφάλμα: {error}
      </Typography>
    );
  }

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
            >
              <FormControlLabel value="Γενική Κτηνιατρική" control={<Radio {...radioProps} onClick={() => toggleRadio('radio-buttons-specialty' , setSpecialty)} />} label="Γενική Κτηνιατρική" />
              <FormControlLabel value="Παθολογία" control={<Radio {...radioProps} onClick={() => toggleRadio('radio-buttons-specialty' , setSpecialty)} />} label="Παθολογία" />
              <FormControlLabel value="Χειρουργική" control={<Radio {...radioProps} onClick={() => toggleRadio('radio-buttons-specialty' , setSpecialty)} />} label="Χειρουργική" />
              <FormControlLabel value="Οδοντιατρική" control={<Radio {...radioProps} onClick={() => toggleRadio('radio-buttons-specialty' , setSpecialty)} />} label="Οδοντιατρική" />
              <FormControlLabel value="Δερματολογία" control={<Radio {...radioProps} onClick={() => toggleRadio('radio-buttons-specialty' , setSpecialty)} />} label="Δερματολογία" />
              <FormControlLabel value="Οφθαλμολογία" control={<Radio {...radioProps} onClick={() => toggleRadio('radio-buttons-specialty' , setSpecialty)} />} label="Οφθαλμολογία" />
              <FormControlLabel value="Διατροφολογία" control={<Radio {...radioProps} onClick={() => toggleRadio('radio-buttons-specialty' , setSpecialty)} />} label="Διατροφολογία" />
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
              <FormControlLabel
                control={<Typography variant="subtitle1" sx={{ mb: 1 }}>Ημέρα</Typography>}
                label=""
                sx={{ mb: 1 }}
              />
              <RadioGroup
                name="radio-buttons-dayperiod"
                value={dayperiod}
              >
                <FormControlLabel value="today" control={<Radio {...radioProps} onClick={() => toggleRadio('radio-buttons-dayperiod', setDayperiod)}/>} label="Σήμερα" />
                <FormControlLabel value="tomorrow" control={<Radio {...radioProps} onClick={() => toggleRadio('radio-buttons-dayperiod', setDayperiod)}/>} label="Αύριο" />
                <FormControlLabel value="next3" control={<Radio {...radioProps} onClick={() => toggleRadio('radio-buttons-dayperiod', setDayperiod)}/>} label="Επόμενες 3 ημέρες" />
                <FormControlLabel value="nextweek" control={<Radio {...radioProps} onClick={() => toggleRadio('radio-buttons-dayperiod', setDayperiod)}/>} label="Επόμενη εβδομάδα" />
                <FormControlLabel value="nextmonth" control={<Radio {...radioProps} onClick={() => toggleRadio('radio-buttons-dayperiod', setDayperiod)}/>} label="Επόμενος μήνας" />
              </RadioGroup>
            </FormControl>
            <Divider orientation="vertical" flexItem sx={{ mx: 2, borderColor: 'black' }}/>
            <FormControl>
              <FormControlLabel
                control={<Typography variant="subtitle1" sx={{ mb: 1 }}>Ώρα</Typography>}
                label=""
                sx={{ mb: 1 }}
              />
              <RadioGroup
                name="radio-buttons-timeperiod"
                value={timeperiod}
              >
                <FormControlLabel value="early" control={<Radio {...radioProps} onClick={() => toggleRadio('radio-buttons-timeperiod', setTimeperiod)}/>} label="Πρωί (8:00-12:00)" />
                <FormControlLabel value="noon" control={<Radio {...radioProps} onClick={() => toggleRadio('radio-buttons-timeperiod', setTimeperiod)} />} label="Μεσημέρι (12:00-16:00)" />
                <FormControlLabel value="afternoon" control={<Radio {...radioProps} onClick={() => toggleRadio('radio-buttons-timeperiod', setTimeperiod)} />} label="Απόγευμα (16:00-20:00)" />
              </RadioGroup>
            </FormControl>
          </Box>
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
      

      {errorMessage && (
        <Typography
          variant="body1"
          sx={{ color: 'red', mt: 5, fontWeight: 'bold', textAlign: 'center' }}
        >
          {errorMessage}
        </Typography>
      )}
      <Box sx={{ 
        p: 4,
        pt: errorMessage ? 0 : 4
       }}>
        {availableVets.searching && (
          <>
          <Divider sx={{ my: 4, color: 'black'}} />
          <Typography variant="body1" sx={{ mb: 2, fontWeight: 'bold' }}>
            {`Βρέθηκαν ${availableVets.list.length} κτηνίατροι που πληρούν τα κριτήρια αναζήτησής σας.`}
          </Typography>
          </>
          )
        }
        {availableVets.list.length > 0 && (
            availableVets.list.map((vet) => (
              <>
              <VetCard
                key={vet.id}
                vet={{...vet, availability: vet.availability?.filter(slot => {

                  const todayDate = new Date();

                  let slotDate = slot.date.replace('/', '-').replace('/', '-');
                  const day = slotDate.split('-')[0];
                  const month = slotDate.split('-')[1];
                  const year = slotDate.split('-')[2]; 
                  const hour = slot.time.split(':')[0];
                  const minute = slot.time.split(':')[1];

                  slotDate = new Date(year, month - 1, day, hour, minute, 0);
                  const compareDates = slotDate - todayDate
                  if(compareDates >= 0) {
                    return true;
                  }
                  return false;
                })}}
                onBookAppointment={(id) => alert(`Πάτησες κράτηση για τον γιατρό με ID: ${id}`)}
              />
              </>

            ))
          ) 
        }
      </Box>
    </>
  );
};

export default SearchVet;