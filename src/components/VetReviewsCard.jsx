import React, { useMemo } from 'react';
import { Box, Typography, Avatar, Divider, Rating } from '@mui/material';

const VetReviews = ({ vet, authors = {} }) => {
  
  // --- ΥΠΟΛΟΓΙΣΜΟΙ (STATS & LIST) ---
  const { reviewStats, sortedReviews } = useMemo(() => {
    const reviews = vet?.reviews || [];
    
    // Αρχικοποίηση στατιστικών
    const stats = {
      count: 0,
      sum: 0,
      stars: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0, 0: 0 }
    };

    reviews.forEach(r => {
      stats.count++;
      stats.sum += r.rating;
      if (stats.stars[r.rating] !== undefined) {
        stats.stars[r.rating]++;
      }
    });

    stats.average = stats.count > 0 ? (stats.sum / stats.count).toFixed(1) : 0;

    // Ταξινόμηση: Τα πιο πρόσφατα πρώτα
    const sorted = [...reviews].sort((a, b) => new Date(b.date) - new Date(a.date));

    return { reviewStats: stats, sortedReviews: sorted };
  }, [vet]);

  // --- RENDERING ---
  return (
    <Box sx={{ width: '100%', maxWidth: '1000px', mx: 'auto' }}>
      
      {/* 1. HEADER ΣΤΑΤΙΣΤΙΚΩΝ */}
      <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', md: 'row' }, 
          gap: 4, 
          mb: 5, 
          p: 3, 
          bgcolor: '#fff', 
          borderRadius: 3, 
          boxShadow: '0 2px 10px rgba(0,0,0,0.05)' 
      }}>
          
          {/* Αριστερά: Μεγάλο νούμερο */}
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minWidth: '200px' }}>
              <Typography variant="h2" fontWeight="bold" color="primary.main">
                  {reviewStats.average}
              </Typography>
              <Rating value={Number(reviewStats.average)} precision={0.5} readOnly size="large" />
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  {reviewStats.count} Αξιολογήσεις
              </Typography>
          </Box>

          <Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', md: 'block' } }} />

          {/* Δεξιά: Μπάρες ανά αστέρι */}
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 1 }}>
              {[5, 4, 3, 2, 1].map((star) => {
                  const count = reviewStats.stars[star];
                  const percent = reviewStats.count > 0 ? (count / reviewStats.count) * 100 : 0;
                  
                  return (
                      <Box key={star} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Typography variant="body2" fontWeight="bold" sx={{ width: '30px' }}>{star} ★</Typography>
                          <Box sx={{ flex: 1, height: '8px', bgcolor: '#eee', borderRadius: 4, overflow: 'hidden' }}>
                              <Box sx={{ width: `${percent}%`, height: '100%', bgcolor: '#FFB400' }} /> 
                          </Box>
                          <Typography variant="body2" color="text.secondary" sx={{ width: '30px', textAlign: 'right' }}>
                              {count}
                          </Typography>
                      </Box>
                  );
              })}
          </Box>
      </Box>

      {/* 2. ΛΙΣΤΑ ΚΡΙΤΙΚΩΝ */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {sortedReviews.length > 0 ? (
              sortedReviews.map((review, index) => {
                  // Βρίσκουμε το όνομα από το prop authors (αλλιώς "Χρήστης")
                  const authorName = authors[review.authorId] || "Ανώνυμος Χρήστης";
                  const dateStr = new Date(review.date).toLocaleDateString('el-GR');

                  return (
                      <Box key={index} sx={{ p: 3, bgcolor: '#fff', borderRadius: 2, border: '1px solid #eee' }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                                  <Avatar sx={{ bgcolor: '#e0e0e0', color: '#666' }}>
                                      {authorName.charAt(0)}
                                  </Avatar>
                                  <Box>
                                      <Typography fontWeight="bold">{authorName}</Typography>
                                      <Typography variant="caption" color="text.secondary">{dateStr}</Typography>
                                  </Box>
                              </Box>
                              <Box sx={{ bgcolor: '#fff9c4', px: 1, py: 0.5, borderRadius: 1, display: 'flex', alignItems: 'center', height: 'fit-content' }}>
                                  <Typography fontWeight="bold" color="#fbc02d">{review.rating} ★</Typography>
                              </Box>
                          </Box>
                          
                          <Typography variant="body1" sx={{ color: '#333', lineHeight: 1.6 }}>
                              {review.comment}
                          </Typography>
                      </Box>
                  );
              })
          ) : (
              <Typography textAlign="center" color="text.secondary" sx={{ py: 4 }}>
                  Δεν υπάρχουν ακόμη αξιολογήσεις για αυτόν τον κτηνίατρο.
              </Typography>
          )}
      </Box>

    </Box>
  );
};

export default VetReviews;