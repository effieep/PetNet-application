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
import { useAuth } from "../auth/AuthContext";

export default function LoginDialog({ open, onClose }) {
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError("");
    setLoading(true);

    try {
      await login({ email, password });
      onClose();
    } catch (err) {
      setError(err.message || "Λάθος στοιχεία σύνδεσης.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!loading) handleLogin();
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
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 2 }}
        >
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

          <button type="submit" style={{ display: "none" }} />
        </Box>
      </DialogContent>

      <DialogActions
        sx={{ padding: 3, justifyContent: "center", backgroundColor: "#f9f9f9" }}
      >
        <Button
          onClick={onClose}
          sx={{
            color: "#373721",
            mr: 2,
            backgroundColor: "#e2824bff",
            px: 4,
            fontWeight: "bold",
          }}
          variant="outlined"
        >
          ΑΚΥΡΩΣΗ
        </Button>
        <Button
          type="submit"
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
          {loading ? "..." : "ΣΥΝΔΕΣΗ"}
        </Button>

      </DialogActions>
    </Dialog>
  );
}
