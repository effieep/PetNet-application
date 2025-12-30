import { Box, Typography } from "@mui/material";

const ActionBox = ({ title, description, button}) => (
  <Box
    sx={{
        height: "100%",                 // 👈 ΠΟΛΥ ΣΗΜΑΝΤΙΚΟ
        width: "100%",
        maxWidth: { xs: "100%", md: 420, lg: 460 }, // 👈 ΤΟ ΚΛΕΙΔΙ
        mx: "auto",                                 // 👈 ΚΕΝΤΡΑΡΙΣΜΑ
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        textAlign: "center",            // 👈 ταιριάζει με το design
    }}
  >
    <Typography
      fontWeight="bold"
      mb={1}
      sx={{ fontSize: { xs: "16px", md: "18px", lg: "21px" } }}
    >
      {title}
    </Typography>

    <Typography
      sx={{
        fontSize: { xs: "15px", md: "17px", lg: "20px" },
        mb: 2,
      }}
    >
      {description}
    </Typography>

    {button}
  </Box>
);

export default ActionBox;
