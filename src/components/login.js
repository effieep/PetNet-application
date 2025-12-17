import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
} from "@mui/material";
import { useAuth } from "../auth/AuthContext"; // <-- adjust path if needed

export default function LoginDialog({ open, onClose }) {
  const { login } = useAuth(); // ✅ from AuthContext (talks to db.json via json-server)

  const [email, setEmail] = useState(""); // can be email for now
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError("");
    setLoading(true);

    try {
      await login({ email: email, password });

      onClose(); 
    } catch (err) {
      setError(err.message || "Λάθος στοιχεία σύνδεσης.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle
        sx={{
          backgroundColor: "#9a9b6a",
          color: "white",
          textAlign: "center",
          fontWeight: "bold",
        }}
      >
        Καλώς ήρθατε στο PetNet
      </DialogTitle>

      <DialogContent sx={{ mt: 2 }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 2 }}>
          <Typography variant="body1" textAlign="center">
            Συμπληρώστε τα στοιχεία σας για είσοδο.
          </Typography>

          {error && (
            <Typography sx={{ color: "error.main", textAlign: "center" }}>
              {error}
            </Typography>
          )}

          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />

          <TextField
            label="Password"
            type="password"
            variant="outlined"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
        </Box>
      </DialogContent>

      <DialogActions
        sx={{ padding: 3, justifyContent: "center", backgroundColor: "#f9f9f9" }}
      >
        <Button onClick={onClose} sx={{ color: "gray", mr: 2 }}>
          Ακύρωση
        </Button>

        <Button
          onClick={handleLogin}
          variant="contained"
          disabled={loading}
          sx={{
            backgroundColor: "#F1D77A",
            color: "#373721",
            fontWeight: "bold",
            px: 4,
            "&:hover": { backgroundColor: "#e6c85f" },
          }}
        >
          {loading ? "..." : "Είσοδος"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
