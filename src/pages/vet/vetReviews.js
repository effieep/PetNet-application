import ProfileLayout from "../../components/profileLayout";
import { useState, useEffect, useMemo } from "react";
import { useAuth } from "../../auth/AuthContext";
import { Box, Typography, CircularProgress, Alert } from "@mui/material";
import { API_URL } from "../../api";

const reverseAndAddSlashes = (dateStr) => {
  const parts = dateStr.split('-');
  return parts.reverse().join('/');
};

const VetHistory = () => {
  const { user } = useAuth();
  const [userData, setUserData] = useState(null);
  const [usersMap, setUsersMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch current user data
        const response = await fetch(`${API_URL}/users/${user.id}`);
        if (!response.ok) throw new Error("Δεν βρέθηκαν τα στοιχεία του χρήστη.");
        const data = await response.json();
        setUserData(data);

        // Fetch all users to build a map for author names
        const res = await fetch(`${API_URL}/users`);
        const users = await res.json();
        const map = users.reduce((acc, u) => {
          acc[u.id] = `${u.name} ${u.surname}`;
          return acc;
        }, {});
        setUsersMap(map);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) fetchData();
    else setLoading(false);
  }, [user]);

  // Compute review stats and rendered review elements in one pass
  const { reviewStats, renderedReviews } = useMemo(() => {
    const stats = {
      totalReviews: 0,
      totalRating: 0,
      total0Star: 0,
      total1Star: 0,
      total2Star: 0,
      total3Star: 0,
      total4Star: 0,
      total5Star: 0,
    };

    const elements = (userData?.reviews || []).map((review) => {
      const authorName = usersMap[review.authorId] || "Άγνωστος Χρήστης";

      stats.totalReviews += 1;
      stats.totalRating += review.rating;

      switch (review.rating) {
        case 0: stats.total0Star += 1; break;
        case 1: stats.total1Star += 1; break;
        case 2: stats.total2Star += 1; break;
        case 3: stats.total3Star += 1; break;
        case 4: stats.total4Star += 1; break;
        case 5: stats.total5Star += 1; break;
        default: break;
      }

      return (
        <Box
          key={review.appointmentId}
          sx={{ mb: 2, p: 2, boxShadow: "0 2px 8px rgba(0,0,0,0.1)", borderRadius: "8px", backgroundColor: "#ffc80015" }}
        >
          <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
            {authorName} - Βαθμολογία: {review.rating}/5
          </Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            {review.comment}
          </Typography>
          <Typography variant="caption" sx={{ color: "#555" }}>
            {reverseAndAddSlashes(new Date(review.date).toISOString().split('T')[0])}
          </Typography>
        </Box>
      );
    });

    return { reviewStats: stats, renderedReviews: elements };
  }, [userData, usersMap]);

  if (loading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <CircularProgress />
      </Box>
    );

  if (error)
    return (
      <Alert severity="error" sx={{ mt: 10, textAlign: "center" }}>
        {error}
      </Alert>
    );

  return (
    <ProfileLayout role={userData?.role || "vet"}>
      <Typography variant="h5" sx={{ fontWeight: "bold", color: "#373721", mb: 2 }}>
        Oι Αξιολογήσεις μου
      </Typography>
      {renderedReviews.length > 0 && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 0,
            my: 3,
            p: 1,
            borderRadius: 2,
            boxShadow: "0 2px 6px rgba(0,0,0,0.12)",
            backgroundColor: "#f5f5f5",
            maxWidth: 300,
            mx: "auto",
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: "bold", color: "#1e3a5f" }}>
            Μέση Βαθμολογία:{" "}
            {reviewStats.totalReviews
              ? (reviewStats.totalRating / reviewStats.totalReviews).toFixed(1)
              : 0}
            /5
          </Typography>

          <Typography variant="subtitle1" sx={{ color: "#455a64" }}>
            Συνολικές Αξιολογήσεις: {reviewStats.totalReviews}
          </Typography>

          {[5, 4, 3, 2, 1, 0].map((star) => {
            const totalForStar = reviewStats[`total${star}Star`] || 0;
            const percent =
              reviewStats.totalReviews > 0
                ? (totalForStar / reviewStats.totalReviews) * 100
                : 0;

            return (
              <Box
                key={star}
                sx={{ display: "flex", alignItems: "center", width: "100%", gap: 1 }}
              >
                <Typography sx={{ width: 30, fontWeight: "bold" }}>
                  {star}★
                </Typography>

                <Box
                  sx={{
                    flex: 1,
                    height: 12,
                    borderRadius: 6,
                    backgroundColor: "#cfd8dc",
                    overflow: "hidden",
                  }}
                >
                  <Box
                    sx={{
                      width: `${percent}%`,
                      height: "100%",
                      backgroundColor: "#1e88e5",
                    }}
                  />
                </Box>

                <Typography sx={{ width: 30, textAlign: "right", fontWeight: "light", color: "#72747598" }}>
                  ({totalForStar})
                </Typography>
              </Box>
            );
          })}
        </Box>
      )}
      {/* Reviews box */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          maxHeight: "40vh",
          gap: 3,
          boxShadow: renderedReviews.length > 0 ? "0 2px 8px rgba(0,0,0,0.1)" : "none",
          borderRadius: 2,
          border: renderedReviews.length > 0 ? "1px solid #ddd" : "none",
          p: 3,
          overflowY: "auto",
          backgroundColor: renderedReviews.length > 0 ? "#f5f5f5" : "transparent",
        }}
      >
        {renderedReviews.length > 0 ? (
          renderedReviews
        ) : (
          <Typography
            variant="body1"
            sx={{
              color: "#777",
              fontStyle: "italic",
              fontWeight: "bold",
              textAlign: "center",
              mt: 4,
            }}
          >
            Δεν υπάρχουν αξιολογήσεις για εμφάνιση.
          </Typography>
        )}
      </Box>
    </ProfileLayout>
  );
};

export default VetHistory;
