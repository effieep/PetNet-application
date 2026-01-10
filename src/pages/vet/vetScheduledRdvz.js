import { Typography } from '@mui/material';
import { useAuth } from "../../auth/AuthContext";

const VetScheduledRdvz = () => {
    const {user, isLoggedIn} = useAuth();
    return ( isLoggedIn && user?.role === 'vet' ?
        (<div>Vet Scheduled Rdvz Page</div>) 
    : 
    ( <Typography variant="h6" color="error" textAlign="center" sx={{ mt: 10 }}>
        Παρακαλώ συνδεθείτε ως Κτηνίατρος για να δείτε τα προγραμματισμένα ραντεβού.
    </Typography>)
    );
};

export default VetScheduledRdvz;