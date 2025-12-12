import { Box, Button, Container, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import heroImg from '../hero-image.svg';

export default function Hero() {
  return (
    <Box
      sx={{
        width: "100%",
        height: "80vh",
        backgroundImage:
          `url(${heroImg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        maxHeight: "600px",
        position: "relative",
        display: "flex",
        alignItems: "center",
        color: "white",
      }}
    >
      {/* Σκούρο overlay για να φαίνεται το κείμενο */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background: "rgba(0,0,0,0.45)",
        }}
      />

      {/* Κείμενο πάνω από την εικόνα */}
      <Container
        sx={{
          position: "relative",
          zIndex: 2,
          maxWidth: "600px",
          textShadow: "0 2px 8px rgba(0,0,0,0.7)",
          justifyContent: "left",
        }}
      >
        <Box 
            sx={
            { display: "flex", flexDirection: "column", alignItems: "left", maxWidth: "400px" }}>
            <Typography variant="h3" sx={{ textAlign: "center",fontWeight: "bold", mb: 4 }}>
            PetNet
            </Typography>

            <Typography variant="h5" sx={{ textAlign: "center", maxWidth: "500px", mb: 5 }}>
            Η παλτφόρμα που συνδέει άμεσα τα κατοικίδια με τους κτηνίατρους!
            </Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 2, maxWidth: "500px", ml: "-20px"}}>
            <Button component={Link} to = "/owner" sx={
                {   color: "white", 
                    textTransform: "none", 
                    backgroundColor: "#F1D77A", 
                    borderRadius: 20, px: 6, py: 1, 
                    marginRight: 2 , 
                }}>
                <Typography sx ={{fontWeight: 700, color: "#373721" }}>
                    Είμαι ιδιοκτήτης
                </Typography>
                
                </Button>

            <Button component={Link} to = "/vet" sx={
                { 
                    color: "white", 
                    textTransform: "none", 
                    backgroundColor: "#6C6D49", 
                    borderRadius: 20, 
                    px: 6, py: 1, 
                    marginRight: 2,
                }}>
                <Typography sx ={{fontWeight: 700, color: "#ffffffff" }}>
                    Είμαι κτηνίατρος
                </Typography>
                
                </Button>
            </Box>
      </Container>
    </Box>
  );
}
