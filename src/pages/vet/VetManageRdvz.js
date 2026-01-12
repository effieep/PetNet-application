import Hero from '../../components/Hero';
import SubMenu from '../../components/SubMenu';
import { Box } from '@mui/material';


const VetManageRdvz = () => {
  
  const submenuItems = [
    { label: "Διαχείριση Διαθεσιμότητας", path: "/vet/manage-appointments/manage-availability" },
    { label: "Διαχείριση Αιτημάτων Ραντεβού", path: "/vet/manage-appointments/manage-requests" },
    { label: "Προγραμμάτισμένα Ραντεβού", path: "/vet/manage-appointments/scheduled-appointments" },
    { label: "Ιστορικό Ραντεβού", path: "/vet/manage-appointments/appointment-history" },
  ];

  return (
    <>
      <Hero image={'/vet-hero.png'} title={"Διαχείριση Ραντεβού"} subtitle={"Οργανώστε εύκολα τη διαθεσιμότητά σας και τα προγραμματισμένα ραντεβού σας."} height={"50vh"}/>
      <Box sx={{ display: 'flex', p: 2, flexDirection: 'row'}}>
        <SubMenu 
          submenuItems={submenuItems}
        />
        <Box 
          component="img"
          src='/manage-rdvz.jpg'
          alt="Vet Appointments Management"
          sx={{
            ml: 3,
            width : '75vw',
            borderRadius: 2,
          }}
        >
      </Box>
    </Box>
    </>
  );
};

export default VetManageRdvz;