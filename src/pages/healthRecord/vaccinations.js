import React, { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Box, Typography, Paper, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, Chip, Divider, Button, ButtonGroup
} from '@mui/material';

// Icons
import VaccinesIcon from '@mui/icons-material/Vaccines';
import BugReportIcon from '@mui/icons-material/BugReport';
import SortIcon from '@mui/icons-material/Sort';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import CategoryIcon from '@mui/icons-material/Category';

import HealthRecordLayout from '../../components/HealthRecordLayout';

const VaccinationsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [pet, setPet] = useState(location.state?.pet || null);

  // State για ταξινόμηση Εμβολίων
  const [vaccineSortBy, setVaccineSortBy] = useState('date'); 
  
  // State για ταξινόμηση Αποπαρασιτώσεων (ΝΕΟ)
  const [dewormSortBy, setDewormSortBy] = useState('date'); 

  useEffect(() => {
    if (!pet) {
      const storedPetId = localStorage.getItem("activePetId");
      if (storedPetId) {
        fetch(`http://localhost:3001/pets/${storedPetId}`)
          .then(res => res.json())
          .then(data => setPet(data))
          .catch(() => navigate('/owner/pets'));
      } else {
        navigate('/owner/pets');
      }
    }
  }, [pet, navigate]);

  const parseDate = (dateStr) => {
    if (!dateStr) return new Date(0);
    const [day, month, year] = dateStr.split('-');
    return new Date(`${year}-${month}-${day}`);
  };

  // 1. Logic Ταξινόμησης Εμβολίων
  const sortedVaccinations = useMemo(() => {
    const list = [...(pet?.health?.history?.vaccinations || [])];
    if (vaccineSortBy === 'date') {
      return list.sort((a, b) => parseDate(b.date) - parseDate(a.date));
    } else {
      return list.sort((a, b) => {
        const nameComparison = a.name.localeCompare(b.name);
        if (nameComparison !== 0) return nameComparison;
        return parseDate(b.date) - parseDate(a.date);
      });
    }
  }, [pet, vaccineSortBy]);

  // 2. Logic Ταξινόμησης Αποπαρασιτώσεων (ΝΕΟ)
  const sortedDeworming = useMemo(() => {
    const list = [...(pet?.health?.history?.deworming || [])];

    if (dewormSortBy === 'date') {
      // Default: Πιο πρόσφατα πρώτα
      return list.sort((a, b) => parseDate(b.date) - parseDate(a.date));
    } else {
      // Group: Ανά Τύπο (Internal/External), μετά ημερομηνία
      return list.sort((a, b) => {
        // Σύγκριση Τύπου (Internal vs External)
        const typeComparison = a.type.localeCompare(b.type);
        
        if (typeComparison !== 0) return typeComparison;
        
        // Αν είναι ίδιος τύπος, ταξινόμηση χρονολογικά
        return parseDate(b.date) - parseDate(a.date);
      });
    }
  }, [pet, dewormSortBy]);


  if (!pet) return null;

  return (
    <HealthRecordLayout petData={pet}>
      <Box sx={{ maxWidth: '1000px', mx: 'auto' }}>

        {/* ------------------------------------------- */}
        {/* ΕΝΟΤΗΤΑ 1: ΕΜΒΟΛΙΑΣΜΟΙ */}
        {/* ------------------------------------------- */}
        <Box sx={{ mb: 6 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mb: 2, flexWrap: 'wrap', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
               <Box sx={{ bgcolor: '#e0f2f1', p: 1, borderRadius: '8px', color: '#1ea596' }}>
                  <VaccinesIcon />
               </Box>
               <Typography variant="h6" fontWeight="bold" color="#2c3e50">Ιστορικό Εμβολιασμών</Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="caption" color="text.secondary" sx={{ mr: 1, display: { xs: 'none', sm: 'block'} }}>
                    <SortIcon sx={{ verticalAlign: 'middle', fontSize: 18 }} /> Ταξινόμηση:
                </Typography>
                <ButtonGroup size="small" variant="outlined" sx={{ bgcolor: 'white' }}>
                    <Button 
                        onClick={() => setVaccineSortBy('date')}
                        startIcon={<CalendarMonthIcon />}
                        sx={{ 
                            borderColor: '#1ea596', 
                            color: vaccineSortBy === 'date' ? 'white' : '#1ea596',
                            bgcolor: vaccineSortBy === 'date' ? '#1ea596' : 'transparent',
                            '&:hover': { bgcolor: vaccineSortBy === 'date' ? '#168a7d' : '#e0f2f1', borderColor: '#1ea596' }
                        }}
                    >
                        ΠΙΟ ΠΡΟΣΦΑΤΑ
                    </Button>
                    <Button 
                        onClick={() => setVaccineSortBy('name')}
                        startIcon={<CategoryIcon />}
                        sx={{ 
                            borderColor: '#1ea596', 
                            color: vaccineSortBy === 'name' ? 'white' : '#1ea596',
                            bgcolor: vaccineSortBy === 'name' ? '#1ea596' : 'transparent',
                            '&:hover': { bgcolor: vaccineSortBy === 'name' ? '#168a7d' : '#e0f2f1', borderColor: '#1ea596' }
                        }}
                    >
                        ΑΝΑ ΕΜΒΟΛΙΟ
                    </Button>
                </ButtonGroup>
            </Box>
          </Box>

          <TableContainer component={Paper} elevation={0} sx={{ borderRadius: '16px', border: '1px solid #eee', maxHeight: 320 }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold', bgcolor: '#f4f6f8' }}>Ημερομηνία</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', bgcolor: '#f4f6f8' }}>Ονομασία Εμβολίου</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', bgcolor: '#f4f6f8' }}>Δόση</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sortedVaccinations.length > 0 ? (
                  sortedVaccinations.map((vac) => (
                    <TableRow key={vac.id} hover>
                      <TableCell sx={{ whiteSpace: 'nowrap' }}>{vac.date}</TableCell>
                      <TableCell sx={{ fontWeight: '500', color: '#1ea596' }}>{vac.name}</TableCell>
                      <TableCell>
                        <Chip label={vac.dose || "-"} size="small" variant="outlined" sx={{ borderColor: '#ddd', color: '#555', minWidth: '40px' }} />
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow><TableCell colSpan={3} align="center">Δεν βρέθηκαν εμβόλια.</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        <Divider sx={{ mb: 6 }} />

        {/* ------------------------------------------- */}
        {/* ΕΝΟΤΗΤΑ 2: ΑΠΟΠΑΡΑΣΙΤΩΣΕΙΣ (ΕΝΗΜΕΡΩΜΕΝΗ) */}
        {/* ------------------------------------------- */}
        <Box>
           {/* Header με Τίτλο ΚΑΙ Κουμπιά Ταξινόμησης */}
           <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mb: 2, flexWrap: 'wrap', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
               <Box sx={{ bgcolor: '#fff3e0', p: 1, borderRadius: '8px', color: '#ff9800' }}>
                  <BugReportIcon />
               </Box>
               <Typography variant="h6" fontWeight="bold" color="#2c3e50">Ιστορικό Αποπαρασιτώσεων</Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="caption" color="text.secondary" sx={{ mr: 1, display: { xs: 'none', sm: 'block'} }}>
                    <SortIcon sx={{ verticalAlign: 'middle', fontSize: 18 }} /> Ταξινόμηση:
                </Typography>
                
                {/* Κουμπιά Ταξινόμησης για Αποπαρασιτώσεις */}
                <ButtonGroup size="small" variant="outlined" sx={{ bgcolor: 'white' }}>
                    <Button 
                        onClick={() => setDewormSortBy('date')}
                        startIcon={<CalendarMonthIcon />}
                        sx={{ 
                            borderColor: '#ff9800', 
                            color: dewormSortBy === 'date' ? 'white' : '#ff9800',
                            bgcolor: dewormSortBy === 'date' ? '#ff9800' : 'transparent',
                            '&:hover': { bgcolor: dewormSortBy === 'date' ? '#f57c00' : '#fff3e0', borderColor: '#ff9800' }
                        }}
                    >
                        ΠΙΟ ΠΡΟΣΦΑΤΑ
                    </Button>
                    <Button 
                        onClick={() => setDewormSortBy('type')}
                        startIcon={<CategoryIcon />}
                        sx={{ 
                            borderColor: '#ff9800',
                            color: dewormSortBy === 'type' ? 'white' : '#ff9800',
                            bgcolor: dewormSortBy === 'type' ? '#ff9800' : 'transparent',
                            '&:hover': { bgcolor: dewormSortBy === 'type' ? '#f57c00' : '#fff3e0', borderColor: '#ff9800' }
                        }}
                    >
                        ΑΝΑ ΤΥΠΟ
                    </Button>
                </ButtonGroup>
            </Box>
          </Box>

          <TableContainer component={Paper} elevation={0} sx={{ borderRadius: '16px', border: '1px solid #eee', maxHeight: 320
           }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold', bgcolor: '#f4f6f8' }}>Ημερομηνία</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', bgcolor: '#f4f6f8' }}>Τύπος</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', bgcolor: '#f4f6f8' }}>Σκεύασμα</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sortedDeworming.length > 0 ? (
                  sortedDeworming.map((deworm) => (
                    <TableRow key={deworm.id} hover>
                      <TableCell sx={{ whiteSpace: 'nowrap' }}>{deworm.date}</TableCell>
                      <TableCell>
                        <Chip 
                          label={deworm.type === 'Internal' ? 'Ενδοπαράσιτα' : 'Εξωπαράσιτα'} 
                          size="small"
                          sx={{ 
                            fontWeight: 'bold',
                            bgcolor: deworm.type === 'Internal' ? '#e3f2fd' : '#fff3e0',
                            color: deworm.type === 'Internal' ? '#1976d2' : '#ed6c02'
                          }} 
                        />
                      </TableCell>
                      <TableCell sx={{ fontWeight: '500' }}>{deworm.product}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow><TableCell colSpan={3} align="center" sx={{py:3, color:'text.secondary'}}>Δεν βρέθηκε ιστορικό.</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

      </Box>
    </HealthRecordLayout>
  );
};

export default VaccinationsPage;