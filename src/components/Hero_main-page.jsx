import { Box, Container, Typography } from "@mui/material";
import heroImg from '../hero-image.svg';
import UniversalButton from "./UniversalButton";

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
            <UniversalButton 
                text="Είμαι ιδιοκτήτης" 
                path="/owner" 
                bgColor="#F1D77A" 
                textColor="#373721" 
            />

            {/* 2. Κουμπί Κτηνιάτρου */}
            <UniversalButton 
                text="Είμαι κτηνίατρος" 
                path="/vet" 
                bgColor="#6C6D49" 
                textColor="#ffffff" 
            />
            </Box>
      </Container>
    </Box>
  );
}
