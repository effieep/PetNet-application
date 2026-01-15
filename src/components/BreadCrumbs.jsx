import { Breadcrumbs, Link, Typography } from "@mui/material";
import { Link as RouterLink, useLocation } from "react-router-dom";
import PlayArrowIcon from '@mui/icons-material/PlayArrow';

const breadcrumbMap = {
  owner: 'Ιδιοκτήτης/τρια',
  vet: 'Κτηνίατρος',
  info: 'Στοιχεία',
  pets: 'Κατοικίδια',
  declarations: 'Δηλώσεις',
  appointments: 'Ραντεβού',
  'manage-pets': 'Διαχείριση Ζώων',
  'manage-appointments': 'Διαχείριση Ραντεβού',
  'search-vet': 'Αναζήτηση Κτηνιάτρου',
  lost_pet: 'Δήλωση Απώλειας',
  found_pet: 'Δήλωση Εύρεσης',
  'lost-found': 'Χάθηκε/Βρέθηκε Ζώο',
  'public-profile': 'Δημόσιο Προφίλ Κτηνιάτρου',
  'actions-history': 'Ιστορικό Ενεργειών',
  reviews: 'Αξιολογήσεις Κτηνιάτρου',
  review: 'Αξιολόγηση Ραντεβού',
  healthRecord: 'Βιβλιάριο Υγείας',
  overview: 'Προεπισκόπηση',
  vaccinations: 'Εμβολιασμοί & Αποπαρασιτώσεις',
  medicalHistory: 'Ιστορικό Ιατρικών Πράξεων',
  petInfo: 'Στοιχεία Ζώου',
  'register-pet': 'Καταγραφή Νέου Κατοικιδίου',
  'record-medical-action': 'Kαταγραφή Ιατρικής Πράξης',
  'record-life-event': 'Καταγραφή Συμβάντος Ζωής',
  'view-health-record': 'Προβολή Βιβλιαρίου Υγείας',
  'manage-availability': 'Διαχείριση Διαθεσιμότητας',
  'manage-requests': 'Διαχείριση Αιτημάτων Ραντεβού',
  'scheduled-appointments': 'Προγραμματισμένα Ραντεβού',
  'vet-details': 'Πληροφορίες Κτηνιάτρου',
  'record-vaccine': 'Καταγραφή Εμβολιασμού',
  'record-deworming': 'Καταγραφή Αποπαρασίτωσης',
  'record-diagnostic-test': 'Καταγραφή Διαγνωστικής Εξέτασης',
  'record-treatment': 'Καταγραφή Θεραπείας',
  'record-surgery': 'Καταγραφή Χειρουργικής Επέμβασης',
  'adoption': 'Καταγραφή Υιοθεσίας',
  'transfer': 'Καταγραφή Μεταβίβασης',
  'foster': 'Καταγραφή Αναδοχής',
  'death': 'Καταγραφή Θανάτου',
  'book-appointment': 'Κράτηση Ραντεβού',
  'appointment-history': 'Ιστορικό Ραντεβού',
  'help': 'Βοήθεια',
};

function AppBreadcrumbs() {
  const location = useLocation();

  const pathnames = location.pathname.split("/").filter((x) => x);

  return (
    <Breadcrumbs
      aria-label="breadcrumb"
      sx={{ mb: 3, px : 2, py : 1 }}
      separator={
        <PlayArrowIcon sx={{ fontSize: 14, color: "text.secondary" }} />
      }
    >
      {/* Home always first */}
      <Link
        component={RouterLink}
        to="/"
        underline="hover"
        color="inherit"
        sx={{ fontWeight: "bold" }}
      >
        Αρχική
      </Link>

      {pathnames.map((value, index) => {
        const to = `/${pathnames.slice(0, index + 1).join("/")}`;
        const isLast = index === pathnames.length - 1;
        const label =
          breadcrumbMap[value] ||
          value.charAt(0).toUpperCase() + value.slice(1);

        return isLast ? (
          // Current page: Typography, bold + underline
          <Typography
            key={to}
            sx={{ fontWeight: "bold", textDecoration: "underline" }}
            color="text.primary"
          >
            {label}
          </Typography>
        ) : (
          // Other pages: Link, bold
          <Link
            component={RouterLink}
            to={to}
            key={to}
            underline="hover"
            color="inherit"
            sx={{ fontWeight: "bold" }}
          >
            {label}
          </Link>
        );
      })}
    </Breadcrumbs>
  );
}

export default AppBreadcrumbs;
