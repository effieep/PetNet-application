import { Box } from "@mui/material";
import { MdPerson, MdPets } from "react-icons/md";

const PetOwnerIcon = ({ size = 40, color = "#373721" }) => {
  return (
    <Box sx={{ position: "relative", display: "inline-flex" }}>
      
      <MdPerson size={size} color={color} />

      <Box
        sx={{
          position: "absolute",
          bottom: -4,
          right: -4,
          borderRadius: "50%",
          padding: "2px",
          display: "flex",
        }}
      >
        <MdPets size={size * 0.45} color={color} />
      </Box>
    </Box>
  );
};

export default PetOwnerIcon;