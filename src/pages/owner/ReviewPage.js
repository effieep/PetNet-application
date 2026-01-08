import React, { useState } from 'react';
import { useAuth } from '../../auth/AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, Typography, Rating, TextField, Button, Paper, Container } from '@mui/material';
import ProfileLayout from '../../components/profileLayout';
import { API_URL } from "../../api";

const ReviewPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const { user } = useAuth();
  const { vet, appointment } = location.state || {};

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const handleSubmit = async () => {
    const authorId = user?.id || null;
  // 2. Δημιουργούμε το νέο αντικείμενο review
    const newReview = {
      authorId: authorId,
      rating: rating,
      comment: comment,
      date: new Date().toISOString(),
      appointmentId: appointment.id
    };

    try {
      // Παίρνουμε τα τρέχοντα δεδομένα του κτηνιάτρου
      const userRes = await fetch(`${API_URL}/users/${vet.id}`);
      const userData = await userRes.json();

      // Ενημερώνουμε τη λίστα των reviews του κτηνιάτρου
      const updatedReviews = userData.reviews ? [...userData.reviews, newReview] : [newReview];

      // Στέλνουμε PATCH στον συγκεκριμένο user (vet)
      const patchRes = await fetch(`${API_URL}/users/${vet.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reviews: updatedReviews }),
      });

      if (patchRes.ok) {
  
        // 6. Ενημερώνουμε το ραντεβού ως "reviewed"
        await fetch(`${API_URL}/appointments/${appointment.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ reviewed: true }),
        });

        alert("Η αξιολόγησή σας υποβλήθηκε με επιτυχία!");

        navigate('/owner/appointments');
      }
    } catch (error) {
      alert("Παρουσιάστηκε σφάλμα κατά την υποβολή.");
    }
  };

  // Αν κάποιος προσπαθήσει να μπει στη σελίδα χωρίς να έρθει από το κουμπί (π.χ. refresh)
  // το state θα είναι null, οπότε καλό είναι να τον στείλουμε πίσω.
  if (!vet || !appointment) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography>Δεν βρέθηκαν στοιχεία για την αξιολόγηση.</Typography>
        <Button onClick={() => navigate("/owner/appointments")}>Επιστροφή στα Ραντεβού</Button>
      </Box>
    );
  }

  return (
    <ProfileLayout role="owner">
      <Container maxWidth="sm" sx={{ mt: 4 }}>
        <Paper sx={{ p: 4, borderRadius: '20px', textAlign: 'center' }}>
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            Αξιολόγηση Ραντεβού με τον/την {vet.name} {vet.surname}
          </Typography>
          
          <Rating
            size="large"
            value={rating}
            onChange={(e, val) => setRating(val)}
            sx={{ mb: 3, fontSize: '3.5rem' }}
          />

          <TextField
            fullWidth
            multiline
            color='#b1b112ff'
            rows={4}
            placeholder="Γράψτε τα σχόλιά σας για τον κτηνίατρο..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            sx={{ mb: 3 }}
          />

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button variant="outlined" color="primary" fullWidth onClick={() => navigate(-1)}>
              ΠΙΣΩ
            </Button>
            <Button variant="contained" color="success" fullWidth onClick={handleSubmit}>
              ΥΠΟΒΟΛΗ
            </Button>
          </Box>
        </Paper>
      </Container>
    </ProfileLayout>
  );
};

export default ReviewPage;