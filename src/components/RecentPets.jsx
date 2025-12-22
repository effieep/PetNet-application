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
            left: -10,
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 2,
            backgroundColor: "#ffffff",
          }}
        >
          <ArrowBackIosNewIcon />
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
          {pets.map((pet) => (
            <Box
              key={pet.id}
              sx={{
                minWidth: { xs: 180, sm: 220, md: 260 },
                scrollSnapAlign: "start",
              }}
            >
              <Box
                sx={{
                  height: 180,
                  borderRadius: 3,
                  backgroundColor: "#bcbc8a",
                  backgroundImage: `url(${pet.image})`,
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
            right: -10,
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 2,
            backgroundColor: "#ffffff",
          }}
        >
          <ArrowForwardIosIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

export default RecentPets;
