import { Box, Typography, IconButton } from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import React from "react";

const RecentPets = ({ pets }) => {
  const scrollRef = React.useRef(null);

  const scroll = (direction) => {
    const container = scrollRef.current;
    const scrollAmount = container.offsetWidth * 0.8;

    container.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  const IMAGE_HEIGHT = 180;

  return (
    <Box sx={{ mt: 6 }}>
      <Typography fontWeight="bold" mb={3}>
        Ζώα που χάθηκαν πρόσφατα:
      </Typography>

      {/* WRAPPER */}
      <Box sx={{ position: "relative" }}>
        
        {/* LEFT ARROW */}
        <IconButton
          onClick={() => scroll("left")}
          sx={{
            position: "absolute",
            left: -20,
            top: IMAGE_HEIGHT / 2, 
            transform: "translateY(-50%)",
            zIndex: 2,
            backgroundColor: "#ffffff",
            boxShadow: 3,
            "&:hover": { backgroundColor: "#f0f0f0" },
          }}
        >
          <ArrowBackIosNewIcon fontSize="small" />
        </IconButton>

        {/* SCROLL CONTAINER */}
        <Box
          ref={scrollRef}
          sx={{
            display: "flex",
            gap: 3,
            overflowX: "auto",
            scrollSnapType: "x mandatory",
            pb: 2,
            "&::-webkit-scrollbar": { display: "none" },
          }}
        >
          {pets.map((pet, index) => (
            <Box
              key={index}
              sx={{
                maxWidth: { xs: 180, sm: 220, md: 180 },
                scrollSnapAlign: "start",
                flexShrink: 0,
                mx: 2,
              }}
            >
              <Box
                component="img"
                src={pet.image}
                alt={"Photo of the lost pet"}
                sx={{
                  width: "100%",
                  height: IMAGE_HEIGHT,
                  objectFit: "cover",
                  height: IMAGE_HEIGHT,
                  borderRadius: 3,
                  backgroundColor: "#bcbc8a",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />

              <Typography fontSize="0.75rem" mt={1}>
                Περιοχή: {pet.area}
                <br />
                Τηλ. Επικοινωνίας: {pet.phone}
              </Typography>
            </Box>
          ))}
        </Box>

        {/* RIGHT ARROW */}
        <IconButton
          onClick={() => scroll("right")}
          sx={{
            position: "absolute",
            right: -20, 
            top: IMAGE_HEIGHT / 2, 
            transform: "translateY(-50%)",
            zIndex: 2,
            backgroundColor: "#ffffff",
            boxShadow: 3,
            "&:hover": { backgroundColor: "#f0f0f0" },
          }}
        >
          <ArrowForwardIosIcon fontSize="small" />
        </IconButton>
      </Box>
    </Box>
  );
};

export default RecentPets;