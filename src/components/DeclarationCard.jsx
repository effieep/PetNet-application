import { Box, Card, CardContent, Chip, IconButton, Typography } from "@mui/material";
import PetsIcon from '@mui/icons-material/Pets';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

const statusMap = {
  PENDING: { label: "Εκκρεμεί", color: "warning" },
  RESOLVED: { label: "Επιλυμένη", color: "success" },
  REJECTED: { label: "Απορριφθείσα", color: "error" },
  SUBMITTED: { label: "Υποβλήθηκε", color: "info" },
};

const DeclarationCard = ({ declaration }) => {
  if (!declaration) return null;

  const { pet, type, status, createdAt, location } = declaration;

  const st = statusMap[status] || { label: status || "Άγνωστο", color: "default" };

  return (
    <Card
      elevation={0}
      sx={{
        mb: 2,
        borderRadius: "14px",
        backgroundColor: type === "LOSS" ? "rgba(255, 235, 59, 0.2)" : "rgba(76, 175, 80, 0.2)",
        border: "1px solid rgba(0,0,0,0.1)",
      }}
    >
      <CardContent sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <PetsIcon sx={{ fontSize: 32 }} />

        <Box sx={{ flex: 1 }}>
          <Typography fontWeight="bold">{pet?.name || "-"} · Microchip: {pet?.microchip || "-"}</Typography>

          <Typography variant="body2">
            Ημερομηνία: {createdAt || "-"}
          </Typography>

          <Typography variant="body2" color="text.secondary">
            {location?.address || "-"}
          </Typography>
        </Box>

        <Chip label={st.label} color={st.color} size="small" />

        <IconButton>
          <ChevronRightIcon />
        </IconButton>
      </CardContent>
    </Card>
  );
};

export default DeclarationCard;