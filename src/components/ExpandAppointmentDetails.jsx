import {useState} from "react";
import { Box, Typography, Card, Divider, Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions} from "@mui/material";

const ExpandedAppointmentDetails = ({ appointment, onDeleteSuccess }) => {
  const { id, pet, vet, date, time, status, reason } = appointment;

  // State για το αν είναι ανοιχτό το παράθυρο επιβεβαίωσης
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // Συνάρτηση για τη διαγραφή από τη βάση
  const handleDelete = async () => {
    try {
      const response = await fetch(`http://localhost:3001/appointments/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        handleClose();
        // Καλούμε μια συνάρτηση από τον "πατέρα" για να ανανεώσει τη λίστα στην οθόνη
        if (onDeleteSuccess) onDeleteSuccess(id);
      } else {
        alert("Σφάλμα κατά τη διαγραφή του ραντεβού.");
      }
    } catch (error) {
      console.error("Error deleting appointment:", error);
    }
  };

  // 🛠️ Μετατροπή dd-mm-yyyy σε δυναμικά στοιχεία
  const formatDate = (dateStr) => {
    if (!dateStr) return { dayNum: "-", dayName: "-", monthName: "-" };

    // Σπάμε το string "12-01-2026" σε [12, 01, 2026]
    const [day, month, year] = dateStr.split("-");
    // Προσοχή: Ο μήνας στην JS ξεκινάει από το 0 (Ιανουάριος = 0)
    const dateObj = new Date(year, month - 1, day);

    return {
      dayNum: day,
      // "long" επιστρέφει ολόκληρο το όνομα (π.χ. Δευτέρα)
      // "short" επιστρέφει τη συντομογραφία (π.χ. Δευ)
      dayName: dateObj.toLocaleDateString("el-GR", { weekday: "short" }),
      monthName: dateObj.toLocaleDateString("el-GR", { month: "long" }),
      year: dateObj.getFullYear(),
    };
  };

  const { dayNum, dayName, monthName, year } = formatDate(date);

  return (
    <>
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
                {vet ? `${vet.name} ${vet.surname}` : "Αποστόλης Χριστοδουλόπουλος"}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Διεύθυνση: {vet?.address || "Sapfous 42"}
              </Typography>
            </Box>

            <Button 
              variant="contained" 
              color="secondary" 
              sx={{ 
                borderRadius: "8px", 
                fontWeight: "bold",
                backgroundColor: "#A32CC4", // Το μωβ χρώμα της εικόνας σου
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
            src={`https://maps.google.com/maps?q=${encodeURIComponent(vet?.clinicAddress)}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
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
    {/* ΑΡΙΣΤΕΡΗ ΠΛΕΥΡΑ: Μόνο η Ακύρωση */}
    <Box>
      {status === "PENDING" && (
        <Button 
          variant="contained" 
          color="error" 
          onClick={ handleClickOpen }
          sx={{ borderRadius: "8px", fontWeight: "bold" }}
        >
          ΑΚΥΡΩΣΗ ΡΑΝΤΕΒΟΥ
        </Button>
      )}
    </Box>

  {/* ΔΕΞΙΑ ΠΛΕΥΡΑ: Αξιολόγηση ΚΑΙ Προβολή Κτηνιάτρου */}
      <Box sx={{ display: 'flex', gap: 2, alignItems: "center" }}>
        {status === "COMPLETED" && (
          <Button 
            variant="outlined" 
            color="primary" 
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

      </Box>
    </Box>
    </Card>
    <Dialog
        onOpen={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        PaperProps={{ sx: { borderRadius: "16px", p: 1 } }}
      >
        <DialogTitle id="alert-dialog-title" sx={{ fontWeight: "bold" }}>
          {"Ακύρωση Ραντεβού"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Είστε σίγουρος/η ότι θέλετε να διαγράψετε το ραντεβού σας; 
            Αυτή η ενέργεια δεν μπορεί να αναιρεθεί.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ pb: 2, px: 3 }}>
          <Button onClick={handleClose} variant="outlined" sx={{ borderRadius: "8px" }}>
            ΟΧΙ, ΠΙΣΩ
          </Button>
          <Button 
            onClick={handleDelete} 
            variant="contained" 
            color="error" 
            autoFocus 
            sx={{ borderRadius: "8px" }}
          >
            ΝΑΙ, ΔΙΑΓΡΑΦΗ
          </Button>
        </DialogActions>
      </Dialog>
    </>
    
  );
};

export default ExpandedAppointmentDetails;