import React, { useEffect, useMemo, useState } from "react";
import { Typography, CircularProgress, Alert, Box, FormControl, InputLabel, Select, MenuItem} from "@mui/material";
import { API_URL } from "../../api";
import { useAuth } from "../../auth/AuthContext";
import ProfileLayout from "../../components/profileLayout";
import DeclarationCard from "../../components/DeclarationCard";
import DeclarationPreview from "../../components/DeclarationPreview";
import ConfirmDialog from "../../components/ConfirmDialog";

const OwnerDeclarations = () => {
  const { user, isLoggedIn } = useAuth();

  const [confirmOpen, setConfirmOpen] = useState(false);


  const handleConfirmClose = () => {
    setConfirmOpen(false);
  }

  const [declarations, setDeclarations] = useState([]);
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lossSort, setLossSort] = useState("newest");
  const [foundSort, setFoundSort] = useState("newest");

  // 2. STATE ΓΙΑ ΤΟ MODAL
  const [selectedDeclaration, setSelectedDeclaration] = useState(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  
  const ButtonClick = () => {
    setConfirmOpen(true);
  }

  const foundOnClick = () => {
    
    try {
      const updateDeclaration = async () => {
        if (!selectedDeclaration) return;
        const res = await fetch(`${API_URL}/declarations/${selectedDeclaration.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: "FOUND" }),
        });
        if (!res.ok) throw new Error("Σφάλμα κατά την ενημέρωση της δήλωσης");
        const updatedDecl = await res.json();
        setDeclarations((prevDecls) =>
          prevDecls.map((decl) =>
            decl.id === updatedDecl.id ? updatedDecl : decl
          )
        );
        setSelectedDeclaration(updatedDecl);
      };
      updateDeclaration();
    } 
    catch (e) {
      console.error(e.message);
    }
  };

  useEffect(() => {
    if (!isLoggedIn || !user?.id) return;

    const fetchAll = async () => {
      try {
        setLoading(true);

        const [decRes, petsRes] = await Promise.all([
          fetch(`${API_URL}/declarations?ownerId=${user.id}`),
          fetch(`${API_URL}/pets?ownerId=${user.id}`),
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

  const lossDeclarationsWithPet = useMemo(() => {
    return declarations
      .filter((d) => d.type === "LOSS")
      .map((d) => ({
        ...d,
        pet: petById[String(d.petId)] || null,
      }));
  }, [declarations, petById]);

  // 3. HANDLERS ΓΙΑ ΤΟ MODAL
  const handleCardClick = (decl) => {
    setSelectedDeclaration(decl);
    setIsPreviewOpen(true);
  };

  const handleClosePreview = () => {
    setIsPreviewOpen(false);
    setSelectedDeclaration(null);
  };

  const sortDeclarations = (arr, sortKey) => {
    const copy = [...arr];
    if (sortKey === "newest") {
      return copy.sort((a, b) => {
        const [da, ma, ya] = (a.createdAt || "").split("-").map(Number);
        const [db, mb, yb] = (b.createdAt || "").split("-").map(Number);
        return Date.UTC(yb, mb - 1, db) - Date.UTC(ya, ma - 1, da);
      });
    }
    if (sortKey === "oldest") {
      return copy.sort((a, b) => {
        const [da, ma, ya] = (a.createdAt || "").split("-").map(Number);
        const [db, mb, yb] = (b.createdAt || "").split("-").map(Number);
        return Date.UTC(ya, ma - 1, da) - Date.UTC(yb, mb - 1, db);
      });
    }
    if (sortKey === "status") {
      const order = { FOUND: 0, SUBMITTED: 1 };
      return copy.sort((a, b) => (order[a.status] ?? 99) - (order[b.status] ?? 99));
    }
    if (sortKey === "petName") {
      return copy.sort((a, b) => (a.pet?.name || "").localeCompare(b.pet?.name || ""));
    }
    return copy;
  };

  const lossDeclarations = lossDeclarationsWithPet.filter((d) => d.type === "LOSS");
  const foundDeclarations = declarations.filter((d) => d.type === "FOUND");
  
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
    <>
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
            <MenuItem value="status">Κατάσταση (Found πρώτα)</MenuItem>
            <MenuItem value="petName">Όνομα ζώου (A-Ω)</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* 4. ΠΡΟΣΘΗΚΗ ONCLICK ΣΤΑ LOSS CARDS */}
      {sortedLoss.map((decl) => (
        <DeclarationCard 
            key={decl.id} 
            declaration={decl} 
            onClick={() => handleCardClick(decl)} 
        />
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
            <MenuItem value="petName">Όνομα ζώου (A-Ω)</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* 4. ΠΡΟΣΘΗΚΗ ONCLICK ΣΤΑ FOUND CARDS */}
      {sortedFound.map((decl) => (
        <DeclarationCard 
            key={decl.id} 
            declaration={decl} 
            onClick={() => handleCardClick(decl)}
        />
      ))}

      {/* 5. ΕΝΣΩΜΑΤΩΣΗ ΤΟΥ MODAL */}
      <DeclarationPreview
        open={isPreviewOpen}
        onClose={handleClosePreview}
        declaration={selectedDeclaration}
        foundOnClick={ButtonClick}
      />  

    </ProfileLayout>
    <ConfirmDialog 
        open={confirmOpen}
        onClose={handleConfirmClose}
        onConfirm={foundOnClick}
        title="Επιβεβαίωση Εύρεσης"
        message="Επιβεβαιώνετε ότι το κατοικίδιο έχει βρεθεί;"
    />
    </>
  );
};

export default OwnerDeclarations;