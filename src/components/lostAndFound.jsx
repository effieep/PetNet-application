import { Box, Typography, Grid, Button } from "@mui/material";
import ActionBox from "./ActionBox";
import RecentPets from "./RecentPets";
import UniversalButton from "./UniversalButton";    
import { API_URL } from "../api";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const returnDateObj = (dateStr) => {
  const [day, month, year] = dateStr.split('-');
  return new Date(`${year}-${month}-${day}`);
}

export default function LostFoundSection() {
  const [pets, setPets] = useState([]);
  const [lostDeclarations, setLostDeclarations] = useState([]);

  useEffect(() => {
    const fetchPets = async () => {
      try {
        const response = await fetch(`${API_URL}/pets`);
        const data = await response.json();
        setPets(data);
      } catch (error) {
        console.error("Error fetching recent lost/found pets:", error);
      }
    };
    fetchPets();

    const fetchLostDeclarations = async () => {
      try {
        const response = await fetch(`${API_URL}/declarations?type=LOSS&status=SUBMITTED`);
        const data = await response.json();
        setLostDeclarations(data.filter(decl => new Date() - returnDateObj(decl.createdAt) <= 30 * 24 * 60 * 60 * 1000)); // lost within last 30 days
      } catch (error) {
        console.error("Error fetching lost declarations:", error);
      }
    };
    fetchLostDeclarations();

    

  }, []);
    return (
        <>
        <Box
        sx={{
            backgroundColor: "#f6ecad",
            py: { xs: 4, md: 6 },
            px: 3,
            position: "relative",
        }}
        >
        {/* HEADER */}
        <Box
            sx={{
            backgroundColor: "#7d774a",
            color: "white",
            borderRadius: 2,
            py: 1.5,
            mb: 5,
            textAlign: "center",
            }}
        >
            <Typography fontWeight="bold" sx = {{ fontSize: { xs: "20px", md: "22px", lg: "24px" }, }}>
            Απώλεια και Εύρεση ζώων
            </Typography>
        </Box>

        {/* TOP ACTIONS */}
        <Grid
            container
            spacing={20}
            alignItems="stretch"
            justifyContent="center">
            {/* LOST */}
            <Grid item md={6}>
                <ActionBox
                    title="Έχασα κατοικίδιο"
                    description="Δήλωσε την απώλεια του κατοικιδίου σου και ανέβασε φωτογραφία, περιγραφή και περιοχή."
                    button = {<UniversalButton text="Δήλωση Απώλειας" path="/lost-found/lost_pet" bgColor="#4c4c2d" textColor='#ffffff'/>}
                />
            </Grid>

            {/* DIVIDER */}
            <Grid 
                item 
                md={1} 
                sx={{ display: { xs: "none", md: "flex" }}}
                justifyContent="center">
            <Box
                sx={{
                width: 2,
                height: 120,
                backgroundColor: "#9a9a6a",
                mx: "auto",
                }}
            />
            </Grid>

            {/* FOUND */}
            <Grid item md={6}>
                <ActionBox
                    title="Βρήκα κατοικίδιο"
                    description="Δήλωσε την εύρεση ενός ζώου και δες αν το microchip ταιριάζει με κάποια ενεργή απώλεια."
                    button = {<UniversalButton text="Δήλωση Εύρεσης" path="/lost-found/found_pet" bgColor="#4c4c2d" textColor='#ffffff'/>}
                />
            </Grid>
        </Grid>

        {/* RECENT */}
        <RecentPets
        pets={pets.reduce((acc, pet) => {
            const petDeclarations = lostDeclarations.filter(decl => decl.petId === pet.id);

            petDeclarations.forEach(declaration => {
              acc.push({
                image: pet?.photoUrl || './pet_lost_default.png',
                phone: declaration.contact.phone,
                area: declaration.location.address.split(',').slice(0, 2).join(',') || "Άγνωστη τοποθεσία",
              });
            });
            
            return acc;
        }, [])}
        />
        <Button
          component={Link}
          to="/lost-found"
          sx={{
            mt: 4,
            backgroundColor: "#4c4c2d",
            color: "#ffffff",
            textTransform: "none",
            fontWeight: 700,
            borderRadius: 15,
            px: { xs: 3, sm: 4, md: 6 },
            py: { xs: 0.5, sm: 1 },
            fontSize: { xs: '0.85rem', sm: '0.9rem', md: '1rem' },
            left: "50%",
            transform: "translateX(-50%)",
            '&:hover': {
              backgroundColor: "#4c4c2d",
              filter: 'brightness(0.85)',
              boxShadow: 'grey 0px 2px 5px'
            }
          }}
        >
          Περισσότερα
        </Button>
        </Box>
        </>
    );
}