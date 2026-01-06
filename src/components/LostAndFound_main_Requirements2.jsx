import { Box, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import Button from "./UniversalButton";

export default function LostPetRequirements({
  lostPath = "/lost-found/lost_pet",
}) {
  return (
    <Box
      sx={{
        // backgroundColor: "#efe092",
        px: { xs: 2.5, md: 3 },
        py: { xs: 4, md: 3 },
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        color: "#1a1a1a",
      }}
    >
      <Box
        sx={{
          backgroundColor: "#f7e9a8",
          borderRadius: "15px",
          px: { xs: 3, md: 7.5 },
          py: { xs: 4, md: 5 },
          maxWidth: 900,
          width: "100%",
          boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
          textAlign: "center",
        }}
      >
        <Typography
          component="h1"
          sx={{
            fontSize: { xs: 22, md: 28 },
            fontWeight: 700,
            textDecoration: "underline",
            mb: 3,
          }}
        >
          Απώλεια Ζώου - Προϋποθέσεις δήλωσης
        </Typography>

        <Typography sx={{ fontSize: 18, lineHeight: 1.6, mb: 2.5 }}>
          Αν χάσατε το κατοικίδιο σας, μπορείτε να κάνετε δήλωση απώλειας. Για να ολοκληρωθεί η δήλωση απαιτείται:
        </Typography>

        <Box component="ul" sx={{ m: 0, p: 0, listStyle: "none", my: 2.5 }}>
          <Box component="li" sx={{ fontSize: 18, mb: 1.25 }}>
            • Λογαριασμός Χρήστη
          </Box>
          <Box component="li" sx={{ fontSize: 18, mb: 1.25 }}>
            • Φωτογραφία του κατοικιδίου
          </Box>
          <Box component="li" sx={{ fontSize: 18, mb: 1.25 }}>
            • Αριθμός micro-chip, που είναι συνδεδεμένος με τον λογαριασμό σας
          </Box>
          <Box component="li" sx={{ fontSize: 18, mb: 1.25 }}>
            • Στοιχεία σχετικά με την περιοχή και την ημέρα που χάθηκε, το χρώμα, το φύλο κλπ
          </Box>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 2 }}>
          <Button text="Δήλωση απώλειας" path={lostPath} bgColor="#7a7a5a" textColor="white"/>
        </Box>
      </Box>
    </Box>
  );
}   