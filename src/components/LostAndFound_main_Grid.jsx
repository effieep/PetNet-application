import { useMemo, useState } from "react";
import {
    Backdrop,
    Box,
    Button,
    Checkbox,
    FormControl,
    FormControlLabel,
    FormGroup,
    IconButton,
    InputAdornment,
    MenuItem,
    Modal,
    Pagination,
    Select,
    TextField,
    Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CloseIcon from "@mui/icons-material/Close";

export default function LostAndFoundMainGrid({ mode }) {
    const [page, setPage] = useState(1);
    const [microchipQuery, setMicrochipQuery] = useState("");
    const [sort, setSort] = useState("newest");
    const [species, setSpecies] = useState({
        dog: false,
        cat: false,
        rabbit: false,
        hamster: false,
    });
    const [sex, setSex] = useState({ male: false, female: false });
    const [breed, setBreed] = useState("");
    const [areaQuery, setAreaQuery] = useState("");

    const [detailsOpen, setDetailsOpen] = useState(false);
    const [selectedId, setSelectedId] = useState(null);

    const heading = mode === "lost" ? "απώλειας" : "εύρεσης";
    const totalAnnouncements = 219;

    const cards = useMemo(() => {
        return Array.from({ length: 12 }, (_, index) => ({
            id: `${mode}-${page}-${index}`,
            area: "Θεσσαλονίκη",
            phone: "6912345689",
        }));
    }, [mode, page]);

    const openDetails = (id) => {
        setSelectedId(id);
        setDetailsOpen(true);
    };

    const closeDetails = () => {
        setDetailsOpen(false);
        setSelectedId(null);
    };

    return (
        <Box
            sx={{
                // backgroundColor: "#efe092",
                px: { xs: 2.5, md: 3 },
                pb: { xs: 4, md: 3 },
            }}
        >
            <Box sx={{ maxWidth: 1200, mx: "auto" }}>
                <Typography
                    sx={{
                        textAlign: "center",
                        fontWeight: 700,
                        fontSize: { xs: 16, md: 18 },
                        mb: 2,
                    }}
                >
                    Βρέθηκαν {totalAnnouncements} ανακοινώσεις {heading} ζώων
                </Typography>

                <Box
                    sx={{
                        display: "flex",
                        gap: 3,
                        alignItems: "flex-start",
                        flexDirection: { xs: "column", md: "row" },
                    }}
                >
                    {/* Left Filters */}
                    <Box
                        sx={{
                            width: { xs: "100%", md: 280 },
                            backgroundColor: "#e8c173",
                            borderRadius: 2,
                            p: 2,
                            boxShadow: "0 4px 15px rgba(0,0,0,0.06)",
                        }}
                    >
                        <TextField
                            value={microchipQuery}
                            onChange={(e) => setMicrochipQuery(e.target.value)}
                            placeholder="Αριθμός Microchip"
                            size="small"
                            fullWidth
                            sx={{ mb: 1.5, backgroundColor: "rgba(255,255,255,0.55)", borderRadius: 1 }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon fontSize="small" />
                                    </InputAdornment>
                                ),
                            }}
                        />

                        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                            <FormControl size="small" fullWidth>
                                <Select value={sort} onChange={(e) => setSort(e.target.value)}>
                                    <MenuItem value="newest">Νεότερες Αναρτήσεις</MenuItem>
                                </Select>
                            </FormControl>
                            <IconButton size="small" sx={{ backgroundColor: "rgba(255,255,255,0.35)" }}>
                                <FilterAltIcon fontSize="small" />
                            </IconButton>
                        </Box>

                        <Typography sx={{ fontWeight: 800, mb: 1 }}>Είδος Ζώου</Typography>
                        <FormGroup sx={{ mb: 2 }}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={species.dog}
                                        onChange={(e) => setSpecies((s) => ({ ...s, dog: e.target.checked }))}
                                        size="small"
                                    />
                                }
                                label="Σκύλος"
                            />
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={species.cat}
                                        onChange={(e) => setSpecies((s) => ({ ...s, cat: e.target.checked }))}
                                        size="small"
                                    />
                                }
                                label="Γάτα"
                            />
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={species.rabbit}
                                        onChange={(e) => setSpecies((s) => ({ ...s, rabbit: e.target.checked }))}
                                        size="small"
                                    />
                                }
                                label="Κουνέλι"
                            />
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={species.hamster}
                                        onChange={(e) => setSpecies((s) => ({ ...s, hamster: e.target.checked }))}
                                        size="small"
                                    />
                                }
                                label="Χάμστερ"
                            />
                        </FormGroup>

                        <Typography sx={{ fontWeight: 800, mb: 1 }}>Φυλή Ζώου</Typography>
                        <FormControl size="small" fullWidth sx={{ mb: 2 }}>
                            <Select value={breed} onChange={(e) => setBreed(e.target.value)} displayEmpty>
                                <MenuItem value="">
                                    <em>Φυλή Ζώου</em>
                                </MenuItem>
                                <MenuItem value="breed1">Φυλή 1</MenuItem>
                                <MenuItem value="breed2">Φυλή 2</MenuItem>
                            </Select>
                        </FormControl>

                        <Typography sx={{ fontWeight: 800, mb: 1 }}>Φύλο Ζώου</Typography>
                        <FormGroup sx={{ mb: 2 }}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={sex.male}
                                        onChange={(e) => setSex((s) => ({ ...s, male: e.target.checked }))}
                                        size="small"
                                    />
                                }
                                label="Αρσενικό"
                            />
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={sex.female}
                                        onChange={(e) => setSex((s) => ({ ...s, female: e.target.checked }))}
                                        size="small"
                                    />
                                }
                                label="Θηλυκό"
                            />
                        </FormGroup>

                        <Typography sx={{ fontWeight: 800, mb: 1 }}>Περιοχή</Typography>
                        <TextField
                            value={areaQuery}
                            onChange={(e) => setAreaQuery(e.target.value)}
                            placeholder="π.χ. Διεύθυνση, Περιοχή, Πόλη"
                            size="small"
                            fullWidth
                            sx={{ mb: 1.5, backgroundColor: "rgba(255,255,255,0.55)", borderRadius: 1 }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon fontSize="small" />
                                    </InputAdornment>
                                ),
                            }}
                        />

                        <Button
                            fullWidth
                            variant="outlined"
                            startIcon={<LocationOnIcon />}
                            sx={{
                                mb: 2,
                                backgroundColor: "rgba(255,255,255,0.30)",
                                borderColor: "rgba(0,0,0,0.25)",
                                color: "#1a1a1a",
                                textTransform: "none",
                                fontWeight: 600,
                            }}
                        >
                            Χρήση τρέχουσας τοποθεσίας
                        </Button>

                        <Button
                            fullWidth
                            variant="contained"
                            startIcon={<SearchIcon />}
                            sx={{
                                backgroundColor: "#9bb8d3",
                                color: "#1a1a1a",
                                textTransform: "none",
                                borderRadius: 2,
                                fontWeight: 800,
                                py: 1.25,
                                boxShadow: "none",
                                "&:hover": { backgroundColor: "#9bb8d3", filter: "brightness(0.95)" },
                            }}
                        >
                            Αναζήτηση
                        </Button>

                    </Box>

                    {/* Right Results */}
                    <Box sx={{ flex: 1, width: "100%" }}>
                        <Box
                            sx={{
                                display: "grid",
                                gridTemplateColumns: {
                                    xs: "1fr",
                                    sm: "repeat(2, minmax(0, 1fr))",
                                    md: "repeat(3, minmax(0, 1fr))",
                                },
                                gap: 2.5,
                            }}
                        >
                            {cards.map((card) => (
                                <Box
                                    key={card.id}
                                    role="button"
                                    tabIndex={0}
                                    onClick={() => openDetails(card.id)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter" || e.key === " ") openDetails(card.id);
                                    }}
                                    sx={{
                                        borderRadius: 2,
                                        overflow: "hidden",
                                        cursor: "pointer",
                                        outline: "none",
                                        "&:hover": { filter: "brightness(0.98)" },
                                        "&:focus-visible": { outline: "2px solid rgba(0,0,0,0.35)", outlineOffset: 2 },
                                    }}
                                >
                                    <Box
                                        sx={{
                                            height: 170,
                                            backgroundColor: "#b7b487",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            px: 2,
                                        }}
                                    >
                                        <Typography sx={{ fontSize: 12, fontWeight: 800, opacity: 0.9 }}>
                                            Φωτογραφία ζώου που {mode === "lost" ? "χάθηκε" : "βρέθηκε"}
                                        </Typography>
                                    </Box>

                                    <Box
                                        sx={{
                                            backgroundColor: "#c9c58c",
                                            px: 1.5,
                                            py: 1,
                                            display: "flex",
                                            flexDirection: "column",
                                            gap: 0.25,
                                        }}
                                    >
                                        <Typography sx={{ fontSize: 11, fontWeight: 800 }}>
                                            Περιοχή : {card.area}
                                        </Typography>
                                        <Typography sx={{ fontSize: 11, fontWeight: 800 }}>
                                            Τηλ. Επικοινωνίας : {card.phone}
                                        </Typography>
                                    </Box>
                                </Box>
                            ))}
                        </Box>

                        <Box
                            sx={{
                                mt: 3,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                color: "rgba(0,0,0,0.70)",
                            }}
                        >
                            <Typography sx={{ fontSize: 12 }}>προηγούμενο</Typography>
                            <Pagination
                                count={19}
                                page={page}
                                onChange={(_, value) => setPage(value)}
                                size="small"
                            />
                            <Typography sx={{ fontSize: 12 }}>επόμενο</Typography>
                        </Box>
                    </Box>
                </Box>
            </Box>

            <Modal
                open={detailsOpen}
                onClose={closeDetails}
                closeAfterTransition
                slots={{ backdrop: Backdrop }}
                slotProps={{
                    backdrop: {
                        sx: {
                            backgroundColor: "rgba(0,0,0,0.35)",
                            backdropFilter: "blur(6px)",
                        },
                    },
                }}
            >
                <Box
                    sx={{
                        minHeight: "100vh",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        p: { xs: 2, md: 3 },
                    }}
                >
                    <Box
                        onClick={(e) => e.stopPropagation()}
                        sx={{
                            width: "100%",
                            maxWidth: 980,
                            backgroundColor: "#ffffff",
                            borderRadius: 2,
                            border: "2px solid rgba(0,0,0,0.65)",
                            boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
                            position: "relative",
                            p: { xs: 2, md: 3 },
                        }}
                    >
                        <IconButton
                            onClick={closeDetails}
                            sx={{
                                position: "absolute",
                                top: 10,
                                left: 10,
                                border: "2px solid rgba(0,0,0,0.65)",
                                backgroundColor: "#ffffff",
                                "&:hover": { backgroundColor: "#ffffff", filter: "brightness(0.95)" },
                            }}
                            aria-label="Close"
                        >
                            <CloseIcon />
                        </IconButton>

                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                px: { xs: 6, md: 7 },
                                mb: 2,
                            }}
                        >
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                <Typography sx={{ fontWeight: 900, fontSize: { xs: 20, md: 24 } }}>
                                    Δήλωση {mode === "lost" ? "απώλειας" : "εύρεσης"}
                                </Typography>
                            </Box>

                        </Box>

                        <Box
                            sx={{
                                display: "grid",
                                gridTemplateColumns: { xs: "1fr", md: "380px 1fr" },
                                gap: { xs: 2.5, md: 4 },
                                alignItems: "start",
                            }}
                        >
                            {/* Left column */}
                            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                                <Box
                                    sx={{
                                        height: 220,
                                        border: "2px solid rgba(0,0,0,0.65)",
                                        backgroundColor: "#f4f1e5",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        px: 2,
                                    }}
                                >
                                    <Typography sx={{ fontWeight: 800, fontSize: 12, textAlign: "center" }}>
                                        φωτογραφία του ζώου που {mode === "lost" ? "χάθηκε" : "βρέθηκε"}
                                    </Typography>
                                </Box>

                                <Box
                                    sx={{
                                        border: "2px solid rgba(0,0,0,0.20)",
                                        borderRadius: 1.5,
                                        p: 2,
                                    }}
                                >
                                    <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2, mb: 2 }}>
                                        <Box>
                                            <Typography sx={{ fontSize: 12, fontWeight: 800, mb: 0.75 }}>
                                                Ημερομηνία {mode === "lost" ? "απώλειας" : "εύρεσης"}
                                            </Typography>
                                            <Box sx={{ height: 34, borderRadius: 1.2, backgroundColor: "#f1e9c9" }} />
                                        </Box>
                                        <Box>
                                            <Typography sx={{ fontSize: 12, fontWeight: 800, mb: 0.75 }}>
                                                Ώρα
                                            </Typography>
                                            <Box sx={{ height: 34, borderRadius: 1.2, backgroundColor: "#f1e9c9" }} />
                                        </Box>
                                    </Box>

                                    <Typography sx={{ fontSize: 12, fontWeight: 800, mb: 0.75 }}>
                                        Περιοχή που {mode === "lost" ? "χάθηκε" : "βρέθηκε"}
                                    </Typography>
                                    <Box
                                        sx={{
                                            height: 34,
                                            borderRadius: 1.2,
                                            backgroundColor: "#f1e9c9",
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 1,
                                            px: 1.5,
                                            mb: 2,
                                        }}
                                    >
                                        <LocationOnIcon fontSize="small" sx={{ opacity: 0.75 }} />
                                        <Typography sx={{ fontSize: 12, fontWeight: 700, opacity: 0.75 }}>
                                            
                                        </Typography>
                                    </Box>

                                    <Typography sx={{ fontSize: 12, fontWeight: 800, mb: 0.75 }}>
                                        Επιπλέον πληροφορίες
                                    </Typography>
                                    <Box sx={{ height: 64, borderRadius: 1.2, backgroundColor: "#f1e9c9" }} />
                                </Box>
                            </Box>

                            {/* Right column */}
                            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                                <Box>
                                    <Typography sx={{ fontWeight: 900, fontSize: 16, mb: 1 }}>
                                        Στοιχεία κατοικιδίου
                                    </Typography>

                                    <Typography sx={{ fontSize: 12, fontWeight: 800, mb: 0.75 }}>
                                        Αρ. Microchip
                                    </Typography>
                                    <Box sx={{ height: 34, borderRadius: 1.2, backgroundColor: "#f1e9c9", mb: 1.5 }} />

                                    <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2, mb: 1.5 }}>
                                        <Box>
                                            <Typography sx={{ fontSize: 12, fontWeight: 800, mb: 0.75 }}>
                                                Φυλή
                                            </Typography>
                                            <Box sx={{ height: 34, borderRadius: 1.2, backgroundColor: "#fbf3d6" }} />
                                        </Box>
                                        <Box>
                                            <Typography sx={{ fontSize: 12, fontWeight: 800, mb: 0.75 }}>
                                                Φύλο
                                            </Typography>
                                            <Box sx={{ height: 34, borderRadius: 1.2, backgroundColor: "#fbf3d6" }} />
                                        </Box>
                                    </Box>

                                    <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2, mb: 1.5 }}>
                                        <Box>
                                            <Typography sx={{ fontSize: 12, fontWeight: 800, mb: 0.75 }}>
                                                Χρώμα
                                            </Typography>
                                            <Box sx={{ height: 34, borderRadius: 1.2, backgroundColor: "#fbf3d6" }} />
                                        </Box>
                                        <Box>
                                            <Typography sx={{ fontSize: 12, fontWeight: 800, mb: 0.75 }}>
                                                Μέγεθος
                                            </Typography>
                                            <Box sx={{ height: 34, borderRadius: 1.2, backgroundColor: "#fbf3d6" }} />
                                        </Box>
                                    </Box>

                                    <Typography sx={{ fontSize: 12, fontWeight: 800, mb: 0.75 }}>
                                        Ιδιαίτερα χαρακτηριστικά
                                    </Typography>
                                    <Box sx={{ height: 44, borderRadius: 1.2, backgroundColor: "#fbf3d6" }} />
                                </Box>

                                <Box>
                                    <Typography sx={{ fontWeight: 900, fontSize: 16, mb: 1 }}>
                                        Στοιχεία επικοινωνίας
                                    </Typography>

                                    <Typography sx={{ fontSize: 12, fontWeight: 800, mb: 0.75 }}>
                                        Όνομα ιδιοκτήτη
                                    </Typography>
                                    <Box sx={{ height: 34, borderRadius: 1.2, backgroundColor: "#eef0d2", mb: 1.5 }} />

                                    <Typography sx={{ fontSize: 12, fontWeight: 800, mb: 0.75 }}>
                                        Τηλέφωνο επικοινωνίας
                                    </Typography>
                                    <Box sx={{ height: 34, borderRadius: 1.2, backgroundColor: "#eef0d2", mb: 1.5 }} />

                                    <Typography sx={{ fontSize: 12, fontWeight: 800, mb: 0.75 }}>
                                        Email
                                    </Typography>
                                    <Box sx={{ height: 34, borderRadius: 1.2, backgroundColor: "#eef0d2" }} />
                                </Box>

                                {/* Placeholder so we can verify state is wired */}
                                <Typography sx={{ fontSize: 11, opacity: 0.5 }}>
                                    selected: {selectedId ?? ""}
                                </Typography>
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </Modal>
        </Box>
    );
}
