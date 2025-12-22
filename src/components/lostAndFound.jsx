import { Box, Typography, Grid } from "@mui/material";
import ActionBox from "./ActionBox";
import RecentPets from "./RecentPets";
import UniversalButton from "./UniversalButton";    

export default function LostFoundSection() {
    return (
        <Box
        sx={{
            backgroundColor: "#f6ecad",
            py: { xs: 4, md: 6 },
            px: 3,
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
                    button = {<UniversalButton text="Δήλωση Απώλειας" path="/report-lost-pet" bgColor="#4c4c2d" textColor='#ffffff'/>}
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
                    button = {<UniversalButton text="Δήλωση Εύρεσης" path="/report-found-pet" bgColor="#4c4c2d" textColor='#ffffff'/>}
                />
            </Grid>
        </Grid>

        {/* RECENT */}
        <RecentPets
        pets={[
            {
            id: 12,
            image: "/pets/pet1.jpg",
            area: "Καλλιθέα",
            phone: "6912345689",
            },
            {
            id: 11,
            image: "/pets/pet2.jpg",
            area: "Θεσσαλονίκη",
            phone: "6912345678",
            },
            {
            id: 10,
            image: "/pets/pet3.jpg",
            area: "Χαλάνδρι",
            phone: "6912345669",
            },
            {
            id: 9,
            image: "/pets/pet4.jpg",
            area: "Χαλάνδρι",
            phone: "6912345659",
            },
            {
            id: 1,
            image: "/pets/dog1.jpg",
            area: "Καλλιθέα",
            phone: "6912345678",
            },
            {
            id: 2,
            image: "/pets/cat1.jpg",
            area: "Θεσσαλονίκη",
            phone: "6987654321",
            },
            {
            id: 3,
            image: "/pets/dog2.jpg",
            area: "Χαλάνδρι",
            phone: "6901122334",
            },
            {
            id: 4,
            image: "/pets/cat2.jpg",
            area: "Περιστέρι",
            phone: "6977788899",
            },
            {
            id: 5,
            image: "/pets/dog3.jpg",
            area: "Νέα Σμύρνη",
            phone: "6933344455",
            },
            {
            id: 6,
            image: "/pets/cat3.jpg",
            area: "Γλυφάδα",
            phone: "6945566778",
            },
            {
            id: 7,
            image: "/pets/dog4.jpg",
            area: "Πατήσια",
            phone: "6999988877",
            },
            {
            id: 8,
            image: "/pets/cat4.jpg",
            area: "Μαρούσι",
            phone: "6922233344",
            },
        ]}
        />
        </Box>
    );
}