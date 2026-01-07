import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Box, Grid } from "@mui/material";
import HeroMain from '../components/Hero_main-page';
import OurButton from '../components/UniversalButton';
import LoginDialog from '../components/login';
import InfoCard from "../components/infoCard";
import LostFoundSection from "../components/lostAndFound";
import "./styles/home.css";

const Home = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [loginOpen, setLoginOpen] = useState(false);

  useEffect(() => {
    if (searchParams.get("login") === "true") {
      setLoginOpen(true);

      // optional: clean URL after opening
      searchParams.delete("login");
      setSearchParams(searchParams, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  return (
    <>
    <HeroMain />
    <LoginDialog open={loginOpen} onClose={() => setLoginOpen(false)} />
    <Box
        sx={{
          px: 3,
          pt: 4,   // 👈 απόσταση από hero
          pb: 6,
        }}
      >
        <Grid
          container
          spacing={4}
          justifyContent="center"
          alignItems="stretch"
          maxWidth="lg"
          sx={{ mx: "auto" }} 
        >
          <Grid item xs={16} md={6}>
            <InfoCard
              title="Τι δυνατότητες έχει ένας ιδιοκτήτης;"
              items={[
                "Προβολή ηλεκτρονικού βιβλιαρίου υγείας και στοιχείων του ζώου",
                "Αναζήτηση κτηνιάτρου βάσει εξατομικευμένων κριτηρίων",
                "Προγραμματισμός ραντεβού με κτηνίατρο online",
                "Δήλωση απώλειας και εύρεσης κατοικιδίου",
              ]}
              titleboxcolour="#8c8d5d68"
              boxcolour="#FFF1C2"
            />
          </Grid>

          <Grid item xs={16} md={6}>
            <InfoCard
              title="Τι δυνατότητες έχει ένας κτηνίατρος;"
              items={[
                "Αρχικοποίηση βιβλιαρίου υγείας ζώου και καταγραφή ιατρικών πράξεων",
                "Εγγραφή στην υπηρεσία της αναζήτησης κτηνιάτρων",
                "Προβολή αξιολογήσεων και πλήρης διαχείριση των ραντεβού του",
                "Ιστορικό επισκέψεων και ιατρικών πράξεων για όλα τα ζώα που διαχειρίζεται",
              ]}
              titleboxcolour="#FFF1C2"
              boxcolour="#8c8d5d6a"
            />
          </Grid>
        </Grid>
      </Box>
      <section className="how-wrapper">
        <h2 className="title">Βρες Κτηνίατρο εύκολα και γρήγορα</h2>

        <div className="steps">
          <div className="step">
            <div className="icon">🔍</div>
            <p>Βρες τον κτηνίατρο που ταιριάζει ακριβώς στις ανάγκες σου!</p>
          </div>

          <div className="step">
            <div className="icon">📅</div>
            <p>Δες τη διαθεσιμότητα του και κλείσε ραντεβού online!</p>
          </div>

          <div className="step">
            <div className="icon">👤✔️</div>
            <p>Το κατοικίδιό σου έχει άμεση φροντίδα σε κτηνίατρο!</p>
          </div>

          <div className="line" />
        </div>

        <OurButton text="Αναζήτηση Κτηνιάτρου" path="/owner/search-vet" bgColor="#b0c679ff" textColor='#ffffff' />
      </section>
      <LostFoundSection />
      </>
  );
}

export default Home;

