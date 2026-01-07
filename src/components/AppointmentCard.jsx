import { Box, Card, CardContent, Chip, Typography } from "@mui/material";
import EventIcon from "@mui/icons-material/Event";


const AppointmentCard = ({ appointment }) => {
  if (!appointment) return null;

  const { pet, vet, date, time, status, reason } = appointment;

  return (
    <Card sx={{ mb: 2, borderRadius: 3 }}>
      <CardContent sx={{ 
        display: "flex",
        alignItems: "center", 
        gap: 2,
       backgroundColor:
        status === "PENDING"
            ? "rgba(255, 193, 7, 0.18)"     // κίτρινο
            : status === "CONFIRMED" || status === "COMPLETED"
            ? "rgba(76, 175, 80, 0.18)"   // πράσινο
            : "rgba(244, 67, 54, 0.18)",  // κόκκινο (π.χ. cancelled)
        }} >
        
        <EventIcon sx={{ fontSize: 32 }} />

        <Box sx={{ flex: 1 }}>
          <Typography fontWeight="bold">
            {date} και ώρα : {time}
          </Typography>

          <Typography variant="body2">
            Κατοικίδιο: {pet ? pet.name : "—"}
          </Typography>

          <Typography variant="body2">
            Κτηνίατρος: {vet ? `${vet.name} ${vet.surname}` : "-"}
          </Typography>

          {reason && (
            <Typography variant="body2" color="text.secondary">
              {reason}
            </Typography>
          )}
        </Box>

        <Chip label={status} />
      </CardContent>
    </Card>
  );
};

export default AppointmentCard;