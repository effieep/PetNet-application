import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Box, Button } from "@mui/material";
import LostAndFoundHeader from "../components/lostandfound_main_header.jsx";
import FoundPetRequirements from "../components/LostAndFound_main_Requirements1.jsx";
import LostPetRequirements from "../components/LostAndFound_main_Requirements2.jsx";
import LostAndFoundMainGrid from "../components/LostAndFound_main_Grid.jsx";

const LostFound = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [, setLoginOpen] = useState(false);

  // Default view: Found
  const [mode, setMode] = useState("found");

  useEffect(() => {
    if (searchParams.get("login") === "true") {
      setLoginOpen(true);

      // optional: clean URL after opening
      searchParams.delete("login");
      setSearchParams(searchParams, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  const RequirementsComponent = mode === "found" ? FoundPetRequirements : LostPetRequirements;

  return (
    <>
      <LostAndFoundHeader />

      <Box
        sx={{
          // backgroundColor: "#efe092",
          display: "flex",
          justifyContent: "center",
          py: 2,
          px: { xs: 2, md: 3 },
        }}
      >
        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", justifyContent: "center" }}>
          <Button
            onClick={() => setMode("found")}
            variant={mode === "found" ? "contained" : "outlined"}
            sx={{
              textTransform: "none",
              fontWeight: 700,
              borderRadius: 3,
              px: { xs: 4, md: 6 },
              py: { xs: 1, md: 1.5 },
              fontSize: { xs: 16, md: 18 },
              minWidth: { xs: 140, md: 180 },
              backgroundColor: mode === "found" ? "#444732" : "transparent",
              color: mode === "found" ? "#ffffff" : "#1a1a1a",
              borderColor: "#444732",
              "&:hover": {
                backgroundColor: mode === "found" ? "#444732" : "transparent",
                filter: "brightness(0.92)",
                borderColor: "#444732",
              },
            }}
          >
            Εύρεση
          </Button>

          <Button
            onClick={() => setMode("lost")}
            variant={mode === "lost" ? "contained" : "outlined"}
            sx={{
              textTransform: "none",
              fontWeight: 700,
              borderRadius: 3,
              px: { xs: 4, md: 6 },
              py: { xs: 1, md: 1.5 },
              fontSize: { xs: 16, md: 18 },
              minWidth: { xs: 140, md: 180 },
              backgroundColor: mode === "lost" ? "#444732" : "transparent",
              color: mode === "lost" ? "#ffffff" : "#1a1a1a",
              borderColor: "#444732",
              "&:hover": {
                backgroundColor: mode === "lost" ? "#444732" : "transparent",
                filter: "brightness(0.92)",
                borderColor: "#444732",
              },
            }}
          > Απώλεια
          </Button>
        </Box>
      </Box>

      <RequirementsComponent />
      <LostAndFoundMainGrid mode={mode} />
    </>
  );
};

export default LostFound;