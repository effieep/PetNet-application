import './App.css';
import NavBar from './components/NavBar';
import { Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/home.js';
import Owner from './pages/owner/owner.js';
import Vet from './pages/vet/vet.js';
import LostFound from './pages/lost_found.js';
import Help from './pages/help.js';
import OwnerProfile from './pages/owner/ownerProfile.js';
import OwnerPets from './pages/owner/ownerPets.js';
import OwnerDeclarations from './pages/owner/ownerDeclarations.js';
import SignUp from './pages/signup.js';
import ReportLost from './pages/report_lost.js';
import Error404 from './pages/404.js';
import Footer from './components/footer.jsx';
import SearchVet from './pages/owner/searchVet.js';
import { Box } from "@mui/material";

function App() {
  const location = useLocation();
  const hideNav =
    location.pathname === "/signup" ||
    location.pathname === "/lost-found/lost_pet";

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {!hideNav && <NavBar />}

      <Box sx={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/owner" element={<Owner />} />
          <Route path="/vet" element={<Vet />} />
          <Route path="/owner/search-vet" element={<SearchVet />} />
          <Route path="/lost-found" element={<LostFound />} />
          <Route path="/lost-found/lost_pet" element={<ReportLost />} />
          <Route path="/help" element={<Help />} />
          <Route path="/owner/info" element={<OwnerProfile />} />
          <Route path="/owner/pets" element={<OwnerPets />} />
          <Route path="/owner/declarations" element={<OwnerDeclarations />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="*" element={<Error404 />} />
        </Routes>
      </Box>

      <Footer />
    </Box>
  );
}

export default App;