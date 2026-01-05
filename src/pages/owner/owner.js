
import { Box, Typography, Divider, Button } from "@mui/material";
import UButton from "../../components/UniversalButton"; 
import { PiStethoscopeLight } from 'react-icons/pi';
import { BsPencilSquare  } from 'react-icons/bs';
import { MdPets } from 'react-icons/md';
import { useNavigate } from "react-router-dom";
import Hero from "../../components/Hero";

const vivliItems = [
  "Προβολή και εκτύπωση του βιβλιάριου υγείας (περιλαμβάνει όλα τα στοιχεία του ζώου σας, microchip αριθμό, φυλή κ.α.)",
  "Ιστορικό ιατρικών πράξεων (εμβολιασμοί, στειρώσεις, επεμβάσεις, αποπαρασιτώσεις)",
  "Υπενθυμίσεις για επερχόμενα εμβόλια ή προγραμματισμένες εξετάσεις"
]

const searchVetItems = [
  "Φίλτρα αναζήτησης που σας οδηγούν στον κτηνίατρο που ταιριάζει στις ανάγκες σας ",
  "Κλείσιμο ραντεβού on-line",
  "Παρακολούθηση κατάστασης ενός ραντεβού (εκκρεμές, επιβεβαιωμένο) και δυνατότητα ακύρωσης ",
  "Αξιολόγηση των κτηνίατρων που έχετε επισκεφτεί "
];

const lostItems = [
"  Ο αριθμός microchip, το κλειδί σε κάθε περίπτωση ",
"Δήλωση απώλειας εάν χάσατε το κατοικίδιο σας!",
"Δήλωση εύρεσης εάν βρήκατε το κατοικίδιο σας ή εάν εντοπίσατε ζώο που έχει δηλωθεί ότι χάθηκε"
];

const list1Items = [
 " Κλείστε ραντεβού με κτηνίατρο ",
"Ο κτηνίατρος καταχωρεί τα στοιχεία του ζώου σας και αρχικοποιεί το βιλιάριο υγείας του στην πλατφόρμα. ",
"Ο κτηνίατρος συνδέει τον λογαριασμό σας με το βιβλιάριο του ζώου ",
"Είστε έτοιμοι, τώρα μπορείτε να δείτε το βιλιάριο υγείας του!"
];

const list2Items = [
  "• Λογαριασμός Ιδιοκτήτη",
   "• Αρχικοποιημένο βιβλιάριο υγείας από κτηνίατρο",
  "• Αριθμός micro-chip"
];

const list3Items = [
"• Λογαριασμός Χρήστη",
"• Φωτογραφία του κατοικιδίου",
"• Αριθμός micro-chip, που είναι συνδεδεμένος με τον λογαριασμό σας",
"• Στοιχεία σχετικά με την περιοχή και την ημέρα που χάθηκε, το χρώμα, το φύλο κλπ"
];

const list4Items = [
  "• Φωτογραφία του ζώου που βρήκατε" ,
  "• Βασικές πληροφορίες για αυτό (είδος, φύλο, χρώμα, περιγραφή της κατάστασης που το βρήκατε)",
"• Ημερομηνία και ώρα εύρεσης και Τοποθεσία"
];



const Owner = () => {
  const navigate = useNavigate();
  return (
    <>
        <Hero image={'/owner-hero.png'} title={"Ιδιοκτήτης κατοικιδίου"} subtitle={"Όλες οι υπηρεσίες για ιδιοκτήτες σε ένα σημείο!"} height={"50vh"}/>
        <Box sx ={{ display: "flex", gap: 30, justifyContent: "center" }}>
          <UButton 
            text="Tα κατοικίδιά μου"
            path="/owner/pets" 
            bgColor="#0c0c0868"
            textColor="#ffffffff"
          />
          <UButton 
            text="Aναζήτηση Κτηνιάτρου"
            path="/owner/search-vet"
            bgColor="#0c0c0868"
            textColor="#ffffffff"
          />
          <UButton 
            text="Έχασα το Ζώο μου"
            path="/owner/lost_found"
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
              <MdPets  style={{ fontSize: "48px", color: "#42422B" }} />
          </Box>
          <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1, textAlign: "center", textDecoration: "underline" }}>
            Βιβλιάριο Υγείας & Ιατρικές πράξεις
          </Typography>
          <ul style={{ paddingLeft: "1.5rem", listStyleType: "disc", margin: 0 }}>
            {vivliItems.map((item, index) => (
              <li key={index} style={{ marginBottom: "0.5rem", lineHeight: 1.5 }}>{item}</li>

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
          <PiStethoscopeLight  style={{ fontSize: "48px", color: "#42422B" }} />
          </Box>
          <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1, textAlign: "center", textDecoration: "underline" }}>
            Αναζήτηση Κτηνιάτρου
          </Typography>
          <ul style={{ paddingLeft: "1.5rem", listStyleType: "disc", margin: 0 }}>
            {searchVetItems.map((item, index) => (
              <li key={index} style={{ marginBottom: "0.5rem", lineHeight: 1.5 }}>{item}</li>

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
              <BsPencilSquare  style={{ fontSize: "48px", color: "#42422B" }} />
          </Box>
          <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1, textAlign: "center", textDecoration: "underline" }}>
            Δήλωση Απώλειας - Εύρεσης
          </Typography>
          <ul style={{ paddingLeft: "1.5rem", listStyleType: "disc", margin: 0 }}>
            {lostItems.map((item, index) => (
              <li key={index} style={{ marginBottom: "0.5rem", lineHeight: 1.5 }}>{item}</li>

            ))}
          </ul>
        </Box>
      </Box>
      <Typography variant="h6" align="center" sx={{mt : 4, mb: 4, fontSize: '16px', fontWeight: 'bold', color: '#42422B' }}>
        *Απαιτείται εγγραφή για όλες τις υπηρεσίες.
      </Typography>
      <Divider sx={{borderBottomWidth: 1, borderColor: 'black', mx: 5, my: 3}}  />
      <Box
          sx={{
            display: "flex",
            gap: 1,
            justifyContent: "space-between",
            mt: 4,
            p: 3,
            borderRadius: 3
          }}
      >
        <Box sx={{ flex: 1, p: 2, borderRadius: 2, position: "relative" }}>
          <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1, textAlign: "center" }}>
            Πώς γίνεται η έκδοση του ηλεκτρονικού βιβλιαρίου υγείας;
          </Typography>
          <ol style={{ paddingLeft: "1.5rem", margin: 0, paddingTop: 20 }}>
            {list1Items.map((item, index) => (
              <li key={index} style={{ marginBottom: "0.5rem", lineHeight: 1.5 }}>{item}</li>
              
            ))}
          </ol>
        </Box>
        <Box sx={{ flex: 1, backgroundColor: "#FCEDB5", p: 2, borderRadius: 2, position: "relative", textAlign: "center", alignItems: "center", justifyContent: "center" }}>
          <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1, textAlign: "center", textDecoration: "underline" }}>
            Προυποθέσεις για την προβολή  
          </Typography>
          <Typography variant="body1" sx={{ textAlign: "center", mb: 2 }}>
            Για την προβολή/Εκτύπωση στοιχείων βιβλιαρίου υγείας κατοικιδίου, απαιτείται:
          </Typography>
          <ul style={{ paddingLeft: "1.5rem", listStyleType: "none", margin: 0, paddingBottom: 20 }}>
            {list2Items.map((item, index) => (
              <li key={index} style={{ marginBottom: "0.5rem", lineHeight: 1.5 }}>{item}</li>

            ))}
          </ul>
          <UButton
            text="Προβολή Βιβλιάριου"
            path="/owner/pets"
            bgColor="#8C8D5D"
            textColor="#ffffffff"
          />
        </Box>
      </Box>
      <Divider sx={{borderBottomWidth: 1, borderColor: 'black', mx: 5, my: 3}}  />
      <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%', mt: 4 }}>
      
      <Box sx={{ position: 'relative' }}>
        
        <Box 
          component="img"
          src="/find-vet-img.png"
          alt="Find a vet"
          sx={{ 
            display: 'block', 
            maxWidth: '100%',
            height: 'auto' 
          }}
        />

        <Button 
          onClick={() => navigate('/owner/search-vet')}
          variant="contained" 
          color="primary"
          to ="/owner/search-vet"
          sx={{
            textTransform: 'none',
            px: 4,
            py: 1.5,
            fontSize: '18px',
            position: 'absolute',
            left: '50%',
            bottom: '3%',
            transform: 'translate(-50%, -50%)', 
            whiteSpace: 'nowrap',
            backgroundColor: '#373721',
            borderRadius: '20px',
            ":hover": { backgroundColor: '#555532' }
          }}
        >
          Αναζήτηση Κτηνίατρου
        </Button>
      </Box>
    </Box>
    <Box
      sx={{
      display: "flex",
      flexDirection: 'column', 
      gap: 3,
      justifyContent: "space-between",
      mt: 4,
      p: 3,
      borderRadius: 3
      }}
    >
      <Box sx={{ flex: 1, backgroundColor: "#FCEDB5", p: 2, borderRadius: 2, position: "relative", textAlign: "center", alignItems: "center", justifyContent: "center", mx: 10 }}>
        <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1, textAlign: "center", textDecoration: "underline" }}>
          Απώλεια Ζώου
        </Typography>
        <Typography variant="body1" sx={{ textAlign: "center", mb: 2 }}>
          Αν χάσατε το κατοικίδιο σας, μπορείτε να κάνετε δήλωση απώλειας. Για να ολοκληρωθεί η δήλωση απαιτείται:
        </Typography>
        <ul style={{ paddingLeft: "1.5rem", listStyleType: "none", margin: 0, marginBottom: 20 }}>
          {list3Items.map((item, index) => (
            <li key={index} style={{ marginBottom: "0.5rem", lineHeight: 1.5 }}>{item}</li>

          ))}
        </ul>
        <UButton
          text="Δήλωση Απώλειας"
          path="/owner/lost_pet"
          bgColor="#787047"
          textColor="#ffffffff"
        />
      </Box>
      <Box sx={{ flex: 1, backgroundColor: "#FCEDB5", p: 2, borderRadius: 2, position: "relative", textAlign: "center", alignItems: "center", justifyContent: "center", mx: 10 }}>
        <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1, textAlign: "center", textDecoration: "underline" }}>
          Εύρεση Ζώου
        </Typography>
        <Typography variant="body1" sx={{ textAlign: "center", mb: 2 }}>
          Αν πιστέυετε οτι βρήκατε ένα χαμένο κατοικοίδιο, μπορείτε να κάνετε δήλωση εύρεσης. Για να ολοκληρωθεί η δήλωση απαιτείται:
        </Typography>
        <ul style={{ paddingLeft: "1.5rem", listStyleType: "none", margin: 0, marginBottom: 20 }}>
          {list4Items.map((item, index) => (
            <li key={index} style={{ marginBottom: "0.5rem", lineHeight: 1.5 }}>{item}</li>

          ))}
        </ul>
        <Typography variant="body1" sx={{ textAlign: "center", mt: 2, paddingTop: 5, marginBottom: 2 }}>
          Με τον αριθμό microchip του ζώου το σύστημα μπορεί να αναγνωρίσει αν υπάρχει ενεργή δήλωση απώλειας ζώου με τον ίδιο αριθμό
        </Typography> 
        <UButton
          text="Δήλωση Εύρεσης"
          path="/owner/found_pet"
          bgColor="#787047"
          textColor="#ffffffff"
        />
      </Box>
    </Box>
      
    </>
  );
};

export default Owner;