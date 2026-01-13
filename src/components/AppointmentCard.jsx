import {
  Box,
  Card,
  CardContent,
  Chip,
  Typography,
  Collapse,
  IconButton,
} from "@mui/material";
import EventIcon from "@mui/icons-material/Event";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandedAppointmentDetails from "./ExpandAppointmentDetails";

const statusBg = {
  PENDING: "rgba(255, 193, 7, 0.18)",
  CONFIRMED: "rgba(76, 175, 80, 0.18)",
  COMPLETED: "rgba(76, 175, 80, 0.18)",
  CANCELLED: "rgba(244, 67, 54, 0.18)",
};

const statusMap = {
  PENDING: "Εκκρεμεί Έπιβεβαίωση",
  CONFIRMED: "Επιβεβαιωμένο",
  COMPLETED: "Ολοκληρωμένο",
  CANCELLED: "Ακυρωμένο",
};

const AppointmentCard = ({ appointment, open, onToggle, onCancelSuccess }) => {
  if (!appointment) return null;

  const { pet, vet, date, time, status, reason } = appointment;
  
  return (
    <>
      {/* 🔹 MAIN CARD */}
      <Card
        sx={{ mb: 1, borderRadius: 3, cursor: "pointer" }}
        onClick={onToggle}
      >
        <CardContent
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            backgroundColor: statusBg[status] || "rgba(0,0,0,0.04)",
          }}
        >
          <EventIcon sx={{ fontSize: 32 }} />

          <Box sx={{ flex: 1 }}>
            <Typography fontWeight="bold">
              {date} · {time}
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

          <Chip sx={{fontWeight: "bold", fontSize: 14}} label={statusMap[status]} />

          {/* 🔽 ΒΕΛΟΣ */}
          <IconButton
            onClick={(e) => {
              e.stopPropagation(); 
              onToggle();
            }}
          >
            <ExpandMoreIcon
              sx={{
                transform: open ? "rotate(180deg)" : "rotate(0deg)",
                transition: "0.3s",
              }}
            />
          </IconButton>
        </CardContent>
      </Card>

      {/* 🔽 EXPANDED SECTION */}
    <Collapse in={open} timeout="auto" unmountOnExit>
        <ExpandedAppointmentDetails 
            appointment={appointment} 
            onCancelSuccess={onCancelSuccess}
        />
    </Collapse>
    </>
  );
};

export default AppointmentCard;
