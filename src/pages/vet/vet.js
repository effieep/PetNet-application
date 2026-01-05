
import { Box, Typography, Divider, Container } from "@mui/material";
import { CiGlobe, CiCalendar   } from "react-icons/ci";
import { MdOutlinePets, MdPublic, MdContactPage   } from "react-icons/md";
import {FaCheckDouble } from "react-icons/fa";
import {CgArrowLongRight } from "react-icons/cg";
import UButton from "../../components/UniversalButton"; 

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
            path="/vet/manage-pets" 
            bgColor="#0c0c0868"
            textColor="#ffffffff"
          />
          <UButton 
            text="Διαχείριση Ραντεβού"
            path="/vet/manage-appointments"
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
      <Container sx={{ my: 4, display: 'flex', flexDirection: 'row', gap: 10, justifyContent: 'center', position: 'relative' }}>
        <Box sx={{position: 'relative', textAlign: 'center'}}>
          <MdContactPage  style={{ fontSize: "96px", color: "#42422B", position: "center", backgroundColor: "#DB9245", borderRadius: "50%", padding: 20 }} />

          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1}}>
            1. Εγγραφή και Επαλήθευση Στοιχείων 
          </Typography>
          <Typography>
            Συμπληρώνετε τα απαραίτητα επαγγελματικά στοιχεία σας:
            <ul>
              <li>Αριθμό Μητρώου Π.Κ.Σ.</li>
              <li>Πτυχία και Εξειδικεύσεις</li>
              <li>Διεύθυνση ιατρείου</li>
            </ul>
          </Typography>
        </Box>
        <CgArrowLongRight style={{ fontSize: "192px", color: "#42422B", alignSelf: "start"}} />
        <Box sx={{position: 'relative', textAlign: 'center'}}>
          <MdPublic  style={{ fontSize: "96px", color: "#42422B", position: "center", backgroundColor: "#DB9245", borderRadius: "50%", padding: 20 }} />
          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1}}>
            2. Δημιουργία Δημόσιου Προφίλ
          </Typography>
          <Typography>
            Ρυθμίζετε το προφίλ σας όπως θέλετε:
            <ul>
              <li>Παρουσίαση υπηρεσιών</li>
              <li>Αναλυτικές σπουδές & εμπειρία</li>
              <li>Φωτογραφίες</li>
              <li>Διαθεσιμότητα για ραντεβού</li>
            </ul>
            Το προφίλ σας γίνεται ορατό στους ιδιοκτήτες που αναζητούν τον κατάλληλο κτηνίατρο.
          </Typography>
        </Box>
        <CgArrowLongRight style={{ fontSize: "192px", color: "#42422B", alignSelf: "start" }} />
        <Box sx={{position: 'relative', textAlign: 'center'}}>
          <FaCheckDouble  style={{ fontSize: "96px", color: "#42422B", position: "center", backgroundColor: "#DB9245", borderRadius: "50%", padding: 20 }} />
          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1}}>
            3.  Έτοιμος για χρήση – Πλήρης Πρόσβαση
          </Typography>
          <Typography>
            Μετά την ενεργοποίηση, έχετε άμεση πρόσβαση σε όλες τις λειτουργίες
          </Typography>
        </Box>
      </Container>
    </>
  );
};

export default Vet;