import { Box, Typography, Accordion, AccordionSummary, AccordionDetails, TextField, InputAdornment } from '@mui/material';
import { MdHelp } from 'react-icons/md';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PetOwnerIcon from './../components/PetOwnerIcon.jsx';
import { FaUserDoctor } from 'react-icons/fa6';
import { FaSearch } from 'react-icons/fa';
import { IoArrowBackCircleOutline } from 'react-icons/io5';
import { useEffect, useState } from 'react';

const cards = 
[
  {
    title: "Ιδιοκτήτης",
    boxColor: "#DAC418",
    icon: <PetOwnerIcon size={70}/>,
    categories : {
       "Κατοικίδια": [
          { question: "Πώς βλέπω το βιβλιάριο υγείας του κατοικιδίου μου;", answer: "Μπορείτε να το δείτε από το προφίλ σας, στην καρτέλα “τα κατοικίδια μου”, επιλέξτε το κατοικίδιο που επιθυμείτε και πατήστε στην επιλογή “βιβλιάριο υγείας”. Εκεί θα βρείτε όλες τις πληροφορίες σχετικά με την υγεία και το ιστορικό του κατοικιδίου σας." },
          { question: "Πώς βλέπω τα στοιχεία των ζώων μου;", answer: "Μπορείτε να το δείτε από το προφίλ σας, στην καρτέλα “τα κατοικίδια μου”, επιλέξτε το κατοικίδιο που επιθυμείτε και δείτε τα στοιχεία του. Τα στοιχεία περιλαμβάνουν αριθμό microchip, όνομα, φύλο, φυλή, ημερομηνία γέννησης, βάρος." }
        
        ],
    
      }
  },
  {
    title: "Κτηνίατρος",
    boxColor: "#A4C3DD",
    icon: <FaUserDoctor size={70}/>,
    categories : {
       "Δημόσιο Προφίλ": [
          { question: "Πώς φτιάχνω δημόσιο προφίλ για την πλατφόρμα αναζήτησης;", answer: "Από το προφίλ σας μπορείτε να μπείτε στην καρτέλα “Δημόσιο προφίλ” και να επεξεργαστείτε τα στοιχεία που σας ζητάει. Μετά τη δημοσιοποίηση μπορείτε να το επεξεργαστείτε ελεύθερα ανά πάσα στιγμή." },
       
        ],
        "Ραντεβού & Αξιολογήσεις": [
          { question: "Πώς διαχειρίζομαι τα αιτήματα για ραντεβού;", answer: "Από τη σελίδα “Διαχείριση ραντεβού” πατώντας το κουμπί “Διαχείριση αιτημάτων ραντεβού” μπορείτε να απορρίψετε ή να επιβεβαίωσετε ένα αίτημα που έχει κάνει ένας πελάτης για ραντεβού με εσάς." },

        ],
    }
  }
];

const normalizeString = (str) => {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}


const Help = () => {

  const [selectedCard, setSelectedCard] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [selectedCard]);

  if (selectedCard !== null) {
    return (
      <>
        <Box sx={{ position: 'relative', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 3, flexDirection: 'column' }}>
          <Box> 
            <Box 
              onClick={() => setSelectedCard(null)}
              sx={{ 
                position: 'absolute',
                left: 50,
                display: 'flex',
                cursor: 'pointer',
                color: '#373721',
                transition: 'transform 0.2s',
                '&:hover': { transform: 'scale(1.1)' }
              }}
            >
              <IoArrowBackCircleOutline size={45} />
            </Box>

            <Typography 
              variant="h4" 
              sx={{ 
                fontWeight: 'bold', 
                color: '#373721', 
                textAlign: 'center' 
              }}
            >
              Συχνές Ερωτήσεις
            </Typography>
          </Box>
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              position: "relative", 
              width: "70vw", 
              backgroundColor: selectedCard.boxColor, 
              borderRadius: 2, 
              mt: 5, 
              border: '2px solid #000000',
              py: 3
            }}
          >
              <Box sx={{ position: 'absolute', left: 16, display: 'flex', color: '#373721' }}>
                {selectedCard.icon}
              </Box>

              <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#373721' }}>
                {selectedCard.title}
              </Typography>

          </Box>
          <TextField
            label="Αναζήτηση με λέξεις-κλειδιά..."
            variant="outlined"
            fullWidth
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              endAdornment: (
              <>
                <InputAdornment position="end">
                  <FaSearch size={25} />
                </InputAdornment>
              </>
            ),
            }}
            sx={{ mx: 'auto', mt: 4, display: 'block', backgroundColor: '#fff', borderRadius: 2, maxWidth: "25vw" }}
          />
          <Box sx={{ maxWidth: 800, mx: 'auto', mt: 4, p: 2 }}>
          {Object.entries(selectedCard.categories).map(([category, questions]) => {
            
            const filteredQuestions = questions.filter((q) => 
              normalizeString(q.question).includes(normalizeString(normalizeString(searchQuery))) || 
              normalizeString(q.answer).includes(normalizeString(normalizeString(searchQuery)))
            );

            if (filteredQuestions.length === 0) return null;

            return (
            <Box key={category}>
              <Typography 
                variant="h5" 
                component="h2" 
                sx={{ 
                  textAlign: 'center', 
                  fontWeight: 'bold', 
                  color: '#373721',
                  mb: 3 
                }}
              >
                {category}
              </Typography>
              {filteredQuestions.map((q) => (
                  <Accordion 
                    sx={{ 
                      boxShadow: '0px 4px 10px rgba(0,0,0,0.1)',
                      borderRadius: 2, 
                      '&:before': { display: 'none' }, 
                      overflow: 'hidden',
                      mb: 4
                    }}
                  >
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon sx={{ color: '#000' }} />} 
                      aria-controls="panel1-content"
                      id="panel1-header"
                      sx={{
                        '& .MuiAccordionSummary-content': {
                          my: 2,
                        },
                        borderBottom: '2px solid #e0e0e0',
                      }}
                    >
                      <Typography sx={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
                        {q.question}
                      </Typography>
                    </AccordionSummary>
        
                    <AccordionDetails>
                      <Typography color="#3d3a3a">
                        {q.answer}
                      </Typography>
                    </AccordionDetails>
                  </Accordion>
            ))}
            </Box>
            );
          })}


        </Box>

        </Box>
      </>
    );
  }
            
  return (
    <>
        <Box sx={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography variant="h4" sx = {{ fontWeight: 'bold', color: '#373721', display: 'flex', alignItems: 'center', gap: 1 }}>
              <MdHelp verticalAlign="middle" /> Χρειάζεσαι Βοήθεια;
            </Typography>
            <Typography variant="h6" sx={{ mt: 2, maxWidth: 600, color: '#555555' }}>
              Πάτα στην αντίστοιχη καρτέλα και θα πάρεις τις απαντήσεις που θες!
            </Typography>
            <Box sx={{ mt: 5, mb: 10, display: 'flex', flexDirection: 'row', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
              {cards.map((card, idx) => {
                return (
                  <Box key={idx} sx={{ mb: 2, backgroundColor: card.boxColor, width: 350, height: "100%", borderRadius: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', boxShadow: 3, border: '2px solid #000000', 
                      '&:hover': {
                        transform: "scale(1.05)",
                        transition: "transform 0.3s ease-in-out",
                        boxShadow: 6,
                        cursor: 'pointer'
                      }
                    }}
                    onClick={() => { setSelectedCard(cards[idx]); }}
                  >
                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#373721', my: 2 }}>
                      {card.title}
                    </Typography>
                    <Typography sx={{ width: '90%', color: '#373721' }}>
                      {card.icon}
                    </Typography>
                  </Box>
                );
              })}
            </Box>
        </Box>
    </>
  );
};

export default Help;