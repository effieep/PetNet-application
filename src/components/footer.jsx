import { Box, Typography, Link } from "@mui/material";

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: "#CACB80",
        mt: 6,
        py: 3,
        px: 3,
      }}
    >
      {/* TOP LINKS */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          gap: 3,
          mb: 3,
          flexWrap: "wrap",
        }}
      >
        <Link href="#" underline="hover" color="#726d6dff">
          Όροι χρήσης και δικαιώματα
        </Link>
        <Link href="#" underline="hover" color="#726d6dff">
          Θεσμικό Πλαίσιο
        </Link>
        <Link href="#" underline="hover" color="#726d6dff">
          Επικοινωνία
        </Link>
        <Link href="#" underline="hover" color="#726d6dff">
          Ενημέρωση
        </Link>
      </Box>

      {/* LOGOS */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: { xs: 2, md: 10 },
          flexWrap: "wrap",
        }}
      >
        <img src="/footer-logos/logo1.png" alt="Logo 1" height={40} />
        <img src="/footer-logos/logo2.png" alt="Logo 2" height={40} />
        <img src="/footer-logos/logo3.png" alt="Logo 3" height={40} />
      </Box>

      {/* COPYRIGHT */}
      <Typography
        sx={{
            textAlign: "center",
            fontSize: "0.8rem",
            mt: 3,
            color: "#726d6dff",
        }}
      >
        Copyright © 2025 – PetNet
      </Typography>
    </Box>
  );
};

export default Footer;
