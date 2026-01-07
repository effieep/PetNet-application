import React, { useEffect, useMemo, useState } from "react";
import { Typography, CircularProgress, Alert, Box} from "@mui/material";

import { useAuth } from "../../auth/AuthContext";
import ProfileLayout from "../../components/profileLayout";
import AppointmentCard from "../../components/AppointmentCard";

const OwnerAppointments = () => {
  const { user, isLoggedIn } = useAuth();

  const [appointments, setAppointments] = useState([]);
  const [pets, setPets] = useState([]);
  const [vets, setVets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    if (!isLoggedIn || !user?.id) return;

    const fetchAll = async () => {
      try {
        setLoading(true);

        const [appoRes, petsRes, vetsRes] = await Promise.all([
          fetch(`http://localhost:3001/appointments?ownerId=${user.id}`),
          fetch(`http://localhost:3001/pets?ownerId=${user.id}`),
          fetch(`http://localhost:3001/users?role=vet`),
        ]);

        if (!appoRes.ok) throw new Error("Σφάλμα φόρτωσης ραντεβού");
        if (!petsRes.ok) throw new Error("Σφάλμα φόρτωσης κατοικιδίων");
        if (!vetsRes.ok) throw new Error("Σφάλμα φόρτωσης κτηνιάτρων");

        const appoData = await appoRes.json();
        const petsData = await petsRes.json();
        const vetsData = await vetsRes.json();

        setAppointments(appoData);
        setPets(petsData);
        setVets(vetsData);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [isLoggedIn, user?.id]);

  const petById = useMemo(() => {
    const map = {};
    for (const p of pets) map[String(p.id)] = p;
    return map;
  }, [pets]);

  const vetById = useMemo(
    () => Object.fromEntries(vets.map(v => [String(v.id), v])),
    [vets]
  );

  const appointmentsFull = useMemo(() => {
    return appointments.map(a => ({
      ...a,
      pet: petById[String(a.petId)] || null,
      vet: vetById[String(a.vetId)] || null,
    }));
  }, [appointments, petById, vetById]);


  //Scheduled appointments
  const upcoming = appointmentsFull.filter(a =>
    ["PENDING", "CONFIRMED"].includes(a.status)
  );

  //Past appointments
  const completed = appointmentsFull.filter(a =>
    a.status === "COMPLETED"
  );

  //Cancelled appointments
  const cancelled = appointmentsFull.filter(a =>
    a.status === "CANCELLED"
  );

  if (!isLoggedIn) {
    return (
      <Typography variant="h6" color="error" textAlign="center" sx={{ mt: 10 }}>
        Παρακαλώ συνδεθείτε για να δείτε τα ραντεβού σας.
      </Typography>
    );
  }

  if (loading) return <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}><CircularProgress /></Box>;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <ProfileLayout role="owner">
      <Typography variant="h5" sx={{ mb: 4, fontWeight: "bold", color: "#373721" }}>
        Τα ραντεβού μου
      </Typography>

      <Typography variant="h6" sx={{ mb: 2 }}>
        Προγραμματισμένα
      </Typography>
      {upcoming.length === 0 ? (
        <Typography color="text.secondary">
          Δεν υπάρχουν προγραμματισμένα ραντεβού.
        </Typography>
      ) : (
        upcoming.map(a => (
          <AppointmentCard key={a.id} appointment={a} />
        ))
      )}

      <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
        Ολοκληρωμένα
      </Typography>
      {completed.map(a => (
        <AppointmentCard key={a.id} appointment={a} />
      ))}

      <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
        Ακυρωμένα
      </Typography>
      {cancelled.map(a => (
        <AppointmentCard key={a.id} appointment={a} />
      ))}

    </ProfileLayout>
  );
};

export default OwnerAppointments;