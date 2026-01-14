import React, { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Box, Typography, Paper, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, Chip, Divider, Button, ButtonGroup
} from '@mui/material';

// Icons
import ScienceIcon from '@mui/icons-material/Science'; // Για Διαγνωστικά
import HealingIcon from '@mui/icons-material/Healing'; // Για Θεραπείες
import LocalHospitalIcon from '@mui/icons-material/LocalHospital'; // Για Χειρουργεία
import SortIcon from '@mui/icons-material/Sort';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import CategoryIcon from '@mui/icons-material/Category';

import HealthRecordLayout from '../../components/HealthRecordLayout';
import { API_URL }from "../../api";

const parseDate = (dateStr) => {
  if (!dateStr) return 0;
  const cleanDate = dateStr.toString().replace(/\//g, '-');
  const parts = cleanDate.split('-');
  if (parts.length !== 3) return 0;
  const [day, month, year] = parts;
  return new Date(`${year}-${month}-${day}`).getTime();
};

// Generic Sorter Function 
const getSortedData = (data, sortBy) => {
  const list = [...(data || [])];
  if (sortBy === 'date') {
    return list.sort((a, b) => parseDate(b.date) - parseDate(a.date));
  } else {
    return list.sort((a, b) => {
      const nameA = a.title || "";
      const nameB = b.title || "";
      const comparison = nameA.localeCompare(nameB);
      if (comparison !== 0) return comparison;
      return parseDate(b.date) - parseDate(a.date);
    });
  }
};


const MedicalHistory = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [pet, setPet] = useState(location.state?.pet || null);
  // States για ταξινόμηση (ξεχωριστά για κάθε πίνακα)
  const [testsSortBy, setTestsSortBy] = useState('date');
  const [treatmentsSortBy, setTreatmentsSortBy] = useState('date');
  const [surgeriesSortBy, setSurgeriesSortBy] = useState('date');

  useEffect(() => {
    if (!pet) {
      const storedPetId = localStorage.getItem("activePetId");
      if (storedPetId) {
        // Κάνουμε fetch το ζώο ξανά
        fetch(`${API_URL}/pets/${storedPetId}`)
          .then(res => res.json())
          .then(data => setPet(data))
          .catch(() => navigate('/owner/pets'));
      } else {
        // Αν δεν βρούμε τίποτα, πίσω στη λίστα
        navigate('/owner/pets');
      }
    }
  }, [pet, navigate]);

  // Χρήση useMemo για βελτιστοποίηση
  const sortedTests = useMemo(() => getSortedData(pet?.health?.history?.medicalActs?.tests, testsSortBy), [pet, testsSortBy]);
  const sortedTreatments = useMemo(() => getSortedData(pet?.health?.history?.medicalActs?.medication, treatmentsSortBy), [pet, treatmentsSortBy]);
  const sortedSurgeries = useMemo(() => getSortedData(pet?.health?.history?.medicalActs?.surgeries, surgeriesSortBy), [pet, surgeriesSortBy]);
    // Αν δεν έχουν φορτώσει ακόμα τα δεδομένα, δεν δείχνουμε τίποτα 
  if (!pet) return null;
  
  const SectionHeader = ({ title, icon, color, sortBy, setSortBy }) => (
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mb: 2, flexWrap: 'wrap', gap: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box sx={{ bgcolor: `${color}15`, p: 1, borderRadius: '8px', color: color }}>
          {icon}
        </Box>
        <Typography variant="h6" fontWeight="bold" color="#2c3e50">{title}</Typography>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography variant="caption" color="text.secondary" sx={{ mr: 1, display: { xs: 'none', sm: 'block'} }}>
            <SortIcon sx={{ verticalAlign: 'middle', fontSize: 18 }} /> Ταξινόμηση:
        </Typography>
        <ButtonGroup size="small" variant="outlined" sx={{ bgcolor: 'white' }}>
          <Button 
            onClick={() => setSortBy('date')}
            startIcon={<CalendarMonthIcon />}
            sx={{ 
              borderColor: color, color: sortBy === 'date' ? 'white' : color, bgcolor: sortBy === 'date' ? color : 'transparent',
              '&:hover': { bgcolor: sortBy === 'date' ? color : `${color}15`, borderColor: color }
            }}
          >
            ΠΡΟΣΦΑΤΑ
          </Button>
          <Button 
            onClick={() => setSortBy('name')}
            startIcon={<CategoryIcon />}
            sx={{ 
              borderColor: color, color: sortBy === 'name' ? 'white' : color, bgcolor: sortBy === 'name' ? color : 'transparent',
              '&:hover': { bgcolor: sortBy === 'name' ? color : `${color}15`, borderColor: color }
            }}
          >
            ΑΛΦΑΒΗΤΙΚΑ
          </Button>
        </ButtonGroup>
      </Box>
    </Box>
  );
  return (
    <HealthRecordLayout petData={pet} activeTab="medicalHistory">
      <Box sx={{ maxWidth: '1000px', mx: 'auto' }}>

        {/* ------------------------------------------- */}
        {/* ΕΝΟΤΗΤΑ 1: ΔΙΑΓΝΩΣΤΙΚΑ ΤΕΣΤ */}
        {/* ------------------------------------------- */}
        <Box sx={{ mb: 6 }}>
          <SectionHeader 
            title="Διαγνωστικά Τεστ & Εξετάσεις" 
            icon={<ScienceIcon />} 
            color="#1ea596" 
            sortBy={testsSortBy} 
            setSortBy={setTestsSortBy} 
          />

          <TableContainer component={Paper} elevation={0} sx={{ borderRadius: '16px', border: '1px solid #eee', maxHeight: 300 }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold', bgcolor: '#f4f6f8' }}>Ημερομηνία</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', bgcolor: '#f4f6f8' }}>Εξέταση</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', bgcolor: '#f4f6f8' }}>Αποτέλεσμα</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', bgcolor: '#f4f6f8' }}>Κτηνίατρος</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sortedTests.length > 0 ? (
                  sortedTests.map((test) => (
                    <TableRow key={test.id} hover>
                      <TableCell sx={{ whiteSpace: 'nowrap' }}>{test.date}</TableCell>
                      <TableCell sx={{ fontWeight: '500', color: '#1ea596' }}>{test.title}</TableCell>
                      <TableCell>
                        <Chip 
                          label={test.result || "-"} 
                          size="small" 
                          variant="outlined"
                          color="default"
                          sx={{ fontWeight: '500' }}
                        />
                      </TableCell>
                      <TableCell sx={{ color: 'text.secondary', fontSize: '0.85rem' }}>{test.vet}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow><TableCell colSpan={4} align="center" sx={{py:3, color:'text.secondary'}}>Δεν βρέθηκαν εξετάσεις.</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        <Divider sx={{ mb: 6 }} />

        {/* ------------------------------------------- */}
        {/* ΕΝΟΤΗΤΑ 2: ΘΕΡΑΠΕΙΕΣ  */}
        {/* ------------------------------------------- */}
        <Box sx={{ mb: 6 }}>
          <SectionHeader 
            title="Θεραπείες & Αγωγές" 
            icon={<HealingIcon />} 
            color="#1976d2" 
            sortBy={treatmentsSortBy} 
            setSortBy={setTreatmentsSortBy} 
          />

          <TableContainer component={Paper} elevation={0} sx={{ borderRadius: '16px', border: '1px solid #eee', maxHeight: 300 }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold', bgcolor: '#f4f6f8' }}>Ημερομηνία</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', bgcolor: '#f4f6f8' }}>Θεραπεία</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', bgcolor: '#f4f6f8' }}>Σημειώσεις / Διάρκεια</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sortedTreatments.length > 0 ? (
                  sortedTreatments.map((med) => (
                    <TableRow key={med.id} hover>
                      <TableCell sx={{ whiteSpace: 'nowrap' }}>{med.startDate}</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', color: '#1976d2' }}>{med.name}</TableCell>
                      <TableCell sx={{ color: 'text.secondary' }}>{med.instructions || "-"}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow><TableCell colSpan={3} align="center" sx={{py:3, color:'text.secondary'}}>Δεν βρέθηκαν θεραπείες.</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        <Divider sx={{ mb: 6 }} />

        {/* ------------------------------------------- */}
        {/* ΕΝΟΤΗΤΑ 3: ΧΕΙΡΟΥΡΓΕΙΑ (Red Color) */}
        {/* ------------------------------------------- */}
        <Box>
          <SectionHeader 
            title="Χειρουργεία" 
            icon={<LocalHospitalIcon />} 
            color="#d32f2f" 
            sortBy={surgeriesSortBy} 
            setSortBy={setSurgeriesSortBy} 
          />

          <TableContainer component={Paper} elevation={0} sx={{ borderRadius: '16px', border: '1px solid #eee', maxHeight: 300 }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold', bgcolor: '#f4f6f8' }}>Ημερομηνία</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', bgcolor: '#f4f6f8' }}>Επέμβαση</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', bgcolor: '#f4f6f8' }}>Σημειώσεις</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', bgcolor: '#f4f6f8' }}>Χειρουργός</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sortedSurgeries.length > 0 ? (
                  sortedSurgeries.map((surg) => (
                    <TableRow key={surg.id} hover>
                      <TableCell sx={{ whiteSpace: 'nowrap' }}>{surg.date}</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', color: '#d32f2f' }}>{surg.title}</TableCell>
                      <TableCell sx={{ color: 'text.secondary' }}>{surg.notes || "-"}</TableCell>
                      <TableCell sx={{ fontSize: '0.85rem' }}>{surg.vet}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow><TableCell colSpan={4} align="center" sx={{py:3, color:'text.secondary'}}>Δεν βρέθηκαν χειρουργεία.</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

      </Box>

    </HealthRecordLayout>
  );
};

export default MedicalHistory;