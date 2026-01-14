import { Box, Typography, Card, Divider, Button} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../api";

const ExpandedAppointmentDetails = ({ appointment, onCancelSuccess }) => {
  const { pet, vet, date, time, status, reason, reviewed } = appointment;

  const navigate = useNavigate();

  const handleReviewClick = () => {
    navigate(`/owner/appointments/review`, {
      state: { 
        vet: vet,             
        appointment: appointment 
      }
    });
  }

  const handleViewVetDetails = () => {
    navigate(`/owner/search-vet/vet-details`, { 
      state: { 
        vet: vet
      } 
    });
  }


  // Μετατροπή dd-mm-yyyy σε δυναμικά στοιχεία
  const formatDate = (dateStr) => {
    if (!dateStr) return { dayNum: "-", dayName: "-", monthName: "-" };

    const [day, month, year] = dateStr.split("-");
    const dateObj = new Date(year, month - 1, day);

    return {
      dayNum: day,
      dayName: dateObj.toLocaleDateString("el-GR", { weekday: "short" }),
      monthName: dateObj.toLocaleDateString("el-GR", { month: "long" }),
      year: dateObj.getFullYear(),
    };
  };

  const { dayNum, dayName, monthName, year } = formatDate(date);

  return (
    <Card
      sx={{
        mb: 3,
        mx: 2,
        p: 3,
        borderRadius: "16px",
        backgroundColor: "#9ebcff",
      }}
    >
      <Box sx={{ display: "flex", gap: 4, flexWrap: { xs: "wrap", md: "nowrap" } }}>
        {/* 🟦 ΑΡΙΣΤΕΡΑ – ΠΛΗΡΟΦΟΡΙΕΣ */}
        <Box sx={{ minWidth: 220 }}>
          <Typography fontWeight="bold" sx={{ mb: 2 }}>
            Πληροφορίες
          </Typography>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              p: 2,
              border: "1px solid rgba(0,0,0,0.2)",
              borderRadius: "12px",
              mb: 2,
              backgroundColor: "rgba(255,255,255,0.4)",
            }}
          >
            <Box textAlign="center" sx={{ minWidth: 60 }}>
              <Typography variant="body2" sx={{ textTransform: "capitalize" }}>
                {dayName}
              </Typography>
              <Typography variant="h5" fontWeight="bold">
                {dayNum}
              </Typography>
              <Typography variant="body2" sx={{ textTransform: "capitalize" }}>
                {monthName}
              </Typography>
              <Typography variant="body2">{year}</Typography>
              
              
            </Box>

            <Divider orientation="vertical" flexItem />

            <Box>
              <Typography variant="body2">Ώρα</Typography>
              <Typography fontWeight="bold">{time}</Typography>

              <Typography variant="body2" sx={{ mt: 1 }}>
                Είδος επίσκεψης
              </Typography>
              <Typography fontWeight="bold">
                {reason || "Απλή επίσκεψη"}
              </Typography>
            </Box>
          </Box>

          <Typography variant="body2" fontWeight="500">
            Κατοικίδιο: {pet ? pet.name : "—"}
          </Typography>

          {status === "CONFIRMED" && (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mt: 1 }}
            >
              Ο κτηνίατρος έχει επιβεβαιώσει το ραντεβού σας.
            </Typography>
          )}

        </Box>

        {/* ΔΕΞΙΑ – ΚΤΗΝΙΑΤΡΟΣ */}
        <Box sx={{ flex: 1 }}>
          <Box sx={{ 
            display: "flex", 
            justifyContent: "space-between", 
            alignItems: "flex-start", 
            mb: 2 
          }}>
            <Box>
              <Typography fontWeight="bold" color="text.secondary">
                Κτηνίατρος
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: "bold", mt: 1 }}>
                {vet ? `${vet.name} ${vet.surname}` : "-"}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Διεύθυνση: {vet?.clinicAddress || "-"}
              </Typography>
            </Box>

            <Button 
              variant="contained" 
              color="secondary" 
              onClick={handleViewVetDetails}
              sx={{ 
                borderRadius: "8px", 
                fontWeight: "bold",
                backgroundColor: "#A32CC4",
                px: 3,
                "&:hover": { backgroundColor: "#8a24a6" }
              }}
            >
              ΠΡΟΒΟΛΗ ΚΤΗΝΙΑΤΡΟΥ
            </Button>
          </Box>

          <Divider sx={{ mb: 2 }} />
          <Box
            component="iframe"
            sx={{
              height: 150,
              width: "100%",
              border: "none",
              borderRadius: "12px",
            }}
            src={`https://maps.google.com/maps?q=${encodeURIComponent(vet?.clinicAddress + " " + vet?.clinicCity + " " + vet?.clinicZip)}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
          />
        </Box>
      </Box>


    <Box
      sx={{
        mt: 3,
        display: "flex",
        justifyContent: "space-between", 
        alignItems: "center",
        gap: 2,
        flexWrap: "wrap"
      }}
    >
    {(status === "PENDING" || status === "CONFIRMED") && (
      <Button
        variant="contained"
        color="error"
        onClick={async () => {
          const ok = window.confirm("Θέλετε σίγουρα να ακυρώσετε το ραντεβού;");
          if (!ok) return;

          await fetch(`${API_URL}/appointments/${appointment.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: "CANCELLED" }),
          });

          onCancelSuccess(appointment.id);
        }}
      >
        ΑΚΥΡΩΣΗ ΡΑΝΤΕΒΟΥ
      </Button>)}

      <Box sx={{ display: 'flex', gap: 2, alignItems: "center" }}>
        {status === "COMPLETED" && reviewed === false && (
          <Button 
            variant="outlined" 
            color="primary" 
            onClick={handleReviewClick}
            sx={{ 
              borderRadius: "8px", 
              backgroundColor: "white",
              borderWidth: "2px",
              "&:hover": { borderWidth: "2px" } 
            }}
          >
            ΚΑΝΤΕ ΑΞΙΟΛΟΓΗΣΗ
          </Button>
        )}

        {status === "COMPLETED" && reviewed === true && (
          <Typography color="text.secondary">
            Έχετε ήδη αξιολογήσει αυτό το ραντεβού.
          </Typography>
        )}

      </Box>
    </Box>
    </Card>
    
  );
};

export default ExpandedAppointmentDetails;