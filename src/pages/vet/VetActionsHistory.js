import ProfileLayout from "../../components/profileLayout";
import { useState, useEffect } from "react";
import { useAuth } from "../../auth/AuthContext";
import { Box, Typography, CircularProgress, Alert, Card, CardContent, Chip, Divider, Stack, Collapse, IconButton } from "@mui/material";
import { Vaccines, BugReport, Biotech, ContentCut, Medication, Event, CalendarMonth, Pets, ExpandMore, ExpandLess } from "@mui/icons-material";
import { API_URL } from "../../api";

const VetActionsHistory = () => {
    const { isLoggedIn, user } = useAuth();
    const [vaccinations, setVaccinations] = useState([]);
    const [dewormings, setDewormings] = useState([]);
    const [lifeEvents, setLifeEvents] = useState([]);
    const [tests, setTests] = useState([]);
    const [surgeries, setSurgeries] = useState([]);
    const [medications, setMedications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [owners, setOwners] = useState([]);

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                const response = await fetch(`${API_URL}/pets`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const petsData = await response.json();

                const vaccinationsByVet = petsData.flatMap(pet => 
                    (pet.health?.history?.vaccinations || [])
                    .filter(v => v.vetId === user.id)
                    .map(v => ({ ...v, petName: pet.name, microchip: pet.microchip }))
                );

                const dewormingsByVet = petsData.flatMap(pet => 
                    (pet.health?.history?.deworming || [])
                    .filter(d => d.vetId === user.id)
                    .map(d => ({ ...d, petName: pet.name, microchip: pet.microchip }))
                );

                const lifeEventsByVet = petsData.flatMap(pet => 
                    (pet.health?.history?.lifeEvents || [])
                    .filter(le => le.vetId === user.id)
                    .map(le => ({ ...le, petName: pet.name, microchip: pet.microchip }))
                );

                const testsByVet = petsData.flatMap(pet => 
                    (pet.health?.history?.medicalActs?.tests || [])
                    .filter(t => t.vetId === user.id)
                    .map(t => ({ ...t, petName: pet.name, microchip: pet.microchip }))
                );

                const surgeriesByVet = petsData.flatMap(pet => 
                    (pet.health?.history?.medicalActs?.surgeries || [])
                    .filter(s => s.vetId === user.id)
                    .map(s => ({ ...s, petName: pet.name, microchip: pet.microchip }))
                );

                const medicationsByVet = petsData.flatMap(pet => 
                    (pet.health?.history?.medicalActs?.medication || [])
                    .filter(m => m.vetId === user.id)
                    .map(m => ({ ...m, petName: pet.name, microchip: pet.microchip }))
                );

                setVaccinations(vaccinationsByVet);
                setDewormings(dewormingsByVet);
                setLifeEvents(lifeEventsByVet);
                setTests(testsByVet);
                setSurgeries(surgeriesByVet);
                setMedications(medicationsByVet);
                setLoading(false);

            } catch (err) {
                setError('Failed to fetch data. Please try again later.');
                setLoading(false);
            }
        };

        if (user) {
            fetchAllData();
        }

        const fetchOwners = async () => {
            try {
                const response = await fetch(`${API_URL}/users?role=owner`);
                const data = await response.json();
                setOwners(data);
            } catch (error) {
                console.error('Error fetching owners:', error);
            }
        };
        fetchOwners();
    }, [user]);

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        const parts = dateString.split('-');
        if (parts.length === 3) {
            const [day, month, year] = parts;
            const date = new Date(year, month - 1, day);
            return date.toLocaleDateString('el-GR');
        }
        return dateString;
    };

    const ItemCard = ({ date, title, petName, microchip, details, subDetails }) => (
        <Box sx={{ p: 2, mb: 1.5, borderRadius: 2, bgcolor: '#F8F9FA', borderLeft: '4px solid #ddd', width: '100%', boxSizing: 'border-box' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 0.5, flexWrap: 'wrap' }}>
                <Typography variant="subtitle1" fontWeight="bold" sx={{ mr: 1 }}>{title}</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.secondary' }}>
                    <CalendarMonth sx={{ fontSize: 14 }} />
                    <Typography variant="caption" fontWeight="bold">
                        {formatDate(date)}
                    </Typography>
                </Box>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
                <Pets sx={{ fontSize: 16, color: '#666' }} />
                <Typography variant="body2" fontWeight="600" color="#444">
                    {petName} {microchip ? `- ${microchip}` : ''}
                </Typography>
            </Box>

            {details && <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>{details}</Typography>}
            {subDetails}
        </Box>
    );

    const CategorySection = ({ icon, title, color, items, renderItem }) => {
        const [open, setOpen] = useState(false);

        return (
            <Card sx={{ width: '100%', borderRadius: 3, boxShadow: 2, overflow: 'hidden' }}>
                <Box 
                    onClick={() => setOpen(!open)}
                    sx={{ 
                        p: 2, 
                        display: 'flex', 
                        alignItems: 'center', 
                        cursor: 'pointer',
                        bgcolor: open ? 'transparent' : '#fcfcfc',
                        transition: 'background-color 0.2s',
                        '&:hover': { bgcolor: '#f5f5f5' }
                    }}
                >
                    <Box sx={{ p: 1, borderRadius: '50%', bgcolor: `${color}15`, color: color, display: 'flex', mr: 2 }}>
                        {icon}
                    </Box>
                    <Typography variant="h6" fontWeight="bold" color="text.primary" sx={{ flexGrow: 1 }}>
                        {title}
                    </Typography>
                    <IconButton size="small">
                        {open ? <ExpandLess /> : <ExpandMore />}
                    </IconButton>
                </Box>
                
                <Collapse in={open} timeout="auto" unmountOnExit>
                    <Divider />
                    <CardContent>
                        {items.length === 0 ? (
                            <Typography variant="body2" color="text.secondary">Δεν υπάρχουν καταχωρήσεις.</Typography>
                        ) : (
                            <Box sx={{ maxHeight: '400px', overflowY: 'auto', pr: 1 }}>
                                {items.map((item, index) => renderItem(item, index))}
                            </Box>
                        )}
                    </CardContent>
                </Collapse>
            </Card>
        );
    };

    if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress /></Box>;
    if (error) return <Alert severity="error">{error}</Alert>;

    return (
        (isLoggedIn && user?.role === "vet") ? (
            <ProfileLayout role={user?.role || "vet"}>
                <Box sx={{ mb: 4, width: '100%', maxWidth: '100%' }}>
                    <Typography variant="h5" sx={{ mb: 4, fontWeight: "bold", color: "#373721" }}>
                      Ιστορικό Ενεργειών Κτηνιάτρου
                    </Typography>

                    <Stack spacing={3} sx={{ width: '100%' }}>
                        
                        <CategorySection 
                            icon={<Vaccines />} 
                            title="Εμβολιασμοί" 
                            color="#2E7D32" 
                            items={vaccinations}
                            renderItem={(v, i) => (
                                <ItemCard 
                                    key={i}
                                    date={v.date}
                                    title={v.name}
                                    petName={v.petName}
                                    microchip={v.microchip}
                                    subDetails={v.sode && <Chip label={`Sode: ${v.sode}`} size="small" color="success" variant="outlined" />}
                                />
                            )}
                        />

                        <CategorySection 
                            icon={<BugReport />} 
                            title="Αποπαρασιτώσεις" 
                            color="#ED6C02" 
                            items={dewormings}
                            renderItem={(d, i) => (
                                <ItemCard 
                                    key={i}
                                    date={d.date}
                                    title={d.product}
                                    petName={d.petName}
                                    microchip={d.microchip}
                                    subDetails={<Chip label={d.type} size="small" color="warning" variant="outlined" />}
                                />
                            )}
                        />

                        <CategorySection 
                            icon={<Biotech />} 
                            title="Εξετάσεις" 
                            color="#7B1FA2" 
                            items={tests}
                            renderItem={(t, i) => (
                                <ItemCard 
                                    key={i}
                                    date={t.date}
                                    title={t.title}
                                    petName={t.petName}
                                    microchip={t.microchip}
                                    subDetails={t.result && <Typography variant="body2"><strong>Αποτέλεσμα:</strong> {t.result}</Typography>}
                                />
                            )}
                        />

                        <CategorySection 
                            icon={<ContentCut />} 
                            title="Χειρουργεία" 
                            color="#D32F2F" 
                            items={surgeries}
                            renderItem={(s, i) => (
                                <ItemCard 
                                    key={i}
                                    date={s.date}
                                    title={s.title}
                                    petName={s.petName}
                                    microchip={s.microchip}
                                    details={s.notes ? `Σημειώσεις: ${s.notes}` : null}
                                />
                            )}
                        />

                        <CategorySection 
                            icon={<Medication />} 
                            title="Φαρμακευτική Αγωγή" 
                            color="#1976D2" 
                            items={medications}
                            renderItem={(m, i) => (
                                <ItemCard 
                                    key={i}
                                    date={m.startDate}
                                    title={m.name}
                                    petName={m.petName}
                                    microchip={m.microchip}
                                    details={m.instructions ? `Οδηγίες: ${m.instructions}` : null}
                                />
                            )}
                        />

                        <CategorySection 
                            icon={<Event />} 
                            title="Γεγονότα Ζωής" 
                            color="#0288D1" 
                            items={lifeEvents}
                            renderItem={(ev, i) => {
                                let detailsText = "";
                                if(ev.type === 'death') detailsText = `Αιτία: ${ev.reason}`;
                                if(ev.type === 'foster') detailsText = `Διάρκεια: ${ev.duration} ημέρες | Λόγος: ${ev.reason}`;
                                if(ev.type === 'transfer') detailsText = 'Προηγούμενος Ιδιοκτήτης: ' +  (owners.find(o => o.id === ev.previousOwnerId) ? `${owners.find(o => o.id === ev.previousOwnerId).name} ${owners.find(o => o.id === ev.previousOwnerId).surname}` : 'Άγνωστος Ιδιοκτήτης') + ' | Νέος Ιδιοκτήτης: ' + (owners.find(o => o.id === ev.newOwnerId) ? `${owners.find(o => o.id === ev.newOwnerId).name} ${owners.find(o => o.id === ev.newOwnerId).surname}` : 'Άγνωστος Ιδιοκτήτης');
                                if(ev.type === 'adoption') detailsText = 'Φορέας Υιοθεσίας: ' + ev.previousOwnerId.slice(6) + ' | Νέος Ιδιοκτήτης: ' + (owners.find(o => o.id === ev.newOwnerId) ? `${owners.find(o => o.id === ev.newOwnerId).name} ${owners.find(o => o.id === ev.newOwnerId).surname}` : 'Άγνωστος Ιδιοκτήτης');
                                
                                return (
                                    <ItemCard 
                                        key={i}
                                        date={ev.date}
                                        title={ev.type === 'transfer' ? 'Μεταβίβαση' : ev.type === 'foster' ? 'Αναδοχή' : ev.type === 'adoption' ? 'Υιοθεσία' : ev.type === 'death' ? 'Θάνατος' : 'Γεγονός' }
                                        petName={ev.petName}
                                        microchip={ev.microchip}
                                        details={detailsText}
                                    />
                                );
                            }}
                        />

                    </Stack>
                </Box>
            </ProfileLayout>
        ) : (
            <Typography variant="h6" color="error" textAlign="center" sx={{ mt: 10 }}>
                Παρακαλώ συνδεθείτε ως Κτηνίατρος για να δείτε το ιστορικό ενεργειών σας.
            </Typography>
        )
    );
};

export default VetActionsHistory;