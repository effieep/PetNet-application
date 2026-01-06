import React, { useEffect, useMemo, useState } from "react";
import { Typography, CircularProgress, Alert, Box, FormControl, InputLabel, Select, MenuItem} from "@mui/material";

import { useAuth } from "../../auth/AuthContext";
import ProfileLayout from "../../components/profileLayout";
import DeclarationCard from "../../components/DeclarationCard";

const OwnerDeclarations = () => {
  const { user, isLoggedIn } = useAuth();

  const [declarations, setDeclarations] = useState([]);
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lossSort, setLossSort] = useState("newest");
  const [foundSort, setFoundSort] = useState("newest");
  useEffect(() => {
    if (!isLoggedIn || !user?.id) return;

    const fetchAll = async () => {
      try {
        setLoading(true);

        const [decRes, petsRes] = await Promise.all([
          fetch(`http://localhost:3001/declarations?ownerId=${user.id}`),
          fetch(`http://localhost:3001/pets?ownerId=${user.id}`),
        ]);

        if (!decRes.ok) throw new Error("Σφάλμα φόρτωσης δηλώσεων");
        if (!petsRes.ok) throw new Error("Σφάλμα φόρτωσης κατοικιδίων");

        const decData = await decRes.json();
        const petsData = await petsRes.json();

        setDeclarations(decData);
        setPets(petsData);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [isLoggedIn, user?.id]);


  const petById = useMemo(() => {
    const map = {};
    for (const p of pets) map[String(p.id)] = p;
    return map;
  }, [pets]);

  const declarationsWithPet = useMemo(() => {
    return declarations.map((d) => ({
      ...d,
      pet: petById[String(d.petId)] || null,
    }));
  }, [declarations, petById]);

  const sortDeclarations = (arr, sortKey) => {
    const copy = [...arr];

    if (sortKey === "newest") {
      return copy.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
    if (sortKey === "oldest") {
      return copy.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    }
    if (sortKey === "status") {
      const order = { PENDING: 0, SUBMITTED: 1 };
      return copy.sort((a, b) => (order[a.status] ?? 99) - (order[b.status] ?? 99));
    }
    if (sortKey === "petName") {
      return copy.sort((a, b) => (a.pet?.name || "").localeCompare(b.pet?.name || ""));
    }
    return copy;
  };

  const lossDeclarations = declarationsWithPet.filter((d) => d.type === "LOSS");
  const foundDeclarations = declarationsWithPet.filter((d) => d.type === "FOUND");
  
  const sortedLoss = useMemo(
    () => sortDeclarations(lossDeclarations, lossSort),
    [lossDeclarations, lossSort]
  );

  const sortedFound = useMemo(
    () => sortDeclarations(foundDeclarations, foundSort),
    [foundDeclarations, foundSort]
  );

  if (!isLoggedIn) {
    return (
      <Typography variant="h6" color="error" textAlign="center" sx={{ mt: 10 }}>
        Παρακαλώ συνδεθείτε για να δείτε τις δηλώσεις σας.
      </Typography>
    );
  }

  if (loading) return <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}><CircularProgress /></Box>;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <ProfileLayout role="owner">
      <Typography variant="h5" sx={{ mb: 4, fontWeight: "bold", color: "#373721" }}>
        Οι δηλώσεις μου
      </Typography>

     <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
        <Typography variant="h6">Δηλώσεις Απώλειας</Typography>

        <FormControl size="small" sx={{ minWidth: 220 }}>
          <InputLabel>Ταξινόμηση</InputLabel>
          <Select
            label="Ταξινόμηση"
            value={lossSort}
            onChange={(e) => setLossSort(e.target.value)}
          >
            <MenuItem value="newest">Πιο πρόσφατες</MenuItem>
            <MenuItem value="oldest">Πιο παλιές</MenuItem>
            <MenuItem value="status">Κατάσταση (Draft πρώτα)</MenuItem>
            <MenuItem value="petName">Όνομα ζώου (A-Ω)</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {sortedLoss.map((decl) => (
        <DeclarationCard key={decl.id} declaration={decl} />
      ))}

      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mt: 4, mb: 2 }}>
        <Typography variant="h6">Δηλώσεις Εύρεσης</Typography>

        <FormControl size="small" sx={{ minWidth: 220 }}>
          <InputLabel>Ταξινόμηση</InputLabel>
          <Select
            label="Ταξινόμηση"
            value={foundSort}
            onChange={(e) => setFoundSort(e.target.value)}
          >
            <MenuItem value="newest">Πιο πρόσφατες</MenuItem>
            <MenuItem value="oldest">Πιο παλιές</MenuItem>
            <MenuItem value="status">Κατάσταση (Draft πρώτα)</MenuItem>
            <MenuItem value="petName">Όνομα ζώου (A-Ω)</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {sortedFound.map((decl) => (
        <DeclarationCard key={decl.id} declaration={decl} />
      ))}

    </ProfileLayout>
  );
};

export default OwnerDeclarations;