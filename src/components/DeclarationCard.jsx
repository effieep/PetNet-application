import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Chip,
  IconButton,
  Typography,
} from "@mui/material";
import PetsIcon from "@mui/icons-material/Pets";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

const statusMap = {
  SUBMITTED: { label: "Υποβλήθηκε", color: "info" },
  FOUND: { label: "Βρέθηκε", color: "success" },
};

const DeclarationCard = ({ declaration, onClick }) => {
  if (!declaration) return null;

  const {
    type,
    status,
    createdAt,
    location,

    // LOSS fields
    pet,
    lostDate,

    // FOUND fields
    petType,
    microchip,
  } = declaration;

  const st = statusMap[status] || { label: status, color: "default" };

  return (
    <CardActionArea onClick={onClick}>  
      <Card
        elevation={0}
        sx={{
          mb: 2,
          borderRadius: "14px",
          backgroundColor:
            type === "LOSS"
              ? "rgba(255, 193, 7, 0.18)"   // κίτρινο απώλειας
              : "rgba(76, 175, 80, 0.18)", // πράσινο εύρεσης
          border: "1px solid rgba(0,0,0,0.1)",
        }}
      >
        <CardContent sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <PetsIcon sx={{ fontSize: 32 }} />

          <Box sx={{ flex: 1 }}>
            {/* 🔹 LOSS */}
            {type === "LOSS" && (
              <>
                <Typography fontWeight="bold">
                  {pet?.name || "-"} · Microchip: {pet?.microchip || "-"}
                </Typography>

                <Typography variant="body2">
                  Ημερομηνία απώλειας: {lostDate || "-"}
                </Typography>
              </>
            )}

            {/* 🔹 FOUND */}
            {type === "FOUND" && (
              <>
                <Typography fontWeight="bold">
                  Βρέθηκε {petType || "Ζώο"} · Microchip: {microchip || "-"}
                </Typography>
              </>
            )}

            {/* 🔹 Κοινά */}
            <Typography variant="body2">
              Ημερομηνία δήλωσης: {createdAt || "-"}
            </Typography>

            <Typography variant="body2" color="text.secondary">
              {location?.address || "-"}
            </Typography>
          </Box>

          <Chip label={st.label} color={st.color} size="small" sx={{display: type === "LOSS" ? "inline-flex" : "none"}}/>

          <IconButton>
            <ChevronRightIcon />
          </IconButton>
        </CardContent>
      </Card>
    </CardActionArea>
  );
};

export default DeclarationCard;
