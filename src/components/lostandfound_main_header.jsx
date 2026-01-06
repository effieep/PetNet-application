import { Box, Container, Typography } from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import PetsIcon from "@mui/icons-material/Pets";
import UniversalButton from "./UniversalButton";

export default function LostAndFoundHeader({
  lostPath = "/lost-found/lost_pet",
  foundPath = "/lost-found/found_pet",
}) {
  return (
    <Box
      sx={{
        width: "100%",
        height: { xs: "55vh", md: "60vh" },
        backgroundImage: `url('/lost_a_pet_hero.jpg')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        maxHeight: "520px",
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
      }}
    >
      {/* Σκούρο overlay για να φαίνεται το κείμενο */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background: "rgba(0,0,0,0.62)",
          zIndex: 1,
          pointerEvents: "none",
        }}
      />

      <Container
        maxWidth="lg"
        sx={{
          position: "relative",
          zIndex: 2,
          px: { xs: 3, md: 8 },
          py: { xs: 3, md: 3 },
          textShadow: "0 2px 8px rgba(0,0,0,0.7)",
          color: "#ffffff",
        }}
      >
        <Box
          sx={{
            maxWidth: 1000,
            mx: "auto",
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            alignItems: "center",
            justifyContent: "center",
            gap: { xs: 4, md: 5 },
            // transform: { xs: "none", md: "translateX(-px)" },
          }}
        >
          {/* Left Column: Lost Pet */}
          <Box
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.25, mb: 1.25 }}>
              <ErrorOutlineIcon sx={{ fontSize: 32 }} />
              <Typography component="h3" sx={{fontSize: { xs: "25px", md: "28px", lg: "30px" }, textAlign: "center",fontWeight: "bold", mb: 0 }}>
                Έχασα κατοικίδιο
              </Typography>
            </Box>

            {/* <Box sx={{ width: 280, height: 3, backgroundColor: "rgba(255,255,255,0.85)", mb: 3.75 }} /> */}

            <Typography variant="h5" sx={{ fontSize: { xs: "20px", md: "23px", lg: "25px" }, textAlign: "center", maxWidth: "500px", mb: 5 }}>
              Δήλωσε την απώλεια του κατοικιδίου σου και ανέβασε φωτογραφία, περιγραφή και περιοχή.
            </Typography>

            <UniversalButton
              text="Δήλωση Απώλειας"
              path={lostPath}
              bgColor="#F1D77A"
              textColor="#373721"
            />
          </Box>

          {/* Vertical Divider */}
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Box sx={{ width: 10, height: 10, backgroundColor: "rgba(255,255,255,0.70)", borderRadius: "50%" }} />
            <Box sx={{ width: "3px", height: 300, backgroundColor: "rgba(255,255,255,0.55)" }} />
            <Box sx={{ width: 10, height: 10, backgroundColor: "rgba(255,255,255,0.70)", borderRadius: "50%" }} />
          </Box>

          {/* Right Column: Found Pet */}
          <Box
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.25, mb: 1.25 }}>
              <PetsIcon sx={{ fontSize: 32 }} />
              <Typography component="h3" sx={{fontSize: { xs: "25px", md: "28px", lg: "30px" }, textAlign: "center",fontWeight: "bold", mb: 0 }}>
                Βρήκα κατοικίδιο
              </Typography>
            </Box>

            {/* <Box sx={{ width: 280, height: 3, backgroundColor: "rgba(255,255,255,0.85)", mb: 3.75 }} /> */}

            <Typography variant="h5" sx={{ fontSize: { xs: "20px", md: "23px", lg: "25px" }, textAlign: "center", maxWidth: "500px", mb: 5 }}>
              Δήλωσε την εύρεση του ζώου και δες αν το microchip ταιριάζει με κάποια ενεργή απώλεια.
            </Typography>

            <UniversalButton
              text="Δήλωση Εύρεσης"
              path={foundPath}
              bgColor="#6C6D49"
              textColor="#ffffff"
            />
          </Box>
        </Box>
      </Container>
    </Box>
  );
}