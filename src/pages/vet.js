
import { Box, Typography, Divider, Container, Grid, Avatar} from "@mui/material";
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import PublicIcon from '@mui/icons-material/Public';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import { CiGlobe, CiCalendar   } from "react-icons/ci";
import { MdOutlinePets } from "react-icons/md";
import UButton from "../components/UniversalButton"; 

const managementItems = [
  "Καταχώρηση Ζώου & Βιβλιάριο: Εγγραφή ζώου και δημιουργία ηλεκτρονικού βιβλιαρίου υγείας συνδεδεμένου με τον ιδιοκτήτη.",
  "Ιατρικές Πράξεις: Καταγραφή εμβολιασμών, επεμβάσεων, θεραπειών και διαγνωστικών με αυτόματη ενημέρωση του βιβλιαρίου.",
  "Συμβάντα Ζωής: Διαχείριση υιοθεσίας, αναδοχής, μεταβίβασης, απώλειας, εύρεσης και θανάτου.",
  "Ιστορικό Επισκέψεων: Προβολή όλων των επισκέψεων και των αντίστοιχων ιατρικών πράξεων."
];

const appointmentsItems = [
  "Αιτήματα Ραντεβού: Λήψη και διαχείριση αιτημάτων από ιδιοκτήτες.",
  "Διαχείριση Ραντεβού: Επιβεβαίωση ή απόρριψη ραντεβού ανάλογα με τη διαθεσιμότητα.",
  "Αξιολογήσεις: Παρακολούθηση των αξιολογήσεων από τους πελάτες σας.",
  "Διαθεσιμότητα: Δημιουργία και προσαρμογή του προσωπικού σας ωραρίου."
];

const profileItems = [
  "Διαμόρφωση Προφίλ: Δημιουργήστε ένα ολοκληρωμένο δημόσιο προφίλ που αναδεικνύει τις υπηρεσίες σας και προσελκύει νέους πελάτες.",
  "Επαγγελματικά Στοιχεία: Παρουσίαση σπουδών, εμπειρίας και παρεχόμενων υπηρεσιών με οργανωμένο και εύχρηστο τρόπο.",
  "Επεξεργασία Προφίλ: Ενημέρωση και προσωρινή αποθήκευση αλλαγών οποιαδήποτε στιγμή"
];

function renderBoldBullet(item) {
  const [first, ...rest] = item.split(":");
  return (
    <>
      <strong>{first}:</strong> {rest.join(":").trim()}
    </>
  );
}

const Vet = () => {
  return (
    <>
        <Box sx ={{ display: "flex", gap: 60, justifyContent: "center" }}>
          <UButton 
            text="Διαχείριση Κατοικιδίων"
            path="/vet/pets" 
            bgColor="#0c0c0868"
            textColor="#ffffffff"
          />
          <UButton 
            text="Διαχείριση Ραντεβού"
            path="/vet/appointments"
            bgColor="#0c0c0868"
            textColor="#ffffffff"
          />
        </Box>
        <Typography variant="h4" align="center" sx={{mt : 3, fontSize: '20px', fontWeight: 'bold', color: '#42422B' }}>
          Τι μπορείτε να κάνετε στην πλατφόρμα;
        </Typography>
        <Box
          sx={{
          display: "flex",
          gap: 3,
          justifyContent: "space-between",
          mt: 4,
          p: 3,
          borderRadius: 3
        }}
      >
        {/* First box */}
        <Box sx={{ flex: 1, backgroundColor: "#CACB80", p: 2, borderRadius: 2, position: "relative" }}>
          <Box
            sx={{
              position: "absolute",
              top: -20, // move up outside the box
              left: -20, // move left outside the box
              backgroundColor: "#FFF9D9", // light circular background
              borderRadius: "50%",
              width: 80,
              height: 80,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: 1,
            }}
          >
            <MdOutlinePets style={{ fontSize: "48px", color: "#42422B" }} />
          </Box>
          <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1, textAlign: "center", textDecoration: "underline" }}>
            Διαχείριση Ζώων
          </Typography>
          <ul style={{ paddingLeft: "1.5rem", listStyleType: "disc", margin: 0 }}>
            {managementItems.map((item, index) => (
              <li key={index} style={{ marginBottom: "0.5rem", lineHeight: 1.5 }}>{renderBoldBullet(item)}</li>

            ))}
          </ul>
        </Box>
        {/* Second box */}
        <Box sx={{ flex: 1, backgroundColor: "#CACB80", p: 2, borderRadius: 2, position: "relative" }}>
          <Box
            sx={{
              position: "absolute",
              top: -20, // move up outside the box
              left: -20, // move left outside the box
              backgroundColor: "#FFF9D9", // light circular background
              borderRadius: "50%",
              width: 80,
              height: 80,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: 1,
            }}
          >
            <CiCalendar  style={{ fontSize: "48px", color: "#42422B" }} />
          </Box>
          <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1, textAlign: "center", textDecoration: "underline" }}>
            Ραντεβού και διαθεσιμότητα
          </Typography>
          <ul style={{ paddingLeft: "1.5rem", listStyleType: "disc", margin: 0 }}>
            {appointmentsItems.map((item, index) => (
              <li key={index} style={{ marginBottom: "0.5rem", lineHeight: 1.5 }}>{renderBoldBullet(item)}</li>
            ))}
          </ul>
        </Box>

        {/* Third box */}
        <Box sx={{ flex: 1, backgroundColor: "#CACB80", p: 2, borderRadius: 2, position: "relative" }}>
          <Box
            sx={{
              position: "absolute",
              top: -20, // move up outside the box
              left: -20, // move left outside the box
              backgroundColor: "#FFF9D9", // light circular background
              borderRadius: "50%",
              width: 80,
              height: 80,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: 1,
            }}
          >
            <CiGlobe style={{ fontSize: "48px", color: "#42422B" }} />
          </Box>
          <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1, textAlign: "center", textDecoration: "underline" }}>
            Δημόσιο Προφίλ
          </Typography>
          <ul style={{ paddingLeft: "1.5rem", listStyleType: "disc", margin: 0 }}>
            {profileItems.map((item, index) => (
              <li key={index} style={{ marginBottom: "0.5rem", lineHeight: 1.5 }}>{renderBoldBullet(item)}</li>
            ))}
          </ul>
        </Box>
      </Box>
      <Typography variant="h6" align="center" sx={{mt : 4, mb: 4, fontSize: '16px', fontWeight: 'bold', color: '#42422B' }}>
        *Απαιτείται εγγραφή για όλες τις υπηρεσίες.
      </Typography>
      <Divider sx={{borderBottomWidth: 1, borderColor: 'black', mx: 5, my: 3}}  />
      <Typography variant="h4" align="left" sx={{mx: 3, mt : 3, fontSize: '20px', fontWeight: 'bold', color: '#42422B' }}>
        Πώς λειτουργεί;
      </Typography>
      <Box
      sx={{
        width: '100%',
        py: 8,
        fontFamily: 'Roboto, sans-serif',
        color: '#000',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4} alignItems="flex-start" justifyContent="center">
          
          {/* --- STEP 1 --- */}
          <Grid item xs={12} md={4} sx={{ position: 'relative' }}>
            <Box display="flex" flexDirection="column" alignItems="center">
              {/* Icon Circle */}
              <Avatar
                sx={{
                  width: 120,
                  height: 120,
                  bgcolor: '#DB9245', // Darker circle background
                  mb: 3,
                  boxShadow: 1,
                }}
              >
                <AppRegistrationIcon sx={{ fontSize: 60, color: 'black' }} />
              </Avatar>

              {/* Arrow Connector (Visible on Desktop only) */}
              <Box
                sx={{
                  display: { xs: 'none', md: 'block' },
                  position: 'absolute',
                  top: 60, // Vertically center with Avatar
                  right: -25, // Push to right edge of column
                  zIndex: 0,
                  transform: 'translateY(-50%)'
                }}
              >
                <ArrowRightAltIcon sx={{ fontSize: 60, color: 'black' }} />
              </Box>

              {/* Text Content */}
              <Box sx={{ width: '100%', px: 2 }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom align="left">
                  1. Εγγραφή και Επαλήθευση Στοιχείων
                </Typography>
                <Typography variant="body1" gutterBottom align="left">
                  Συμπληρώνετε τα απαραίτητα επαγγελματικά στοιχεία σας:
                </Typography>
                <Box component="ul" sx={{ pl: 2, mt: 1, textAlign: 'left' }}>
                  <li><Typography variant="body2">Αριθμό Μητρώου Π.Κ.Σ.</Typography></li>
                  <li><Typography variant="body2">Πτυχία & εξειδικεύσεις</Typography></li>
                  <li><Typography variant="body2">Διεύθυνση ιατρείου</Typography></li>
                </Box>
              </Box>
            </Box>
          </Grid>

          {/* --- STEP 2 --- */}
          <Grid item xs={12} md={4} sx={{ position: 'relative' }}>
            <Box display="flex" flexDirection="column" alignItems="center">
              {/* Icon Circle */}
              <Avatar
                sx={{
                  width: 120,
                  height: 120,
                  bgcolor: '#DB9245',
                  mb: 3,
                  boxShadow: 1,
                }}
              >
                <PublicIcon sx={{ fontSize: 60, color: 'black' }} />
              </Avatar>

              {/* Arrow Connector (Visible on Desktop only) */}
              <Box
                sx={{
                  display: { xs: 'none', md: 'block' },
                  position: 'absolute',
                  top: 60,
                  right: -25,
                  zIndex: 0,
                  transform: 'translateY(-50%)'
                }}
              >
                <ArrowRightAltIcon sx={{ fontSize: 60, color: 'black' }} />
              </Box>

              {/* Text Content */}
              <Box sx={{ width: '100%', px: 2 }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom align="left">
                  2. Δημιουργία Δημόσιου Προφίλ
                </Typography>
                <Typography variant="body1" gutterBottom align="left">
                  Ρυθμίζετε το προφίλ σας όπως θέλετε:
                </Typography>
                <Box component="ul" sx={{ pl: 2, mt: 1, mb: 2, textAlign: 'left' }}>
                  <li><Typography variant="body2">Παρουσίαση υπηρεσιών</Typography></li>
                  <li><Typography variant="body2">Αναλυτικές σπουδές & εμπειρία</Typography></li>
                  <li><Typography variant="body2">Φωτογραφίες</Typography></li>
                  <li><Typography variant="body2">Διαθεσιμότητα για ραντεβού</Typography></li>
                </Box>
                <Typography variant="body2" fontWeight="medium" align="left">
                  Το προφίλ σας γίνεται ορατό στους ιδιοκτήτες που αναζητούν τον κατάλληλο κτηνίατρο.
                </Typography>
              </Box>
            </Box>
          </Grid>

          {/* --- STEP 3 --- */}
          <Grid item xs={12} md={4}>
            <Box display="flex" flexDirection="column" alignItems="center">
              {/* Icon Circle */}
              <Avatar
                sx={{
                  width: 120,
                  height: 120,
                  bgcolor: '#DB9245',
                  mb: 3,
                  boxShadow: 1,
                }}
              >
                <CheckCircleOutlineIcon sx={{ fontSize: 60, color: 'black' }} />
              </Avatar>

              {/* Text Content */}
              <Box sx={{ width: '100%', px: 2 }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom align="left">
                  3. Έτοιμος για χρήση – Πλήρης Πρόσβαση
                </Typography>
                <Typography variant="body1" align="left">
                  Μετά την ενεργοποίηση, έχετε άμεση πρόσβαση σε όλες τις λειτουργίες:
                </Typography>
              </Box>
            </Box>
          </Grid>

        </Grid>
      </Container>
    </Box>
    </>
  );
};

export default Vet;