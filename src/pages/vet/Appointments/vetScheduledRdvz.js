import { Typography, Box } from '@mui/material';
import { useAuth } from "../../../auth/AuthContext";
import SubMenu from '../../../components/SubMenu.jsx';

const submenuItems = [
  { label: "Διαχείριση Διαθεσιμότητας", path: "/vet/manage-appointments/manage-availability" },
  { label: "Διαχείριση Αιτημάτων Ραντεβού", path: "/vet/manage-appointments/manage-requests" },
  { label: "Προγραμμάτισμένα Ραντεβού", path: "/vet/manage-appointments/scheduled-appointments" },
];


const VetScheduledRdvz = () => {
    const {user, isLoggedIn} = useAuth();
    return ( isLoggedIn && user?.role === 'vet' ?
    (
      <Box sx={{ width: '250px', flexShrink: 0 }}>
        <SubMenu submenuItems={submenuItems} />
      </Box>
    ) 
    : 
    ( <Typography variant="h6" color="error" textAlign="center" sx={{ mt: 10 }}>
        Παρακαλώ συνδεθείτε ως Κτηνίατρος για να δείτε τα προγραμματισμένα ραντεβού.
    </Typography>)
    );
};

export default VetScheduledRdvz;