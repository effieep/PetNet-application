import { Box, Typography } from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import PetsIcon from "@mui/icons-material/Pets";
import { Link } from "react-router-dom";
import UniversalButton from "./UniversalButton";

export default function LostAndFoundHeader({
  lostPath = "/report-lost-pet",
  foundPath = "/report-found-pet",
}) {
  return (
    <Box
      sx={{
        backgroundColor: "#efe092",
        color: "#1a1a1a",
        px: { xs: 3, md: 8 },
        py: { xs: 3, md: 3 },
      }}
    >
      <Box component="nav" sx={{ fontSize: 14, fontWeight: 700, mb: { xs: 4, md: 0 } }}>
        <Typography
          component={Link}
          to="/"
          sx={{ color: "inherit", textDecoration: "none" }}
        >
          Αρχική
        </Typography>
        <Box component="span" sx={{ mx: 1 }}>
          ▶
        </Box>
        <Typography
          component={Link}
          to="/lost_found"
          sx={{ color: "inherit", textDecoration: "underline" }}
        >
          Χάθηκε/Βρέθηκε_Ζώο
        </Typography>
      </Box>

      <Box
        sx={{
          maxWidth: 1000,
          mx: "auto",
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: "center",
          justifyContent: "center",
          gap: { xs: 4, md: 5 },
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
            <Typography component="h2" sx={{ fontSize: 24, fontWeight: 700, m: 0 }}>
              Έχασα κατοικίδιο
            </Typography>
          </Box>

          <Box sx={{ width: 280, height: 3, backgroundColor: "#000", mb: 3.75 }} />

          <Typography sx={{ fontSize: 18, lineHeight: 1.5, mb: 5, maxWidth: 350 }}>
            Δήλωσε την απώλεια του κατοικιδίου σου και ανέβασε φωτογραφία, περιγραφή και περιοχή.
          </Typography>

          <UniversalButton
            text="Δήλωση Απώλειας"
            path={lostPath}
            bgColor="#444732"
            textColor="#ffffff"
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
          <Box sx={{ width: 10, height: 10, backgroundColor: "#8c8e6a", borderRadius: "50%" }} />
          <Box sx={{ width: "3px", height: 300, backgroundColor: "#8c8e6a" }} />
          <Box sx={{ width: 10, height: 10, backgroundColor: "#8c8e6a", borderRadius: "50%" }} />
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
            <Typography component="h2" sx={{ fontSize: 24, fontWeight: 700, m: 0 }}>
              Βρήκα κατοικίδιο
            </Typography>
          </Box>

          <Box sx={{ width: 280, height: 3, backgroundColor: "#000", mb: 3.75 }} />

          <Typography sx={{ fontSize: 18, lineHeight: 1.5, mb: 5, maxWidth: 350 }}>
            Δήλωσε την εύρεση του ζώου και δες αν το microchip ταιριάζει με κάποια ενεργή απώλεια.
          </Typography>

          <UniversalButton
            text="Δήλωση Εύρεσης"
            path={foundPath}
            bgColor="#444732"
            textColor="#ffffff"
          />
        </Box>
      </Box>
    </Box>
  );
}