import { Box, Typography } from "@mui/material";

const Hero = ({ image, title, subtitle, height = "60vh" }) => {
  return (
    <Box
      sx={{
        width: "100%",
        height: height,
        backgroundImage: `url(${image})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        display: "flex",
        alignItems: "center",
        position: "relative",
        marginBottom: 4,
        justifyContent: "center",
      }}
    >
      {/* Overlay για καλύτερη αναγνωσιμότητα */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          backgroundColor: "rgba(0,0,0,0.45)",
        }}
      />

      {/* Περιεχόμενο */}
      <Box
        sx={{
            position: "relative",
            zIndex: 1,
            color: "#fff",
            px: { xs: 2, md: 6 },
            textAlign: "center",     // ✅ οριζόντια στο κείμενο
            maxWidth: 900,
            }}
      >
        <Typography
          variant="h2"
          sx={{
            fontWeight: "bold",
            mb: 2,
            fontSize: { xs: "2rem", md: "3rem" },
          }}
        >
          {title}
        </Typography>

        <Typography
          variant="h6"
          sx={{
            maxWidth: "600px",
            fontSize: { xs: "1rem", md: "1.2rem" },
          }}
        >
          {subtitle}
        </Typography>
      </Box>
    </Box>
  );
};

export default Hero;
