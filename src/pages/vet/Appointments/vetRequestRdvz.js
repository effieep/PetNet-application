import { Typography } from '@mui/material';
import { useAuth } from "../../../auth/AuthContext";


const VetRequestRdvz = () => {
    const {user, isLoggedIn} = useAuth();
    return ( isLoggedIn && user?.role === 'vet' ?
        (<div>Vet requests Page</div>) 
    : 
    ( <Typography variant="h6" color="error" textAlign="center" sx={{ mt: 10 }}>
        Παρακαλώ συνδεθείτε ως Κτηνίατρος για να δείτε τα αιτήματα για ραντεβού.
    </Typography>)
    );
};

export default VetRequestRdvz;