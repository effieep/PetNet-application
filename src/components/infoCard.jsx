import { Box, Typography } from "@mui/material";

const InfoCard = ({ title, items, titleboxcolour, boxcolour }) => {
  return (
    <Box
        sx={{
            height: "80%",
            display: "flex",
            flexDirection: "column",
            backgroundColor: boxcolour,
            borderRadius: 3,
            p: 3,
            width: "100%",
            maxWidth: 520,   // <= μικρότερο
        }}
    >
      {/* Title */}
      <Box
        sx={{
          backgroundColor: titleboxcolour,
          borderRadius: "16px",
          p: "12px 18px",
          textAlign: "center",
          fontWeight: "bold",
          mb: 3,
        }}
      >
        <Typography fontWeight="bold"  sx={{
                fontSize: { xs: "16px", md: "18px", lg: "21px" },
        }}>
          {title}
        </Typography>
      </Box>

      {/* List */}
      <Box component="ul" sx={{ listStyle: "none", p: 0, m: 0 }}>
        {items.map((item, index) => (
          <Box
            component="li"
            key={index}
            sx={{
              display: "flex",
              alignItems: "center",
              mb: 2,
            }}
          >
            {/* Icon */}
            <Box
              sx={{
                backgroundColor: "#355936ff",
                color: "white",
                borderRadius: "50%",
                width: 22,
                height: 22,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 12,
                mr: 1.5,
                flexShrink: 0,
              }}
            >
              ✔
            </Box>

            <Typography variant="body1"  
                sx={{
                    fontSize: { xs: "14px", md: "16px", lg: "19px" },
                }}
            >
              {item}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default InfoCard;
