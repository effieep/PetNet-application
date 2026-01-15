import { useEffect, useMemo, useState } from "react";
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
import PhoneIcon from "@mui/icons-material/Phone";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import CloseIcon from "@mui/icons-material/Close";
import { API_URL } from "../api";

const PAGE_SIZE = 12;

function normalizeText(value) {
    return String(value ?? "").trim().toLowerCase();
}

function parseDdMmYyyyToTs(dateStr, timeStr) {
    // Supports formats like "15-01-2026" and optional time "19:52".
    if (!dateStr) return 0;
    const parts = String(dateStr).split("-");
    if (parts.length !== 3) return 0;

    const day = Number(parts[0]);
    const month = Number(parts[1]);
    const year = Number(parts[2]);
    if (!Number.isFinite(day) || !Number.isFinite(month) || !Number.isFinite(year)) return 0;

    let hours = 0;
    let minutes = 0;
    if (timeStr) {
        const timeParts = String(timeStr).split(":");
        if (timeParts.length >= 2) {
            hours = Number(timeParts[0]) || 0;
            minutes = Number(timeParts[1]) || 0;
        }
    }

    const date = new Date(year, month - 1, day, hours, minutes, 0, 0);
    const ts = date.getTime();
    return Number.isFinite(ts) ? ts : 0;
}

function getSpeciesKeyFromGreekLabel(label) {
    const normalized = normalizeText(label);
    if (normalized.includes("σκύ")) return "dog";
    if (normalized.includes("γάτ") || normalized.includes("γατ")) return "cat";
    if (normalized.includes("κουν")) return "rabbit";
    if (normalized.includes("χάμ") || normalized.includes("χαμ")) return "hamster";
    return null;
}

function extractPhotoUrls(declaration) {
    const d = declaration || {};

    // FOUND declarations typically store photos under d.pet.photos.
    // Keep it defensive: accept either d.pet.photos or d.photos.
    const raw = d?.pet?.photos ?? d?.photos ?? [];
    if (!Array.isArray(raw)) return [];

    return raw
        .map((v) => (typeof v === "string" ? v.trim() : ""))
        .filter(Boolean);
}

function hasText(value) {
    return String(value ?? "").trim().length > 0;
}

function shortenAddress(fullAddress, partsToShow = 2) {
    const full = String(fullAddress ?? "").trim();
    if (!full) return { short: "", shortened: false };

    const parts = full
        .split(",")
        .map((p) => p.trim())
        .filter(Boolean);

    if (parts.length <= partsToShow) return { short: full, shortened: false };
    return { short: parts.slice(0, partsToShow).join(", "), shortened: true };
}

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
    const [activePhotoIndex, setActivePhotoIndex] = useState(0);
    const [showFullAddress, setShowFullAddress] = useState(false);

    const [loading, setLoading] = useState(false);
    const [loadError, setLoadError] = useState(null);
    const [declarations, setDeclarations] = useState([]);

    const heading = mode === "lost" ? "απώλειας" : "εύρεσης";

    useEffect(() => {
        const controller = new AbortController();
        const run = async () => {
            setLoading(true);
            setLoadError(null);

            try {
                // For now: only wire LOSS declarations as requested.
                const desiredType = mode === "lost" ? "LOSS" : "FOUND";
                const [declRes, petsRes, usersRes] = await Promise.all([
                    fetch(`${API_URL}/declarations?type=${encodeURIComponent(desiredType)}`, { signal: controller.signal }),
                    fetch(`${API_URL}/pets`, { signal: controller.signal }),
                    fetch(`${API_URL}/users`, { signal: controller.signal }),
                ]);

                if (!declRes.ok) throw new Error(`Failed to load declarations (${declRes.status})`);
                if (!petsRes.ok) throw new Error(`Failed to load pets (${petsRes.status})`);
                if (!usersRes.ok) throw new Error(`Failed to load users (${usersRes.status})`);

                const [declData, petsData, usersData] = await Promise.all([
                    declRes.json(),
                    petsRes.json(),
                    usersRes.json(),
                ]);

                const petsById = new Map((petsData || []).map((p) => [String(p.id), p]));
                const usersById = new Map((usersData || []).map((u) => [String(u.id), u]));

                const hydrated = (declData || []).map((d) => {
                    const declaration = d || {};
                    const pet = declaration.petId ? petsById.get(String(declaration.petId)) : null;
                    const owner = declaration.ownerId ? usersById.get(String(declaration.ownerId)) : null;

                    // Normalize a contact object so the UI has something consistent.
                    const altRaw = declaration.contact?.alt;
                    const alt =
                        altRaw && typeof altRaw === "object"
                            ? {
                                  name: altRaw?.name || "",
                                  phone: altRaw?.phone || "",
                                  email: altRaw?.email || "",
                              }
                            : null;

                    const contact = {
                        name:
                            declaration.contact?.name ||
                            [owner?.name, owner?.surname].filter(Boolean).join(" ") ||
                            owner?.name ||
                            "",
                        phone: declaration.contact?.phone || owner?.phone || "",
                        email: declaration.contact?.email || owner?.email || "",
                        ...(alt && (hasText(alt.name) || hasText(alt.phone) || hasText(alt.email)) ? { alt } : {}),
                    };

                    return {
                        ...declaration,
                        pet: pet || declaration.pet || null,
                        owner: owner || null,
                        contact,
                    };
                });

                setDeclarations(hydrated);
            } catch (err) {
                if (err?.name !== "AbortError") {
                    setLoadError(err?.message || "Failed to load data");
                    setDeclarations([]);
                }
            } finally {
                setLoading(false);
            }
        };

        run();
        return () => controller.abort();
    }, [mode]);

    // Reset to page 1 when filters / mode changes.
    useEffect(() => {
        setPage(1);
    }, [mode, microchipQuery, sort, species, sex, breed, areaQuery]);

    const breedOptions = useMemo(() => {
        const set = new Set();
        for (const d of declarations) {
            if (d?.type === "LOSS") {
                const b = d?.pet?.breed;
                if (b) set.add(String(b));
            }
        }
        return Array.from(set).sort((a, b) => a.localeCompare(b, "el"));
    }, [declarations]);

    const filteredSorted = useMemo(() => {
        const qMicro = normalizeText(microchipQuery);
        const qArea = normalizeText(areaQuery);

        const selectedSpeciesKeys = Object.entries(species)
            .filter(([, v]) => Boolean(v))
            .map(([k]) => k);

        const filterMale = Boolean(sex.male);
        const filterFemale = Boolean(sex.female);

        const list = (declarations || []).filter((d) => {
            // Only LOSS for now as requested.
            if (mode === "lost" && d?.type !== "LOSS") return false;

            const micro = normalizeText(d?.pet?.microchip || d?.microchip);
            if (qMicro && !micro.includes(qMicro)) return false;

            const address = normalizeText(d?.location?.address);
            if (qArea && !address.includes(qArea)) return false;

            if (breed) {
                const petBreed = normalizeText(d?.pet?.breed);
                if (petBreed !== normalizeText(breed)) return false;
            }

            if (selectedSpeciesKeys.length > 0) {
                const key = getSpeciesKeyFromGreekLabel(d?.petType || d?.pet?.species);
                if (!key || !selectedSpeciesKeys.includes(key)) return false;
            }

            if (filterMale || filterFemale) {
                const gender = normalizeText(d?.pet?.gender);
                const isMale = gender.includes("αρσ");
                const isFemale = gender.includes("θηλ");
                if (filterMale && !isMale && !filterFemale) return false;
                if (filterFemale && !isFemale && !filterMale) return false;
                if (filterMale && filterFemale) {
                    if (!isMale && !isFemale) return false;
                }
            }

            return true;
        });

        if (sort === "newest") {
            list.sort((a, b) => {
                const aTs = parseDdMmYyyyToTs(a?.createdAt, a?.createdTime);
                const bTs = parseDdMmYyyyToTs(b?.createdAt, b?.createdTime);
                return bTs - aTs;
            });
        }

        return list;
    }, [declarations, microchipQuery, areaQuery, species, sex, breed, sort, mode]);

    const totalAnnouncements = filteredSorted.length;
    const pageCount = Math.max(1, Math.ceil(totalAnnouncements / PAGE_SIZE));
    const cards = useMemo(() => {
        const start = (page - 1) * PAGE_SIZE;
        return filteredSorted.slice(start, start + PAGE_SIZE);
    }, [filteredSorted, page]);

    const selectedDeclaration = useMemo(() => {
        if (!selectedId) return null;
        return (declarations || []).find((d) => String(d.id) === String(selectedId)) || null;
    }, [declarations, selectedId]);

    const selectedPhotos = useMemo(() => extractPhotoUrls(selectedDeclaration), [selectedDeclaration]);
    const activePhotoUrl = useMemo(() => {
        if (!selectedPhotos || selectedPhotos.length === 0) return "";
        const idx = Math.min(Math.max(0, activePhotoIndex), selectedPhotos.length - 1);
        return selectedPhotos[idx] || "";
    }, [selectedPhotos, activePhotoIndex]);

    const altContact = selectedDeclaration?.contact?.alt || null;
    const hasAltContact = Boolean(
        altContact && (hasText(altContact?.name) || hasText(altContact?.phone) || hasText(altContact?.email))
    );

    const hasDescription = hasText(selectedDeclaration?.description);
    const hasLocationAddress = hasText(selectedDeclaration?.location?.address);
    const hasFoundOrLostDate = hasText(selectedDeclaration?.lostDate) || hasText(selectedDeclaration?.foundDate);
    const hasFoundOrLostTime = hasText(selectedDeclaration?.lostTime) || hasText(selectedDeclaration?.foundTime);

    const pet = selectedDeclaration?.pet || null;
    const hasPetType = hasText(selectedDeclaration?.petType) || hasText(pet?.species);
    const hasBreed = hasText(pet?.breed);
    const hasGender = hasText(pet?.gender);
    const hasColor = hasText(pet?.color);
    const hasSize = hasText(pet?.size) || hasText(pet?.weight);

    const hasContactName = hasText(selectedDeclaration?.contact?.name);
    const hasContactPhone = hasText(selectedDeclaration?.contact?.phone);
    const hasContactEmail = hasText(selectedDeclaration?.contact?.email);

    useEffect(() => {
        // When switching declarations, default to the first photo.
        setActivePhotoIndex(0);
        setShowFullAddress(false);
    }, [selectedId]);

    const openDetails = (id) => {
        setSelectedId(id);
        setActivePhotoIndex(0);
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

                {loadError && (
                    <Typography sx={{ textAlign: "center", color: "error.main", mb: 2, fontSize: 13 }}>
                        {loadError}
                    </Typography>
                )}

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
                                {breedOptions.map((b) => (
                                    <MenuItem key={b} value={b}>
                                        {b}
                                    </MenuItem>
                                ))}
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
                                (() => {
                                    const photos = extractPhotoUrls(card);
                                    const primaryPhoto = photos[0] || "";

                                    const regionText = card?.location?.region || card?.location?.address || "-";
                                    const phoneText = card?.contact?.phone || "-";

                                    const regionPreview = (() => {
                                        if (!hasText(regionText) || regionText === "-") return regionText;
                                        const { short, shortened } = shortenAddress(regionText, 2);
                                        return shortened ? `${short}…` : short;
                                    })();

                                    return (
                                <Box
                                    key={card.id}
                                    role="button"
                                    tabIndex={0}
                                    onClick={() => openDetails(card.id)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter" || e.key === " ") openDetails(card.id);
                                    }}
                                    sx={{
                                        borderRadius: 2.5,
                                        overflow: "hidden",
                                        cursor: "pointer",
                                        outline: "none",
                                        border: "1px solid rgba(0,0,0,0.12)",
                                        boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
                                        transition: "transform 160ms ease, box-shadow 160ms ease, filter 160ms ease",
                                        "&:hover": {
                                            filter: "brightness(0.99)",
                                            transform: "translateY(-2px)",
                                            boxShadow: "0 10px 26px rgba(0,0,0,0.12)",
                                        },
                                        "&:focus-visible": { outline: "2px solid rgba(0,0,0,0.35)", outlineOffset: 2 },
                                    }}
                                >
                                    <Box
                                        sx={{
                                            height: 185,
                                            backgroundColor: "#b7b487",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            px: 2,
                                        }}
                                    >
                                        {primaryPhoto ? (
                                            <Box
                                                component="img"
                                                src={primaryPhoto}
                                                alt="Φωτογραφία ζώου"
                                                sx={{
                                                    width: "100%",
                                                    height: "100%",
                                                    objectFit: "cover",
                                                    display: "block",
                                                }}
                                            />
                                        ) : (
                                            <Typography sx={{ fontSize: 12, fontWeight: 800, opacity: 0.9, textAlign: "center" }}>
                                                No photos attached
                                            </Typography>
                                        )}
                                    </Box>

                                    <Box
                                        sx={{
                                            background: "linear-gradient(180deg, #d8d5a1 0%, #c9c58c 100%)",
                                            px: 2,
                                            py: 1.5,
                                            display: "flex",
                                            flexDirection: "column",
                                            gap: 1,
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                display: "flex",
                                                alignItems: "flex-start",
                                                gap: 1,
                                                backgroundColor: "rgba(255,255,255,0.35)",
                                                border: "1px solid rgba(0,0,0,0.08)",
                                                borderRadius: 1.5,
                                                px: 1.25,
                                                py: 0.75,
                                            }}
                                        >
                                            <LocationOnIcon fontSize="small" sx={{ opacity: 0.8, mt: "2px" }} />
                                            <Typography sx={{ fontSize: 12, fontWeight: 800, lineHeight: 1.25, overflowWrap: "anywhere" }}>
                                                {regionPreview}
                                            </Typography>
                                        </Box>

                                        <Box
                                            sx={{
                                                display: "flex",
                                                alignItems: "flex-start",
                                                gap: 1,
                                                backgroundColor: "rgba(255,255,255,0.35)",
                                                border: "1px solid rgba(0,0,0,0.08)",
                                                borderRadius: 1.5,
                                                px: 1.25,
                                                py: 0.75,
                                            }}
                                        >
                                            <PhoneIcon fontSize="small" sx={{ opacity: 0.8, mt: "2px" }} />
                                            <Typography sx={{ fontSize: 12, fontWeight: 800, lineHeight: 1.25, overflowWrap: "anywhere" }}>
                                                {phoneText}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Box>
                                    );
                                })()
                            ))}
                        </Box>

                        {!loading && cards.length === 0 && !loadError && (
                            <Typography sx={{ mt: 3, textAlign: "center", opacity: 0.75 }}>
                                Δεν βρέθηκαν αποτελέσματα.
                            </Typography>
                        )}

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
                                count={pageCount}
                                page={Math.min(page, pageCount)}
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
                        height: "100dvh",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        px: { xs: 2, md: 3 },
                        py: { xs: 3, md: 4 },
                        overflowY: "auto",
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
                            maxHeight: { xs: "calc(100dvh - 64px)", md: "calc(100dvh - 96px)" },
                            overflowY: "auto",
                            overflowX: "hidden",
                        }}
                    >
                        <Box
                            sx={{
                                position: "sticky",
                                top: 0,
                                zIndex: 5,
                                pt: { xs: 0.25, md: 0.25 },
                                pb: { xs: 0.75, md: 0.75 },
                                mb: 1.75,
                                px: { xs: 0.5, md: 0.75 },
                                borderRadius: 2,
                                backgroundColor: "rgba(255,255,255,0.72)",
                                backdropFilter: "saturate(180%) blur(12px)",
                                WebkitBackdropFilter: "saturate(180%) blur(12px)",
                                border: "1px solid rgba(0,0,0,0.10)",
                                boxShadow: "0 8px 18px rgba(0,0,0,0.10)",
                            }}
                        >
                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    gap: 1,
                                }}
                            >
                                <IconButton
                                    onClick={closeDetails}
                                    sx={{
                                        border: "2px solid rgba(0,0,0,0.65)",
                                        backgroundColor: "#ffffff",
                                        "&:hover": { backgroundColor: "#ffffff", filter: "brightness(0.95)" },
                                        flex: "0 0 auto",
                                    }}
                                    aria-label="Close"
                                >
                                    <CloseIcon />
                                </IconButton>

                                <Typography
                                    sx={{
                                        fontWeight: 900,
                                        fontSize: { xs: 18, md: 22 },
                                        textAlign: "center",
                                        flex: "1 1 auto",
                                        px: 1,
                                        overflowWrap: "anywhere",
                                    }}
                                >
                                    Δήλωση {mode === "lost" ? "απώλειας" : "εύρεσης"}
                                </Typography>

                                <Box sx={{ width: 44, flex: "0 0 auto" }} />
                            </Box>

                            {mode === "found" && (
                                <Box
                                    sx={{
                                        mt: 1,
                                        display: "flex",
                                        flexWrap: "wrap",
                                        gap: 1,
                                        alignItems: "center",
                                        color: "rgba(0,0,0,0.75)",
                                    }}
                                >
                                    <Typography sx={{ fontSize: 12, fontWeight: 800, overflowWrap: "anywhere" }}>
                                        Δημιουργήθηκε: {selectedDeclaration?.createdAt ?? "-"}{selectedDeclaration?.createdTime ? `, ${selectedDeclaration.createdTime}` : ""}
                                    </Typography>
                                </Box>
                            )}
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
                                    {selectedPhotos.length > 0 ? (
                                        <Box
                                            component="img"
                                            src={activePhotoUrl}
                                            alt="Φωτογραφία ζώου"
                                            sx={{
                                                width: "100%",
                                                height: "100%",
                                                objectFit: "cover",
                                                display: "block",
                                            }}
                                        />
                                    ) : (
                                        <Typography sx={{ fontWeight: 800, fontSize: 12, textAlign: "center" }}>
                                            No photos attached
                                        </Typography>
                                    )}
                                </Box>

                                {selectedPhotos.length > 1 && (
                                    <Box
                                        sx={{
                                            display: "flex",
                                            gap: 1,
                                            overflowX: "auto",
                                            pb: 0.5,
                                            "&::-webkit-scrollbar": { height: 8 },
                                            "&::-webkit-scrollbar-thumb": { backgroundColor: "rgba(0,0,0,0.15)", borderRadius: 8 },
                                        }}
                                    >
                                        {selectedPhotos.map((url, idx) => (
                                            <Box
                                                key={`${url}-${idx}`}
                                                role="button"
                                                tabIndex={0}
                                                onClick={() => setActivePhotoIndex(idx)}
                                                onKeyDown={(e) => {
                                                    if (e.key === "Enter" || e.key === " ") setActivePhotoIndex(idx);
                                                }}
                                                sx={{
                                                    width: 72,
                                                    height: 54,
                                                    flex: "0 0 auto",
                                                    borderRadius: 1,
                                                    overflow: "hidden",
                                                    cursor: "pointer",
                                                    outline: "none",
                                                    border:
                                                        idx === activePhotoIndex
                                                            ? "2px solid rgba(0,0,0,0.75)"
                                                            : "2px solid rgba(0,0,0,0.15)",
                                                    "&:focus-visible": { outline: "2px solid rgba(0,0,0,0.35)", outlineOffset: 2 },
                                                }}
                                            >
                                                <Box
                                                    component="img"
                                                    src={url}
                                                    alt={`Φωτογραφία ${idx + 1}`}
                                                    sx={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                                                />
                                            </Box>
                                        ))}
                                    </Box>
                                )}

                                <Box
                                    sx={{
                                        border: "2px solid rgba(0,0,0,0.20)",
                                        borderRadius: 1.5,
                                        p: 2,
                                    }}
                                >
                                    <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2, mb: 2 }}>
                                        {hasFoundOrLostDate && (
                                        <Box>
                                            <Typography sx={{ fontSize: 12, fontWeight: 800, mb: 0.75 }}>
                                                Ημερομηνία {mode === "lost" ? "απώλειας" : "εύρεσης"}
                                            </Typography>
                                            <Box
                                                sx={{
                                                    minHeight: 34,
                                                    height: "auto",
                                                    borderRadius: 1.2,
                                                    backgroundColor: "#f1e9c9",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    px: 1.5,
                                                    py: 0.75,
                                                }}
                                            >
                                                <Typography sx={{ fontSize: 12, fontWeight: 800, opacity: 0.75, overflowWrap: "anywhere" }}>
                                                    {selectedDeclaration?.lostDate || selectedDeclaration?.foundDate || "-"}
                                                </Typography>
                                            </Box>
                                        </Box>
                                        )}
                                        {hasFoundOrLostTime && (
                                        <Box>
                                            <Typography sx={{ fontSize: 12, fontWeight: 800, mb: 0.75 }}>
                                                Ώρα
                                            </Typography>
                                            <Box
                                                sx={{
                                                    minHeight: 34,
                                                    height: "auto",
                                                    borderRadius: 1.2,
                                                    backgroundColor: "#f1e9c9",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    px: 1.5,
                                                    py: 0.75,
                                                }}
                                            >
                                                <Typography sx={{ fontSize: 12, fontWeight: 800, opacity: 0.75, overflowWrap: "anywhere" }}>
                                                    {selectedDeclaration?.lostTime || selectedDeclaration?.foundTime || "-"}
                                                </Typography>
                                            </Box>
                                        </Box>
                                        )}
                                    </Box>

                                    {hasLocationAddress && (
                                        <>
                                            <Typography sx={{ fontSize: 12, fontWeight: 800, mb: 0.75 }}>
                                                Περιοχή που {mode === "lost" ? "χάθηκε" : "βρέθηκε"}
                                            </Typography>
                                            <Box
                                                sx={{
                                                    minHeight: 34,
                                                    height: "auto",
                                                    borderRadius: 1.2,
                                                    backgroundColor: "#f1e9c9",
                                                    display: "flex",
                                                    alignItems: "flex-start",
                                                    gap: 1,
                                                    px: 1.5,
                                                    py: 0.75,
                                                    mb: 2,
                                                }}
                                            >
                                                <LocationOnIcon fontSize="small" sx={{ opacity: 0.75, mt: "2px" }} />
                                                {(() => {
                                                    const fullAddress = String(selectedDeclaration?.location?.address ?? "").trim();
                                                    const fallback = "Άγνωστη τοποθεσία";
                                                    const { short, shortened } = shortenAddress(fullAddress, 2);
                                                    const display = fullAddress
                                                        ? showFullAddress
                                                            ? fullAddress
                                                            : shortened
                                                                ? `${short}…`
                                                                : short
                                                        : fallback;

                                                    return (
                                                        <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 1, width: "100%" }}>
                                                            <Typography sx={{ fontSize: 12, fontWeight: 700, opacity: 0.75, overflowWrap: "anywhere" }}>
                                                                {display}
                                                            </Typography>

                                                            {fullAddress && shortened && (
                                                                <IconButton
                                                                    size="small"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        setShowFullAddress((v) => !v);
                                                                    }}
                                                                    aria-label={showFullAddress ? "Show less address" : "Show full address"}
                                                                    sx={{
                                                                        mt: "-4px",
                                                                        opacity: 0.8,
                                                                        flex: "0 0 auto",
                                                                        border: "1px solid rgba(0,0,0,0.15)",
                                                                        backgroundColor: "rgba(255,255,255,0.35)",
                                                                        "&:hover": { backgroundColor: "rgba(255,255,255,0.55)" },
                                                                    }}
                                                                >
                                                                    <MoreHorizIcon fontSize="small" />
                                                                </IconButton>
                                                            )}
                                                        </Box>
                                                    );
                                                })()}
                                            </Box>
                                        </>
                                    )}

                                    {mode === "found" && (Number.isFinite(selectedDeclaration?.location?.lat) || Number.isFinite(selectedDeclaration?.location?.lon)) && (
                                        <Typography sx={{ fontSize: 11, fontWeight: 700, opacity: 0.7, mb: 2, overflowWrap: "anywhere" }}>
                                            Συντεταγμένες: {Number.isFinite(selectedDeclaration?.location?.lat) ? selectedDeclaration.location.lat : "-"},{" "}
                                            {Number.isFinite(selectedDeclaration?.location?.lon) ? selectedDeclaration.location.lon : "-"}
                                        </Typography>
                                    )}

                                    {hasDescription && (
                                        <>
                                            <Typography sx={{ fontSize: 12, fontWeight: 800, mb: 0.75 }}>
                                                Επιπλέον πληροφορίες
                                            </Typography>
                                            <Box
                                                sx={{
                                                    minHeight: 64,
                                                    borderRadius: 1.2,
                                                    backgroundColor: "#f1e9c9",
                                                    px: 1.5,
                                                    py: 1,
                                                }}
                                            >
                                                <Typography
                                                    sx={{
                                                        fontSize: 12,
                                                        fontWeight: 700,
                                                        opacity: 0.75,
                                                        whiteSpace: "pre-wrap",
                                                        overflowWrap: "anywhere",
                                                        wordBreak: "break-word",
                                                    }}
                                                >
                                                    {selectedDeclaration?.description}
                                                </Typography>
                                            </Box>
                                        </>
                                    )}
                                </Box>
                            </Box>

                            {/* Right column */}
                            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                                <Box>
                                    <Typography sx={{ fontWeight: 900, fontSize: 16, mb: 1 }}>
                                        Στοιχεία κατοικιδίου
                                    </Typography>

                                    {mode === "found" && hasPetType && (
                                        <>
                                            <Typography sx={{ fontSize: 12, fontWeight: 800, mb: 0.75 }}>
                                                Τύπος ζώου
                                            </Typography>
                                            <Box
                                                sx={{
                                                    minHeight: 34,
                                                    height: "auto",
                                                    borderRadius: 1.2,
                                                    backgroundColor: "#f1e9c9",
                                                    mb: 1.5,
                                                    display: "flex",
                                                    alignItems: "center",
                                                    px: 1.5,
                                                    py: 0.75,
                                                }}
                                            >
                                                <Typography sx={{ fontSize: 12, fontWeight: 800, opacity: 0.75, overflowWrap: "anywhere" }}>
                                                    {selectedDeclaration?.petType || pet?.species}
                                                </Typography>
                                            </Box>
                                        </>
                                    )}

                                    <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2, mb: 1.5 }}>
                                        {hasBreed && (
                                        <Box>
                                            <Typography sx={{ fontSize: 12, fontWeight: 800, mb: 0.75 }}>
                                                Φυλή
                                            </Typography>
                                            <Box
                                                sx={{
                                                    minHeight: 34,
                                                    height: "auto",
                                                    borderRadius: 1.2,
                                                    backgroundColor: "#fbf3d6",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    px: 1.5,
                                                    py: 0.75,
                                                }}
                                            >
                                                <Typography sx={{ fontSize: 12, fontWeight: 800, opacity: 0.75, overflowWrap: "anywhere" }}>
                                                    {pet?.breed}
                                                </Typography>
                                            </Box>
                                        </Box>
                                        )}
                                        {hasGender && (
                                        <Box>
                                            <Typography sx={{ fontSize: 12, fontWeight: 800, mb: 0.75 }}>
                                                Φύλο
                                            </Typography>
                                            <Box
                                                sx={{
                                                    minHeight: 34,
                                                    height: "auto",
                                                    borderRadius: 1.2,
                                                    backgroundColor: "#fbf3d6",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    px: 1.5,
                                                    py: 0.75,
                                                }}
                                            >
                                                <Typography sx={{ fontSize: 12, fontWeight: 800, opacity: 0.75, overflowWrap: "anywhere" }}>
                                                    {pet?.gender}
                                                </Typography>
                                            </Box>
                                        </Box>
                                        )}
                                    </Box>

                                    <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2, mb: 1.5 }}>
                                        {hasColor && (
                                        <Box>
                                            <Typography sx={{ fontSize: 12, fontWeight: 800, mb: 0.75 }}>
                                                Χρώμα
                                            </Typography>
                                            <Box
                                                sx={{
                                                    minHeight: 34,
                                                    height: "auto",
                                                    borderRadius: 1.2,
                                                    backgroundColor: "#fbf3d6",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    px: 1.5,
                                                    py: 0.75,
                                                }}
                                            >
                                                <Typography sx={{ fontSize: 12, fontWeight: 800, opacity: 0.75, overflowWrap: "anywhere" }}>
                                                    {pet?.color}
                                                </Typography>
                                            </Box>
                                        </Box>
                                        )}
                                        {hasSize && (
                                        <Box>
                                            <Typography sx={{ fontSize: 12, fontWeight: 800, mb: 0.75 }}>
                                                Μέγεθος
                                            </Typography>
                                            <Box
                                                sx={{
                                                    minHeight: 34,
                                                    height: "auto",
                                                    borderRadius: 1.2,
                                                    backgroundColor: "#fbf3d6",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    px: 1.5,
                                                    py: 0.75,
                                                }}
                                            >
                                                <Typography sx={{ fontSize: 12, fontWeight: 800, opacity: 0.75, overflowWrap: "anywhere" }}>
                                                    {pet?.size || pet?.weight}
                                                </Typography>
                                            </Box>
                                        </Box>
                                        )}
                                    </Box>
                                </Box>

                                <Box>
                                    <Typography sx={{ fontWeight: 900, fontSize: 16, mb: 1 }}>
                                        Στοιχεία επικοινωνίας
                                    </Typography>

                                    {hasContactName && (
                                        <>
                                            <Typography sx={{ fontSize: 12, fontWeight: 800, mb: 0.75 }}>
                                                Όνομα
                                            </Typography>
                                            <Box
                                                sx={{
                                                    minHeight: 34,
                                                    height: "auto",
                                                    borderRadius: 1.2,
                                                    backgroundColor: "#eef0d2",
                                                    mb: 1.5,
                                                    display: "flex",
                                                    alignItems: "center",
                                                    px: 1.5,
                                                    py: 0.75,
                                                }}
                                            >
                                                <Typography sx={{ fontSize: 12, fontWeight: 800, opacity: 0.75, overflowWrap: "anywhere" }}>
                                                    {selectedDeclaration?.contact?.name}
                                                </Typography>
                                            </Box>
                                        </>
                                    )}

                                    {hasContactPhone && (
                                        <>
                                            <Typography sx={{ fontSize: 12, fontWeight: 800, mb: 0.75 }}>
                                                Τηλέφωνο
                                            </Typography>
                                            <Box
                                                sx={{
                                                    minHeight: 34,
                                                    height: "auto",
                                                    borderRadius: 1.2,
                                                    backgroundColor: "#eef0d2",
                                                    mb: 1.5,
                                                    display: "flex",
                                                    alignItems: "center",
                                                    px: 1.5,
                                                    py: 0.75,
                                                }}
                                            >
                                                <Typography sx={{ fontSize: 12, fontWeight: 800, opacity: 0.75, overflowWrap: "anywhere" }}>
                                                    {selectedDeclaration?.contact?.phone}
                                                </Typography>
                                            </Box>
                                        </>
                                    )}

                                    {hasContactEmail && (
                                        <>
                                            <Typography sx={{ fontSize: 12, fontWeight: 800, mb: 0.75 }}>
                                                Email
                                            </Typography>
                                            <Box
                                                sx={{
                                                    minHeight: 34,
                                                    height: "auto",
                                                    borderRadius: 1.2,
                                                    backgroundColor: "#eef0d2",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    px: 1.5,
                                                    py: 0.75,
                                                }}
                                            >
                                                <Typography sx={{ fontSize: 12, fontWeight: 800, opacity: 0.75, overflowWrap: "anywhere" }}>
                                                    {selectedDeclaration?.contact?.email}
                                                </Typography>
                                            </Box>
                                        </>
                                    )}

                                    {mode === "found" && hasAltContact && (
                                        <>
                                            <Typography sx={{ fontWeight: 900, fontSize: 14, mt: 2, mb: 1 }}>
                                                Εναλλακτική επικοινωνία
                                            </Typography>

                                            {hasText(altContact?.name) && (
                                                <>
                                                    <Typography sx={{ fontSize: 12, fontWeight: 800, mb: 0.75 }}>
                                                        Όνομα
                                                    </Typography>
                                                    <Box
                                                        sx={{
                                                            minHeight: 34,
                                                            height: "auto",
                                                            borderRadius: 1.2,
                                                            backgroundColor: "#eef0d2",
                                                            mb: 1.5,
                                                            display: "flex",
                                                            alignItems: "center",
                                                            px: 1.5,
                                                            py: 0.75,
                                                        }}
                                                    >
                                                        <Typography sx={{ fontSize: 12, fontWeight: 800, opacity: 0.75, overflowWrap: "anywhere" }}>
                                                            {altContact?.name}
                                                        </Typography>
                                                    </Box>
                                                </>
                                            )}

                                            {hasText(altContact?.phone) && (
                                                <>
                                                    <Typography sx={{ fontSize: 12, fontWeight: 800, mb: 0.75 }}>
                                                        Τηλέφωνο
                                                    </Typography>
                                                    <Box
                                                        sx={{
                                                            minHeight: 34,
                                                            height: "auto",
                                                            borderRadius: 1.2,
                                                            backgroundColor: "#eef0d2",
                                                            mb: 1.5,
                                                            display: "flex",
                                                            alignItems: "center",
                                                            px: 1.5,
                                                            py: 0.75,
                                                        }}
                                                    >
                                                        <Typography sx={{ fontSize: 12, fontWeight: 800, opacity: 0.75, overflowWrap: "anywhere" }}>
                                                            {altContact?.phone}
                                                        </Typography>
                                                    </Box>
                                                </>
                                            )}

                                            {hasText(altContact?.email) && (
                                                <>
                                                    <Typography sx={{ fontSize: 12, fontWeight: 800, mb: 0.75 }}>
                                                        Email
                                                    </Typography>
                                                    <Box
                                                        sx={{
                                                            minHeight: 34,
                                                            height: "auto",
                                                            borderRadius: 1.2,
                                                            backgroundColor: "#eef0d2",
                                                            display: "flex",
                                                            alignItems: "center",
                                                            px: 1.5,
                                                            py: 0.75,
                                                        }}
                                                    >
                                                        <Typography sx={{ fontSize: 12, fontWeight: 800, opacity: 0.75, overflowWrap: "anywhere" }}>
                                                            {altContact?.email}
                                                        </Typography>
                                                    </Box>
                                                </>
                                            )}
                                        </>
                                    )}
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </Modal>
        </Box>
    );
}
