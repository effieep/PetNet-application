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
          { 
            question: "Πώς βλέπω το βιβλιάριο υγείας του κατοικιδίου μου;", 
            answer: "Μπορείτε να το δείτε από το προφίλ σας, στην καρτέλα “Τα κατοικίδιά μου”, επιλέξτε το κατοικίδιο που επιθυμείτε και πατήστε στην επιλογή “βιβλιάριο υγείας”. Εκεί θα βρείτε όλες τις πληροφορίες σχετικά με την υγεία και το ιστορικό του κατοικιδίου σας." 
          },
          { 
            question: "Πώς βλέπω τα στοιχεία των ζώων μου;", 
            answer: "Μπορείτε να το δείτε από το προφίλ σας, στην καρτέλα “Τα κατοικίδιά μου”, επιλέξτε το κατοικίδιο που επιθυμείτε και δείτε τα στοιχεία του. Τα στοιχεία περιλαμβάνουν αριθμό microchip, όνομα, φύλο, φυλή, ημερομηνία γέννησης, βάρος." 
          },
          { 
            question: "Πώς μπορώ να προσθέσω νέο κατοικίδιο στο προφίλ μου;", 
            answer: "Δεν μπορείτε εσείς να προσθέσετε νέο κατοικίδιο. Μπορείτε να κλείσετε ραντεβού με έννα κτηνίατρο και να καταχωρήσει εκείνος το νεό σας κατοικίδιο." 
          },
        ],
        "Λογαριασμός & Προφίλ": [
          { 
            question: "Πώς μπορώ να αλλάξω τα στοιχεία του προφίλ μου;", 
            answer: "Από το προφίλ σας, στην καρτέλα “τα στοιχεία μου”, πατήστε το κουμπί “επεξεργασία” για να αλλάξετε τα στοιχεία σας. Μπορείτε να ενημερώσετε τα προσωπικά σας στοιχεία όπως όνομα, επώνυμο, τηλέφωνο και διεύθυνση." 
          },
        ],
        "Ραντεβού & Κτηνίατροι" : [
          {
            question: "Πώς κλείνω ραντεβού με κτηνίατρο;",
            answer: "Χρησιμοποιήστε την αναζήτηση για να βρείτε τον κτηνίατρο που επιθυμείτε. Στο προφίλ του, μεταβείτε στην καρτέλα 'Διαθεσιμότητα', επιλέξτε την ημέρα και την ώρα που σας εξυπηρετεί και πατήστε 'Κλείσε Ραντεβού'.Για να κλείσετε ραντεβού θα πρέπει να έχετε εγγραφεί ως Ιδιοκτήτες στην πλατφόρμα"
          },
          {
            question: "Πώς μπορώ να δω τα ραντεβού μου;",
            answer: "Μπορείτε να δείτε τα ραντεβού σας από τη σελίδα 'Τα Ραντεβού μου' στο προφίλ σας. Εκεί θα βρείτε μια λίστα με όλα τα επερχόμενα και παρελθοντικά ραντεβού σας."
          },
          {
            question: "Πώς ξέρω αν το ραντεβού μου επιβεβαιώθηκε;",
            answer : "Μόλις κάνετε το αίτημα, η κατάσταση θα είναι 'Εκκρεμεί Επιβεβαίωση'. Όταν ο κτηνίατρος το αποδεχτεί, θα λάβετε ειδοποίηση και η κατάσταση θα αλλάξει σε 'Επιβεβαιωμένο' στη λίστα των ραντεβού σας."
          },
          {
            question: "Μπορώ να ακυρώσω ένα ραντεβού;",
            answer: "Ναι, αρκεί να γίνει εγκαίρως. Πηγαίνετε στη σελίδα 'Τα Ραντεβού μου', βρείτε το συγκεκριμένο ραντεβού και πατήστε 'Ακύρωση'. Το ραντεβού μπορεί να ακυρωθεί ακόμα και αν είναι επιβεαιωμένο από τον κτηνίατρο"
          },
          {
            question: "Πώς μπορώ να αξιολογήσω έναν κτηνίατρο;",
            answer: "Μπορείτε να αφήσετε κριτική και βαθμολογία μόνο αφού ολοκληρωθεί ένα ραντεβού. Θα εμφανιστεί η επιλογή 'Αξιολόγηση Κτηνίατρου' δίπλα στο ιστορικό του ραντεβού."
          }
      ],
      "Απώλεια & Εύρεση Ζώων": [
        {
          question: "Τι πρέπει να κάνω αν χάσω το κατοικίδιό μου;",
          answer: "Δημιουργήστε άμεσα μια 'Δήλωση Απώλειας' από το μενού. Συμπληρώστε την τοποθεσία, την ώρα που χάθηκε, μια περιγραφή, στοιχεία επικοινωνίας και φωτογραφία. Η αγγελία θα εμφανιστεί δημόσια στη σελίδα Χάθηκε-Βρέθηκε Ζώο"
        },
        {
          question: "Βρήκα ένα αδέσποτο ζώο. Πώς μπορώ να βοηθήσω αν κάποιος το έχει χάσει;",
          answer: "Μπορείτε να δημιουργήσετε μια 'Δήλωση Εύρεσης'. Ανεβάστε φωτογραφία και την τοποθεσία που το βρήκατε. Αν το ζώο έχει microchip, αναφέρετέ το στην περιγραφή."
        },
        {
          question: "Πώς διαγράφω μια αγγελία αν βρεθεί το ζώο;",
          answer: "Στη σελίδα 'Οι Δηλώσεις μου', μπορείτε να βρείτε την αγγελία και να πατήσετε 'Βρήκα το Ζώο' για να την αφαιρέσετε από τη δημόσια προβολή.  "
        }
      ]

      }
  },
  {
    title: "Κτηνίατρος",
    boxColor: "#A4C3DD",
    icon: <FaUserDoctor size={70}/>,
    categories : {
       "Δημόσιο Προφίλ": [
          { 
            question: "Πώς φτιάχνω δημόσιο προφίλ για την πλατφόρμα αναζήτησης;", 
            answer: "Από το προφίλ σας μπορείτε να μπείτε στην καρτέλα “Δημόσιο προφίλ” και να επεξεργαστείτε τα στοιχεία που σας ζητάει. Μετά τη δημοσιοποίηση μπορείτε να το επεξεργαστείτε ελεύθερα ανά πάσα στιγμή." 
          },
          {
            question: "Πώς μπορώ να ενημερώσω τα στοιχεία του ιατρείου μου;",
            answer: "Μεταβείτε στο 'Προφίλ' και επιλέξτε 'Επεξεργασία'. Είναι σημαντικό να διατηρείτε ενημερωμένη τη διεύθυνση και το τηλέφωνό σας, καθώς αυτά εμφανίζονται στους ιδιοκτήτες κατά την αναζήτηση."
          },
          {
            question: "Μπορώ να προσθέσω εξειδίκευση;",
            answer: "Ναι, στο προφίλ σας μπορείτε να επιλέξετε τις ειδικότητές σας (π.χ. Παθολογία, Χειρουργική, Δερματολογία) ώστε να σας βρίσκουν ευκολότερα οι ιδιοκτήτες που αναζητούν συγκεκριμένες υπηρεσίες."
          }
        ],
        "Ραντεβού & Διαθεσιμότητα": [
          { 
            question: "Πώς ορίζω τη διαθεσιμότητά μου για ραντεβού;",
            answer: "Πηγαίνετε στη 'Διαχείριση Ραντεβού' στην καρτέλα 'Διαχείριση Διαθεσιμότητας'. Μπορείτε να χρησιμοποιήσετε την αυτόματη γεννήτρια για να ορίσετε επαναλαμβανόμενο ωράριο ή να προσθέσετε μεμονωμένα ραντεβού για συγκεκριμένες ημέρες."
          },
          {
            question: "Πώς διαχειρίζομαι τα αιτήματα ραντεβού;",
            answer: "Στη σελίδα 'Διαχείριση Ραντεβού' στη καρτέλα 'Διαχείριση Αιτημάτων Ραντεβού', θα δείτε όλα τα αιτήματα που έχουν γίνει από ιδιοκτήτες. Μπορείτε να αποδεχτείτε ή να απορρίψετε κάθε αίτημα. Μόλις αποδεχτείτε ένα ραντεβού, ο ιδιοκτήτης θα ειδοποιηθεί αυτόματα ότι το ραντεβού του επιβεβαιώθηκε."
          },
          {
            question: "Πώς ολοκληρώνω ένα ραντεβού;",
            answer: "Στη σελίδα 'Διαχείριση Ραντεβού', στην καρτέλα 'Προγραμματισμένα Ραντεβού', θα δείτε μια λίστα με όλα τα επιβεβαιωμένα ραντεβού. Μόλις ολοκληρωθεί ένα ραντεβού, πατήστε το κουμπί 'Ολοκλήρωση' δίπλα στο αντίστοιχο ραντεβού. Αυτό θα ενημερώσει τον ιδιοκτήτη ότι το ραντεβού έχει ολοκληρωθεί και θα του επιτρέψει να αφήσει κριτική."
          },
        ],
        "Διαχείριση Ζώων": [
          {
            question: "Πώς προσθέτω νέο κατοικίδιο στο σύστημα;",
            answer: "Από τη σελίδα 'Διαχείριση Ζώων' και στην καρτέλα 'Καταγραφή Νέου Κατοικιδίου´. Κατά τη διάρκεια ενός ραντεβού με έναν ιδιοκτήτη, έχετε την επιλογή να προσθέσετε το κατοικίδιο του ιδιοκτήτη στο σύστημα. Απλώς συμπληρώστε τα απαραίτητα στοιχεία του κατοικιδίου όπως όνομα, φυλή, φύλο, ημερομηνία γέννησης και αριθμό microchip.Υπάρχει και η δυνατότητα προσωρινής αποθήκευσης των στοιχείων αν δεν έχετε όλα τα δεδομένα διαθέσιμα εκείνη τη στιγμή."
          },
          {
            question: "Πώς ενημερώνω το βιβλιάριο υγείας ενός κατοικιδίου;",
            answer: "Καταγράφοντας μία ιατρική πράξη κατά τη διάρκεια ενός ραντεβού, αυτή θα αποθηκευτεί αυτόματα στο βιβλιάριο υγείας του κατοικιδίου. Μπορείτε να προσθέσετε εμβολιασμούς, θεραπείες, διαγνώσεις και άλλα σημαντικά ιατρικά δεδομένα που αφορούν την υγεία του κατοικιδίου."
          },
          {
            question: "Μπορώ να κάνω αλλαγή ιδιοκτήτη σε ένα κατοικίδιο;",
            answer: "Ναι, μπορείτε να αλλάξετε τον ιδιοκτήτη ενός κατοικιδίου από τη σελίδα 'Διαχείριση Ζώων' στην καρτέλα 'Καταγραφή συμβάντος ζωής'-> Μεταβίβαση. Επιλέξτε το κατοικίδιο που θέλετε να ενημερώσετε και αλλάξτε τα στοιχεία του ιδιοκτήτη όπως απαιτείται."
          },
          {
            question: "Mπορώ να δω παλιότερα ιατρικά αρχεία ενός κατοικιδίου;",
            answer: "Ναι, αν και την καταγραφή στο σύστημα την κάνει ένας κτηνίατρος, οι επόμενοι μπορούν να δουν το ιστορικό του κατοικιδίου από το βιβλιάριο υγείας του. Όλα τα ιατρικά αρχεία, οι θεραπείες και οι διαγνώσεις που έχουν καταγραφεί θα είναι διαθέσιμα για ανασκόπηση."
          },
          {
            question: "Μπορώ να δω κάπου το ιστορικό των τελευταίων ενεργειών μου;",
            answer: "Ναι, στη σελίδα 'Διαχείριση Ζώων' υπάρχει η καρτέλα 'Ιστορικό Ενεργειών' όπου μπορείτε να δείτε όλες τις πρόσφατες ενέργειες που έχετε πραγματοποιήσει, όπως καταχωρήσεις νέων κατοικιδίων, ενημερώσεις βιβλιαρίων υγείας και άλλες σημαντικές δραστηριότητες."
          }
        ]
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
                  mb: 3,
                  mt: 2
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