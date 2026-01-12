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
import OwnerAppointments from './pages/owner/ownerAppointments.js';
import ReviewPage from './pages/owner/ReviewPage.js';
import HealthRecord from './pages/healthRecord/healthRecord.js';
import Vaccinations from './pages/healthRecord/vaccinations.js';
import MedicalHistory from './pages/healthRecord/medicalHistory.js';
import PetInfo from './pages/healthRecord/petInfo.js';
import SignUp from './pages/signup.js';
import ReportLost from './pages/report_lost.js';
import Error404 from './pages/404.js';
import Footer from './components/footer.jsx';
import SearchVet from './pages/owner/search-vet/search-vet.js';
import VetDetails from './pages/owner/search-vet/vetDetails.js';
import VetProfile from './pages/vet/vetProfile.js';
import VetRandezvousHistory from './pages/vet/vetHistory.js';
import VetReviews from './pages/vet/vetReviews.js';
import VetPublic from './pages/vet/vetPublic.js';
import VetManagePets from './pages/vet/VetManagePets.js';
import VetManageRdvz from './pages/vet/VetManageRdvz.js';
import VetAvailability from './pages/vet/Appointments/vetAvailability.js';
import VetRequestRdvz from './pages/vet/Appointments/vetRequestRdvz.js';
import VetScheduledRdvz from './pages/vet/Appointments/vetScheduledRdvz.js'; 
import RegisterPet from './pages/vet/RegisterPet.js';
import RegisterMedical from './pages/vet/RegisterMedical.js';
import RegisterEvent from './pages/vet/RegisterEvent.js';
import ViewHealth from './pages/vet/ViewHealth.js';
import RecordVaccine from './pages/vet/medical-acts/recordVaccine.js';
import RecordDeworming from './pages/vet/medical-acts/recordDeworming.js';
import RecordDiagnosticTest from './pages/vet/medical-acts/recordDiagnosticTest.js';
import RecordTreatment from './pages/vet/medical-acts/recordTreatment.js';
import RecordSurgery from './pages/vet/medical-acts/recordSurgery.js';
import Adoption from './pages/vet/Happenings/Adoption.js';
import Transfer from './pages/vet/Happenings/Transfer.js';
import Foster from './pages/vet/Happenings/Foster.js';
import Death from './pages/vet/Happenings/Death.js';
import BookAppointment from './pages/owner/search-vet/BookAppointment.js';
import AppointmentsHistory from './pages/vet/Appointments/vetAppointmentHistory.js';
import { Box } from "@mui/material";

function App() {
  const location = useLocation();
  const hideNav =
    location.pathname === "/signup";
    // ||
    // location.pathname === "/lost-found/lost_pet";

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
          <Route path="/vet/info" element={<VetProfile />} />
          <Route path="/vet/public-profile" element={<VetPublic />} />
          <Route path="/vet/randezvous-history" element={<VetRandezvousHistory />} />
          <Route path="/vet/reviews" element={<VetReviews />} />
          <Route path="/vet/manage-pets" element={<VetManagePets />} />
          <Route path="/vet/manage-pets/register-pet" element={<RegisterPet />} />
          <Route path="/vet/manage-pets/record-medical-action" element={<RegisterMedical />} />
          <Route path="/vet/manage-pets/record-medical-action/record-vaccine" element={<RecordVaccine />} />
          <Route path="/vet/manage-pets/record-medical-action/record-deworming" element={<RecordDeworming />} />
          <Route path="/vet/manage-pets/record-medical-action/record-diagnostic-test" element={<RecordDiagnosticTest />} />
          <Route path="/vet/manage-pets/record-medical-action/record-treatment" element={<RecordTreatment />} />
          <Route path="/vet/manage-pets/record-medical-action/record-surgery" element={<RecordSurgery />} />
          <Route path="/vet/manage-pets/record-life-event/adoption" element={<Adoption />} />
          <Route path="/vet/manage-pets/record-life-event/transfer" element={<Transfer />} />
          <Route path="/vet/manage-pets/record-life-event/foster" element={<Foster />} />
          <Route path = "/vet/manage-pets/record-life-event/death" element={<Death />} />
          <Route path="/vet/manage-pets/view-health-record" element={<ViewHealth />} />
          <Route path="/vet/manage-pets/record-life-event" element={<RegisterEvent />} />
          <Route path="/vet/manage-appointments" element={<VetManageRdvz />} />
          <Route path="/vet/manage-appointments/manage-availability" element={<VetAvailability />} />
          <Route path="/vet/manage-appointments/manage-requests" element={<VetRequestRdvz />} />
          <Route path="/vet/manage-appointments/scheduled-appointments" element={<VetScheduledRdvz />} />
          <Route path="/vet/manage-appointments/appointment-history" element={<AppointmentsHistory />} />
          <Route path="/owner/search-vet" element={<SearchVet />} />
          <Route path="/owner/search-vet/vet-details" element={<VetDetails />} />
          <Route path="/owner/search-vet/book-appointment" element={<BookAppointment />} />
          <Route path="/lost-found" element={<LostFound />} />
          <Route path="/lost-found/lost_pet" element={<ReportLost />} />
          <Route path="/help" element={<Help />} />
          <Route path="/owner/info" element={<OwnerProfile />} />
          <Route path="/owner/pets" element={<OwnerPets />} />
          <Route path="/owner/declarations" element={<OwnerDeclarations />} />
          <Route path="/owner/appointments" element={<OwnerAppointments />} />
          <Route path="/owner/appointments/review" element={<ReviewPage />} />
          <Route path="/healthRecord" element={<HealthRecord/>} />
          <Route path="/healthRecord/vaccinations" element={<Vaccinations/>} />
          <Route path="/healthRecord/medicalHistory" element={<MedicalHistory/>} />
          <Route path="/healthRecord/petInfo" element={<PetInfo/>} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="*" element={<Error404 />} />
        </Routes>
      </Box>

      <Footer />
    </Box>
  );
}

export default App;