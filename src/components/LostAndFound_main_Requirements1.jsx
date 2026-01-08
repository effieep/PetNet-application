import { Box, Typography } from "@mui/material";
import UButton from "./UniversalButton";

export default function FoundPetRequirements({
  foundPath = "/lost-found/found_pet",
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
          Εύρεση Ζώου - Προϋποθέσεις δήλωσης
        </Typography>

        <Typography sx={{ fontSize: 18, lineHeight: 1.6, mb: 2.5 }}>
          Αν πιστεύετε ότι βρήκατε ένα χαμένο κατοικίδιο, μπορείτε να κάνετε δήλωση εύρεσης.
          Για να ολοκληρωθεί η δήλωση απαιτείται:
        </Typography>

        <Box component="ul" sx={{ m: 0, p: 0, listStyle: "none", my: 2.5 }}>
          <Box component="li" sx={{ fontSize: 18, mb: 1.25 }}>
            • Φωτογραφία του ζώου που βρήκατε
          </Box>
          <Box component="li" sx={{ fontSize: 18, mb: 1.25 }}>
            • Βασικές πληροφορίες για αυτό (είδος, φύλο, χρώμα, περιγραφή της κατάστασης που το βρήκατε)
          </Box>
          <Box component="li" sx={{ fontSize: 18, mb: 1.25 }}>
            • Ημερομηνία και ώρα εύρεσης και Τοποθεσία
          </Box>
        </Box>

        <Typography
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
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 2 }}>
          {/* <Button
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
            Δήλωση εύρεσης
          </Button> */}
          <UButton text="Δήλωση εύρεσης" path={foundPath} bgColor="#7a7a5a" textColor="white"/>

        </Box>
      </Box>
    </Box>
  );
}