import Hero from '../../components/Hero';
import SubMenu from '../../components/SubMenu';
import { Box, Typography, Divider } from '@mui/material';
import { MdOutlinePets } from 'react-icons/md';
import {  PiStethoscopeBold } from 'react-icons/pi';
import { HiOutlineDocumentAdd } from 'react-icons/hi';


const VetManagePets = () => {
  
  const submenuItems = [
    {label: "Καταγραφή νέου Κατοικιδίου", path : "/vet/manage-pets/register-pet"},
    {label: "Kαταγραφή Ιατρικής Πράξης", path : "/vet/manage-pets/record-medical-action"},
    {label: "Καταγραφή Συμβάντος Ζωής", path : "/vet/manage-pets/record-life-event"},
    {label: "Προβολή Βιβλιαρίου Υγείας", path : "/vet/manage-pets/view-health-record"},
    {label: "Ιστορικό Ενεργειών", path : "/vet/manage-pets/actions-history"},
  ];

  return (
    <>
      <Hero image={'/vet-hero.png'} title={"Διαχείριση Ζώων "} subtitle={"Καταχωρήστε νέα ζώα, ενημερώστε το ηλεκτρονικό βιβλιάριο υγείας και διαχειριστείτε σημαντικά συμβάντα ζωής."} height={"50vh"}/>
      <Box sx={{ display: 'flex', p: 2, flexDirection: 'row'}}>
        <SubMenu 
          submenuItems={submenuItems}
        />
        <Box sx={{ display: 'flex', p: 3, flexDirection: 'column', justifyContent: 'center' }}>
          <Box
            sx={{
              width : '75vw',
              borderRadius: 2,
              border: '1px solid #000000ff',
              maxHeight: '100vh',
              backgroundColor: '#FFEFB2',
              textAlign: 'center',
            }}
          >
            <Typography variant="h5" sx={{ pt: 2, color: '#42422B' }}>
              <MdOutlinePets style={{ verticalAlign: 'bottom', marginRight: 8, fontSize: '1.5em', fontFamily: 'Inter', color: '#42422B' }} />
              Kαταγραφή Νέου Κατοικιδίου
            </Typography>
            <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
              {/* Left text */}
              <Typography variant="body1" sx={{ flex: '0 0 50%', color: '#42422B', whiteSpace: 'normal' }}>
                Δημιουργήστε εύκολα <strong>νέο ηλεκτρονικό βιβλιάριο υγείας.</strong> Συνδέστε το ζώο με τον ιδιοκτήτη του και καταχωρήστε βασικά στοιχεία ταυτοποίησης.
              </Typography>

              {/* Divider */}
              <Divider orientation="vertical" flexItem sx={{ mx: 2, width: '0px', backgroundColor: '#42422B' }} />

              {/* Right list */}
              <Typography variant="body1" sx={{ flex: '1', color: '#42422B' }}>
                Για την αρχικοποίηση <strong>απαιτείται</strong>
                <Box
                  component="ul"
                  sx={{
                    paddingLeft: 2,
                    margin: 0,
                    listStylePosition: 'inside',
                  }}
                >
                  <li>Αριθμός Microchip</li>
                  <li>Είδος Ζώου</li>
                  <li>Όνομα</li>
                  <li>Φύλο</li>
                  <li>Φυλή</li>
                  <li>Ηλικία</li>
                  <li>Χρώμα</li>
                </Box>
              </Typography>
            </Box>
          </Box>
          <Box
            sx={{
              mt: 3,
              width : '75vw',
              borderRadius: 2,
              maxHeight: '100vh',
              textAlign: 'center',
              flexDirection: 'row',
              display: 'flex',             
              justifyContent: 'space-evenly',
            }}
          >
            <Box
            sx={{
              width : '37.5vw',
              borderRadius: 2,
              maxHeight: '100vh',
              backgroundColor: '#FFEFB2',
              textAlign: 'center',
              border: '1px solid #000000ff',
              mr: 1,
            }}
            >
              <Typography variant="h5" sx={{ pt: 2, color: '#42422B' }}>
                <PiStethoscopeBold style={{ verticalAlign: 'bottom', marginRight: 8, fontSize: '1.5em', fontFamily: 'Inter', color: '#42422B' }} />
                Kαταγραφή Ιατρικής Πράξης
              </Typography>
              <Typography variant="body1" sx={{ p: 2, color: '#42422B' }}>
                <strong>Ενημερώστε άμεσα το βιβλιάριο</strong> υγείας με ιατρικές πράξεις. Οι πληροφορίες εμφανίζονται αυτόματα στον ιδιοκτήτη.
              </Typography>
              <Divider sx={{ mx: 2, backgroundColor: '#42422B' }} />
              <Typography variant="body2" sx={{ p: 2, color: '#42422B', fontStyle: 'italic' }}>
                Εμβολιασμοί, αποπαρασιτώσεις, διαγνωστικά τεστ, θεραπείες, χειρουργίεα
              </Typography>
            </Box>
            <Box
              sx={{
                width : '37.5vw',
                borderRadius: 2,
                maxHeight: '100vh',
                backgroundColor: '#FFEFB2',
                textAlign: 'center',
                border: '1px solid #000000ff',
              }}
            >
              <Typography variant="h5" sx={{ pt: 2, color: '#42422B' }}>
                <HiOutlineDocumentAdd style={{ verticalAlign: 'bottom', marginRight: 8, fontSize: '1.5em', fontFamily: 'Inter', color: '#42422B' }} />
                Kαταγραφή Συμβάντος Ζωής
              </Typography>
              <Typography variant="body1" sx={{ p: 2, color: '#42422B' }}>
                Καταγράψτε <strong>σημαντικά γεγονότα στη ζωή του ζώου.</strong> Οι αλλαγές ενημερώνουν αυτόματα τον ιδιοκτήτη και τις υπηρεσίες.
              </Typography>
              <Divider sx={{ mx: 2, backgroundColor: '#42422B' }} />
              <Typography variant="body2" sx={{ p: 2, color: '#42422B', fontStyle: 'italic' }}>
                Αναδοχή, υιοθεσία, μεταβίβαση, απώλεια, εύρεση, θάνατος
              </Typography>
            </Box>

          </Box>
        </Box>
      </Box>
    </>
  );
};

export default VetManagePets;