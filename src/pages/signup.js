import * as React from "react";
import { Container, Paper, Typography, Box, TextField, Button, MenuItem } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function SignupPage() {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = React.useState(null);
  const [email, setEmail] = React.useState(null);
  const [password, setPassword] = React.useState(null);
  const [role, setRole] = React.useState("owner"); // owner | vet
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signup({ name, email, password, role });
      navigate("/"); // go home (NavBar will update automatically)
    } catch (err) {
      setError(err.message || "Αποτυχία εγγραφής.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="xs">
      <Paper elevation={3} sx={{ p: 4, mt: 8, textAlign: "center", borderRadius: 2 }}>
        <Typography variant="h4" sx={{ fontWeight: "bold", color: "#373721", mb: 2 }}>
          Εγγραφή
        </Typography>

        {error && (
          <Typography sx={{ color: "error.main", mb: 2 }}>
            {error}
          </Typography>
        )}

        <Box component="form" onSubmit={handleSignup} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            label="Ονοματεπώνυμο"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            fullWidth
          />

          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            fullWidth
          />

          <TextField
            label="Κωδικός"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            fullWidth
          />

          <TextField
            select
            label="Ρόλος"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            fullWidth
          >
            <MenuItem value="owner">Ιδιοκτήτης/τρια</MenuItem>
            <MenuItem value="vet">Κτηνίατρος</MenuItem>
          </TextField>

          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            sx={{
              backgroundColor: "#3f4143ff",
              fontWeight: "bold",
              py: 1.5,
              textTransform: "none",
              mt: 1,
              "&:hover": { backgroundColor: "#2f3032" },
            }}
          >
            {loading ? "..." : "Δημιουργία Λογαριασμού"}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}
