import { Box, Button, Typography } from "@mui/material";
import { Link } from "react-router-dom";

export default function LostPetRequirements({
  foundPath = "/report-found-pet",
}) {
  return (
    <Box
      sx={{
        backgroundColor: "#efe092",
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

        {/* <Typography
          sx={{
            fontSize: 18,
            lineHeight: 1.6,
            mt: 3.75,
            mb: 5,
            maxWidth: 800,
            mx: "auto",
          }}
        >
          Με τον αριθμό microchip του ζώου το σύστημα μπορεί να αναγνωρίσει αν υπάρχει ενεργή δήλωση
          απώλειας ζώου με τον ίδιο αριθμό
        </Typography> */}

        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 2 }}>
          <Button
            component={Link}
            to={foundPath}
            sx={{
              backgroundColor: "#7a7a5a",
              color: "white",
              px: { xs: 4, md: 6 },
              py: { xs: 1.5, md: 2 },
              borderRadius: "30px",
              fontSize: { xs: 16, md: 20 },
              fontWeight: 700,
              textTransform: "none",
              boxShadow: "0 8px 15px rgba(0,0,0,0.2)",
              transition: "transform 0.2s, filter 0.2s",
              "&:hover": {
                backgroundColor: "#7a7a5a",
                filter: "brightness(0.92)",
                transform: "scale(1.05)",
              },
            }}
          >
            Δήλωση απώλειας
          </Button>
        </Box>
      </Box>
    </Box>
  );
}   