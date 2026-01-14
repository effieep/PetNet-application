import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';

export default function ConfirmDialog({ open, onClose, onConfirm, title, message }) {
  return (
    <Dialog open={open} onClose={onClose} PaperProps={{ sx: { borderRadius: 3, p: 1 } }}>
      <DialogTitle sx={{ fontWeight: 'bold' }}>
        {title}
      </DialogTitle>
      <DialogContent>
        <Typography>
          {message}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button 
          onClick={() => {
            onConfirm();
            onClose();
          }} 
          variant="contained" 
          sx={{ borderRadius: 2, backgroundColor: "#4caf50" }}
        >
          Ναι
        </Button>
        <Button onClick={onClose} color="error">
          Οχι
        </Button>
      </DialogActions>
    </Dialog>
  );
}