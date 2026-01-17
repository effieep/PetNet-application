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
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import KeyboardArrowUpRoundedIcon from "@mui/icons-material/KeyboardArrowUpRounded";
import { API_URL } from "../api";

const PAGE_SIZE = 12;
const DEFAULT_SEX = { male: false, female: false };
const DEFAULT_SORT = "newest";

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

function formatRelativeCreatedLabel(createdAt, createdTime) {
    const ts = parseDdMmYyyyToTs(createdAt, createdTime);
    if (!ts) return "";

    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();

    const created = new Date(ts);
    const createdStart = new Date(created.getFullYear(), created.getMonth(), created.getDate()).getTime();

    const diffMs = Math.max(0, todayStart - createdStart);
    const diffDays = Math.floor(diffMs / (24 * 60 * 60 * 1000));

    if (diffDays === 0) return "Σήμερα";
    if (diffDays === 1) return "Χθες";
    return `Πριν από ${diffDays} ημέρες`;
}

function getSpeciesLabelFromDeclaration(declaration) {
    const raw = declaration?.petType || declaration?.pet?.species || "";
    return String(raw ?? "").trim();
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
    const [sort, setSort] = useState(DEFAULT_SORT);
    const [speciesLabel, setSpeciesLabel] = useState("");
    const [sex, setSex] = useState(DEFAULT_SEX);
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
                    fetch(`${API_URL}/declarations?type=${encodeURIComponent(desiredType)}&status=SUBMITTED`, { signal: controller.signal }),
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
    }, [mode, microchipQuery, sort, speciesLabel, sex, breed, areaQuery]);

    const breedOptions = useMemo(() => {
        const set = new Set();
        for (const d of declarations) {
            const b = d?.pet?.breed;
            if (b) set.add(String(b));
        }
        return Array.from(set).sort((a, b) => a.localeCompare(b, "el"));
    }, [declarations]);

    const clearFilters = () => {
        setMicrochipQuery("");
        setSort(DEFAULT_SORT);
        setSpeciesLabel("");
        setSex({ ...DEFAULT_SEX });
        setBreed("");
        setAreaQuery("");
        setPage(1);
    };

    const filteredSorted = useMemo(() => {
        const qMicro = normalizeText(microchipQuery);
        const qArea = normalizeText(areaQuery);

        const getCreatedTs = (d) => parseDdMmYyyyToTs(d?.createdAt, d?.createdTime);
        const getEventTs = (d) => {
            const date = mode === "lost" ? d?.lostDate : d?.foundDate;
            const time = mode === "lost" ? d?.lostTime : d?.foundTime;
            return parseDdMmYyyyToTs(date, time);
        };

        const qSpecies = normalizeText(speciesLabel);

        const filterMale = Boolean(sex.male);
        const filterFemale = Boolean(sex.female);

        const list = (declarations || []).filter((d) => {
            if (mode === "lost" && d?.type !== "LOSS") return false;
            if (mode === "found" && d?.type !== "FOUND") return false;

            const micro = normalizeText(d?.pet?.microchip || d?.microchip);
            if (qMicro && !micro.includes(qMicro)) return false;

            const address = normalizeText(d?.location?.address);
            const region = normalizeText(d?.location?.region);
            const areaHaystack = `${region} ${address}`.trim();
            if (qArea && !areaHaystack.includes(qArea)) return false;

            if (breed) {
                const petBreed = normalizeText(d?.pet?.breed);
                if (petBreed !== normalizeText(breed)) return false;
            }

            if (qSpecies) {
                const label = normalizeText(getSpeciesLabelFromDeclaration(d));
                if (!label || label !== qSpecies) return false;
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
            list.sort((a, b) => getCreatedTs(b) - getCreatedTs(a));
        } else if (sort === "oldest") {
            list.sort((a, b) => getCreatedTs(a) - getCreatedTs(b));
        } else if (sort === "eventNewest") {
            list.sort((a, b) => getEventTs(b) - getEventTs(a));
        } else if (sort === "eventOldest") {
            list.sort((a, b) => getEventTs(a) - getEventTs(b));
        } else if (sort === "regionAZ") {
            list.sort((a, b) => {
                const aVal = String(a?.location?.region || a?.location?.address || "");
                const bVal = String(b?.location?.region || b?.location?.address || "");
                return aVal.localeCompare(bVal, "el");
            });
        } else if (sort === "regionZA") {
            list.sort((a, b) => {
                const aVal = String(a?.location?.region || a?.location?.address || "");
                const bVal = String(b?.location?.region || b?.location?.address || "");
                return bVal.localeCompare(aVal, "el");
            });
        }

        return list;
    }, [declarations, microchipQuery, areaQuery, speciesLabel, sex, breed, sort, mode]);

    const speciesCounts = useMemo(() => {
        const qMicro = normalizeText(microchipQuery);
        const qArea = normalizeText(areaQuery);

        const filterMale = Boolean(sex.male);
        const filterFemale = Boolean(sex.female);

        const map = new Map();

        for (const d of declarations || []) {
            if (mode === "lost" && d?.type !== "LOSS") continue;
            if (mode === "found" && d?.type !== "FOUND") continue;

            const micro = normalizeText(d?.pet?.microchip || d?.microchip);
            if (qMicro && !micro.includes(qMicro)) continue;

            const address = normalizeText(d?.location?.address);
            const region = normalizeText(d?.location?.region);
            const areaHaystack = `${region} ${address}`.trim();
            if (qArea && !areaHaystack.includes(qArea)) continue;

            if (breed) {
                const petBreed = normalizeText(d?.pet?.breed);
                if (petBreed !== normalizeText(breed)) continue;
            }

            if (filterMale || filterFemale) {
                const gender = normalizeText(d?.pet?.gender);
                const isMale = gender.includes("αρσ");
                const isFemale = gender.includes("θηλ");
                if (filterMale && !isMale && !filterFemale) continue;
                if (filterFemale && !isFemale && !filterMale) continue;
                if (filterMale && filterFemale) {
                    if (!isMale && !isFemale) continue;
                }
            }

            const label = getSpeciesLabelFromDeclaration(d);
            const norm = normalizeText(label);
            if (!norm) continue;

            const prev = map.get(norm);
            if (prev) {
                prev.count += 1;
            } else {
                map.set(norm, { label, count: 1 });
            }
        }

        return Array.from(map.values()).sort((a, b) => {
            if (b.count !== a.count) return b.count - a.count;
            return String(a.label).localeCompare(String(b.label), "el");
        });
    }, [declarations, microchipQuery, areaQuery, sex, breed, mode]);

    const totalInSpeciesBase = useMemo(() => {
        return (speciesCounts || []).reduce((acc, item) => acc + (Number(item.count) || 0), 0);
    }, [speciesCounts]);

    useEffect(() => {
        if (!speciesLabel) return;
        const wanted = normalizeText(speciesLabel);
        const exists = (speciesCounts || []).some((s) => normalizeText(s.label) === wanted);
        if (!exists) setSpeciesLabel("");
    }, [speciesCounts, speciesLabel]);

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

    const selectedPhotos = useMemo(() => {
      if(mode === "found") {
        return extractPhotoUrls(selectedDeclaration);
      } 
      else {
        return selectedDeclaration?.pet?.photoUrl ? [selectedDeclaration.pet.photoUrl] : [];
      }
    }, [selectedDeclaration, mode]);

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
                            backgroundColor: "rgba(232, 193, 115, 0.55)",
                            backgroundImage:
                                "linear-gradient(135deg, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.06) 45%, rgba(0,0,0,0.03) 100%)",
                            borderRadius: 3,
                            p: 2,
                            border: "1px solid rgba(255,255,255,0.55)",
                            backdropFilter: "saturate(160%) blur(10px)",
                            WebkitBackdropFilter: "saturate(160%) blur(10px)",
                            boxShadow: "0 14px 34px rgba(0,0,0,0.12)",
                        }}
                    >
                        <TextField
                            value={microchipQuery}
                            onChange={(e) => setMicrochipQuery(e.target.value)}
                            placeholder="Αριθμός Microchip"
                            size="small"
                            fullWidth
                            sx={{
                                mb: 1.5,
                                "& .MuiOutlinedInput-root": {
                                    borderRadius: 2,
                                    backgroundColor: "rgba(255,255,255,0.62)",
                                    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.6)",
                                    "& fieldset": { borderColor: "rgba(0,0,0,0.12)" },
                                    "&:hover fieldset": { borderColor: "rgba(0,0,0,0.20)" },
                                    "&.Mui-focused fieldset": { borderColor: "rgba(0,0,0,0.28)" },
                                },
                            }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon fontSize="small" />
                                    </InputAdornment>
                                ),
                            }}
                        />

                        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                            <FormControl
                                size="small"
                                fullWidth
                                sx={{
                                    "& .MuiOutlinedInput-root": {
                                        borderRadius: 2,
                                        backgroundColor: "rgba(255,255,255,0.62)",
                                        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.6)",
                                        "& fieldset": { borderColor: "rgba(0,0,0,0.12)" },
                                        "&:hover fieldset": { borderColor: "rgba(0,0,0,0.20)" },
                                        "&.Mui-focused fieldset": { borderColor: "rgba(0,0,0,0.28)" },
                                    },
                                }}
                            >
                                <Select value={sort} onChange={(e) => setSort(e.target.value)}>
                                    <MenuItem value="newest">Νεότερες Αναρτήσεις</MenuItem>
                                    <MenuItem value="oldest">Παλαιότερες Αναρτήσεις</MenuItem>
                                    <MenuItem value="eventNewest">
                                        {mode === "lost" ? "Πιο πρόσφατη απώλεια" : "Πιο πρόσφατη εύρεση"}
                                    </MenuItem>
                                    <MenuItem value="eventOldest">
                                        {mode === "lost" ? "Παλαιότερη απώλεια" : "Παλαιότερη εύρεση"}
                                    </MenuItem>
                                    <MenuItem value="regionAZ">Περιοχή (Α-Ω)</MenuItem>
                                    <MenuItem value="regionZA">Περιοχή (Ω-Α)</MenuItem>
                                </Select>
                            </FormControl>
                            <IconButton
                                size="small"
                                sx={{
                                    width: 36,
                                    height: 36,
                                    borderRadius: 999,
                                    border: "1px solid rgba(255,255,255,0.55)",
                                    backgroundColor: "rgba(255,255,255,0.45)",
                                    boxShadow: "0 8px 18px rgba(0,0,0,0.10)",
                                    backdropFilter: "saturate(160%) blur(10px)",
                                    WebkitBackdropFilter: "saturate(160%) blur(10px)",
                                    "&:hover": { backgroundColor: "rgba(255,255,255,0.60)" },
                                }}
                            >
                                <FilterAltIcon fontSize="small" />
                            </IconButton>
                        </Box>

                        <Button
                            fullWidth
                            variant="outlined"
                            onClick={clearFilters}
                            sx={{
                                mb: 2,
                                borderRadius: 999,
                                backgroundColor: "rgba(255,255,255,0.35)",
                                borderColor: "rgba(255,255,255,0.55)",
                                color: "rgba(0,0,0,0.75)",
                                textTransform: "none",
                                fontWeight: 800,
                                boxShadow: "0 10px 20px rgba(0,0,0,0.10)",
                                backdropFilter: "saturate(160%) blur(10px)",
                                WebkitBackdropFilter: "saturate(160%) blur(10px)",
                                "&:hover": { backgroundColor: "rgba(255,255,255,0.50)", borderColor: "rgba(255,255,255,0.70)" },
                            }}
                        >
                            Καθαρισμός φίλτρων
                        </Button>

                        <Typography sx={{ fontWeight: 900, mb: 1, letterSpacing: "-0.2px" }}>Είδος Ζώου</Typography>
                        <FormControl
                            size="small"
                            fullWidth
                            sx={{
                                mb: 2,
                                "& .MuiOutlinedInput-root": {
                                    borderRadius: 2,
                                    backgroundColor: "rgba(255,255,255,0.62)",
                                    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.6)",
                                    "& fieldset": { borderColor: "rgba(0,0,0,0.12)" },
                                    "&:hover fieldset": { borderColor: "rgba(0,0,0,0.20)" },
                                    "&.Mui-focused fieldset": { borderColor: "rgba(0,0,0,0.28)" },
                                },
                            }}
                        >
                            <Select
                                value={speciesLabel}
                                onChange={(e) => setSpeciesLabel(e.target.value)}
                                displayEmpty
                            >
                                <MenuItem value="">
                                    <em>Όλα τα είδη ({totalInSpeciesBase})</em>
                                </MenuItem>
                                {speciesCounts.map((s) => (
                                    <MenuItem key={normalizeText(s.label)} value={s.label}>
                                        {s.label} ({s.count})
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <Typography sx={{ fontWeight: 900, mb: 1, letterSpacing: "-0.2px" }}>Φυλή Ζώου</Typography>
                        <FormControl
                            size="small"
                            fullWidth
                            sx={{
                                mb: 2,
                                "& .MuiOutlinedInput-root": {
                                    borderRadius: 2,
                                    backgroundColor: "rgba(255,255,255,0.62)",
                                    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.6)",
                                    "& fieldset": { borderColor: "rgba(0,0,0,0.12)" },
                                    "&:hover fieldset": { borderColor: "rgba(0,0,0,0.20)" },
                                    "&.Mui-focused fieldset": { borderColor: "rgba(0,0,0,0.28)" },
                                },
                            }}
                        >
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

                        <Typography sx={{ fontWeight: 900, mb: 1, letterSpacing: "-0.2px" }}>Φύλο Ζώου</Typography>
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

                        <Typography sx={{ fontWeight: 900, mb: 1, letterSpacing: "-0.2px" }}>Περιοχή</Typography>
                        <TextField
                            value={areaQuery}
                            onChange={(e) => setAreaQuery(e.target.value)}
                            placeholder="π.χ. Διεύθυνση, Περιοχή, Πόλη"
                            size="small"
                            fullWidth
                            sx={{
                                mb: 1.5,
                                "& .MuiOutlinedInput-root": {
                                    borderRadius: 2,
                                    backgroundColor: "rgba(255,255,255,0.62)",
                                    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.6)",
                                    "& fieldset": { borderColor: "rgba(0,0,0,0.12)" },
                                    "&:hover fieldset": { borderColor: "rgba(0,0,0,0.20)" },
                                    "&.Mui-focused fieldset": { borderColor: "rgba(0,0,0,0.28)" },
                                },
                            }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon fontSize="small" />
                                    </InputAdornment>
                                ),
                            }}
                        />
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
                                    const photos = heading === "εύρεσης" ? extractPhotoUrls(card) : (card?.pet?.photoUrl ? [card.pet.photoUrl] : []);
                                    const primaryPhoto = photos[0] || "";

                                    const regionText = card?.location?.region || card?.location?.address || "-";
                                    const phoneText = card?.contact?.phone || "-";

                                    const regionPreview = (() => {
                                        if (!hasText(regionText) || regionText === "-") return regionText;
                                        const { short, shortened } = shortenAddress(regionText, 2);
                                        return shortened ? `${short}…` : short;
                                    })();

                                    const createdRelative = formatRelativeCreatedLabel(card?.createdAt, card?.createdTime);

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
                                        borderRadius: 3,
                                        overflow: "hidden",
                                        cursor: "pointer",
                                        outline: "none",
                                        border: "1px solid rgba(255,255,255,0.55)",
                                        backgroundColor: "rgba(255,255,255,0.40)",
                                        backdropFilter: "saturate(180%) blur(10px)",
                                        WebkitBackdropFilter: "saturate(180%) blur(10px)",
                                        boxShadow: "0 10px 28px rgba(0,0,0,0.12)",
                                        transition: "transform 180ms ease, box-shadow 180ms ease, filter 180ms ease",
                                        "&:hover": {
                                            filter: "brightness(1.02)",
                                            transform: "translateY(-3px)",
                                            boxShadow: "0 16px 40px rgba(0,0,0,0.16)",
                                        },
                                        "&:focus-visible": { outline: "2px solid rgba(0,0,0,0.35)", outlineOffset: 2 },
                                    }}
                                >
                                    <Box
                                        sx={{
                                            height: 185,
                                            background: "linear-gradient(135deg, rgba(230,230,230,0.55) 0%, rgba(245,245,245,0.35) 100%)",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            p: 1.25,
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
                                                    borderRadius: 2,
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
                                            backgroundColor: "rgba(255,255,255,0.55)",
                                            backdropFilter: "saturate(180%) blur(10px)",
                                            WebkitBackdropFilter: "saturate(180%) blur(10px)",
                                            px: 2,
                                            py: 1.5,
                                            display: "flex",
                                            flexDirection: "column",
                                            gap: 1,
                                        }}
                                    >
                                        {createdRelative && (
                                            <Typography
                                                sx={{
                                                    fontSize: 11,
                                                    fontWeight: 900,
                                                    opacity: 0.7,
                                                    overflowWrap: "anywhere",
                                                }}
                                            >
                                                Δημιουργήθηκε: {createdRelative}
                                            </Typography>
                                        )}
                                        <Box
                                            sx={{
                                                display: "flex",
                                                flexDirection: "column",
                                                gap: 0.75,
                                                backgroundColor: "rgba(255,255,255,0.70)",
                                                border: "1px solid rgba(0,0,0,0.10)",
                                                borderRadius: 2,
                                                boxShadow: "0 6px 16px rgba(0,0,0,0.08)",
                                                px: 1.25,
                                                py: 0.75,
                                            }}
                                        >
                                            <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
                                                <LocationOnIcon fontSize="small" sx={{ opacity: 0.75, mt: "2px" }} />
                                                <Typography sx={{ fontSize: 12, fontWeight: 900, lineHeight: 1.25, overflowWrap: "anywhere" }}>
                                                    {regionPreview}
                                                </Typography>
                                            </Box>

                                            <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
                                                <PhoneIcon fontSize="small" sx={{ opacity: 0.75, mt: "2px" }} />
                                                <Typography sx={{ fontSize: 12, fontWeight: 800, lineHeight: 1.25, overflowWrap: "anywhere" }}>
                                                    {phoneText}
                                                </Typography>
                                            </Box>
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
                        overflow: "hidden",
                    }}
                >
                    <Box
                        onClick={(e) => e.stopPropagation()}
                        sx={{
                            width: "100%",
                            maxWidth: 980,
                            backgroundColor: "rgba(255,255,255,0.72)",
                            borderRadius: 3,
                            border: "1px solid rgba(255,255,255,0.65)",
                            boxShadow: "0 18px 50px rgba(0,0,0,0.20)",
                            backdropFilter: "saturate(180%) blur(14px)",
                            WebkitBackdropFilter: "saturate(180%) blur(14px)",
                            position: "relative",
                            display: "flex",
                            flexDirection: "column",
                            p: 0,
                            maxHeight: {
                                xs: "clamp(520px, 78dvh, 720px)",
                                md: "clamp(560px, 76dvh, 760px)",
                            },
                            overflow: "hidden",
                        }}
                    >
                        <Box
                            sx={{
                                flex: "1 1 auto",
                                minHeight: 0,
                                overflowY: "auto",
                                overflowX: "hidden",
                                scrollbarGutter: "stable",
                                p: { xs: 2, md: 3 },
                            }}
                        >
                        <Box
                            sx={{
                                position: "sticky",
                                top: 0,
                                zIndex: 5,
                                pt: { xs: 0.2, md: 0.2 },
                                pb: { xs: 0.6, md: 0.6 },
                                mb: 1.25,
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
                                        width: 36,
                                        height: 36,
                                        borderRadius: 999,
                                        border: "1px solid rgba(0,0,0,0.18)",
                                        backgroundColor: "rgba(255,255,255,0.70)",
                                        boxShadow: "0 6px 14px rgba(0,0,0,0.10)",
                                        backdropFilter: "saturate(180%) blur(10px)",
                                        WebkitBackdropFilter: "saturate(180%) blur(10px)",
                                        "&:hover": { backgroundColor: "rgba(255,255,255,0.82)" },
                                        flex: "0 0 auto",
                                    }}
                                    aria-label="Close"
                                >
                                    <CloseRoundedIcon fontSize="small" />
                                </IconButton>

                                <Typography
                                    sx={{
                                        fontWeight: 900,
                                        fontSize: { xs: 16, md: 20 },
                                        lineHeight: 1.15,
                                        letterSpacing: "-0.2px",
                                        textAlign: "center",
                                        flex: "1 1 auto",
                                        px: 1,
                                        overflowWrap: "anywhere",
                                    }}
                                >
                                    Δήλωση {mode === "lost" ? "απώλειας" : "εύρεσης"}
                                </Typography>

                                <Box sx={{ width: 36, flex: "0 0 auto" }} />
                            </Box>

                            <Box
                                sx={{
                                    mt: 0.75,
                                    display: "flex",
                                    flexWrap: "wrap",
                                    gap: 1,
                                    alignItems: "center",
                                    color: "rgba(0,0,0,0.75)",
                                }}
                            >
                                <Typography sx={{ fontSize: 11, fontWeight: 800, overflowWrap: "anywhere" }}>
                                    Δημιουργήθηκε: {selectedDeclaration?.createdAt ?? "-"}{selectedDeclaration?.createdTime ? `, ${selectedDeclaration.createdTime}` : ""}
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
                                        borderRadius: 3,
                                        overflow: "hidden",
                                        border: "1px solid rgba(255,255,255,0.65)",
                                        background: "linear-gradient(135deg, rgba(255,255,255,0.55) 0%, rgba(245,245,245,0.35) 100%)",
                                        boxShadow: "0 14px 34px rgba(0,0,0,0.16)",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        p: 1,
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
                                                borderRadius: 2.5,
                                                boxShadow: "0 12px 22px rgba(0,0,0,0.16)",
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
                                                    borderRadius: 2,
                                                    overflow: "hidden",
                                                    cursor: "pointer",
                                                    outline: "none",
                                                    border:
                                                        idx === activePhotoIndex
                                                            ? "1.5px solid rgba(0,0,0,0.45)"
                                                            : "1px solid rgba(0,0,0,0.14)",
                                                    boxShadow: "0 8px 16px rgba(0,0,0,0.10)",
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
                                        border: "1px solid rgba(0,0,0,0.10)",
                                        borderRadius: 3,
                                        backgroundColor: "rgba(255,255,255,0.55)",
                                        boxShadow: "0 14px 30px rgba(0,0,0,0.10)",
                                        backdropFilter: "saturate(160%) blur(10px)",
                                        WebkitBackdropFilter: "saturate(160%) blur(10px)",
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
                                                    borderRadius: 2,
                                                    backgroundColor: "rgba(241,233,201,0.65)",
                                                    border: "1px solid rgba(0,0,0,0.10)",
                                                    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.55)",
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
                                                    borderRadius: 2,
                                                    backgroundColor: "rgba(241,233,201,0.65)",
                                                    border: "1px solid rgba(0,0,0,0.10)",
                                                    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.55)",
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
                                                    borderRadius: 2,
                                                    backgroundColor: "rgba(241,233,201,0.65)",
                                                    border: "1px solid rgba(0,0,0,0.10)",
                                                    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.55)",
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
                                                                    {showFullAddress ? (
                                                                        <KeyboardArrowUpRoundedIcon fontSize="small" />
                                                                    ) : (
                                                                        <KeyboardArrowDownRoundedIcon fontSize="small" />
                                                                    )}
                                                                </IconButton>
                                                            )}
                                                        </Box>
                                                    );
                                                })()}
                                            </Box>
                                        </>
                                    )}

                                    {(Number.isFinite(selectedDeclaration?.location?.lat) || Number.isFinite(selectedDeclaration?.location?.lon)) && (
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
                                                    borderRadius: 2,
                                                    backgroundColor: "rgba(241,233,201,0.65)",
                                                    border: "1px solid rgba(0,0,0,0.10)",
                                                    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.55)",
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
                                    {mode === "lost" ? (
                                        <Box
                                            sx={{
                                                display: "flex",
                                                alignItems: "baseline",
                                                flexWrap: "wrap",
                                                gap: 1,
                                                mb: 1,
                                            }}
                                        >
                                            <Typography sx={{ fontWeight: 900, fontSize: 16 }}>
                                                Στοιχεία κατοικιδίου
                                            </Typography>
                                        </Box>
                                    ) : (
                                        <Typography sx={{ fontWeight: 900, fontSize: 16, mb: 1 }}>
                                            Στοιχεία κατοικιδίου
                                        </Typography>
                                    )}

                                    {mode === "lost" && hasText(pet?.microchip) && (
                                        <>
                                            <Typography sx={{ fontSize: 12, fontWeight: 800, mb: 0.75 }}>
                                                Microchip
                                            </Typography>
                                            <Box
                                                sx={{
                                                    minHeight: 34,
                                                    height: "auto",
                                                    borderRadius: 2,
                                                    backgroundColor: "rgba(251,243,214,0.65)",
                                                    border: "1px solid rgba(0,0,0,0.10)",
                                                    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.55)",
                                                    mb: 1.5,
                                                    display: "flex",
                                                    alignItems: "center",
                                                    px: 1.5,
                                                    py: 0.75,
                                                }}
                                            >
                                                <Typography sx={{ fontSize: 12, fontWeight: 800, opacity: 0.75, overflowWrap: "anywhere" }}>
                                                    {pet?.microchip}
                                                </Typography>
                                            </Box>
                                        </>
                                    )}

                                    {(mode === "found" && hasPetType) ? (
                                        <>
                                            <Typography sx={{ fontSize: 12, fontWeight: 800, mb: 0.75 }}>
                                                Τύπος ζώου
                                            </Typography>
                                            <Box
                                                sx={{
                                                    minHeight: 34,
                                                    height: "auto",
                                                    borderRadius: 2,
                                                    backgroundColor: "rgba(241,233,201,0.65)",
                                                    border: "1px solid rgba(0,0,0,0.10)",
                                                    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.55)",
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
                                    ) : (
                                      <>
                                      <Typography sx={{ fontSize: 12, fontWeight: 800, mb: 0.75 }}>
                                          Τύπος ζώου
                                      </Typography>
                                      <Box
                                          sx={{
                                              minHeight: 34,
                                              height: "auto",
                                              borderRadius: 2,
                                              backgroundColor: "rgba(241,233,201,0.65)",
                                              border: "1px solid rgba(0,0,0,0.10)",
                                              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.55)",
                                              mb: 1.5,
                                              display: "flex",
                                              alignItems: "center",
                                              px: 1.5,
                                              py: 0.75,
                                          }}
                                      >
                                          <Typography sx={{ fontSize: 12, fontWeight: 800, opacity: 0.75, overflowWrap: "anywhere" }}>
                                              {pet?.species}
                                          </Typography>
                                      </Box>
                                      </>
                                    )}

                                    {mode === "lost" ? (
                                        <>
                                            {/* Row 1: Name + Breed */}
                                            <Box
                                                sx={{
                                                    display: "grid",
                                                    gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                                                    gap: 2,
                                                    mb: 1.5,
                                                }}
                                            >
                                                {hasText(pet?.name) && (
                                                    <Box>
                                                        <Typography sx={{ fontSize: 12, fontWeight: 800, mb: 0.75 }}>
                                                            Όνομα
                                                        </Typography>
                                                        <Box
                                                            sx={{
                                                                minHeight: 34,
                                                                height: "auto",
                                                                borderRadius: 2,
                                                                backgroundColor: "rgba(251,243,214,0.65)",
                                                                border: "1px solid rgba(0,0,0,0.10)",
                                                                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.55)",
                                                                display: "flex",
                                                                alignItems: "center",
                                                                px: 1.5,
                                                                py: 0.75,
                                                            }}
                                                        >
                                                            <Typography sx={{ fontSize: 12, fontWeight: 800, opacity: 0.75, overflowWrap: "anywhere" }}>
                                                                {pet?.name}
                                                            </Typography>
                                                        </Box>
                                                    </Box>
                                                )}

                                                {hasBreed && (
                                                    <Box>
                                                        <Typography sx={{ fontSize: 12, fontWeight: 800, mb: 0.75 }}>
                                                            Φυλή
                                                        </Typography>
                                                        <Box
                                                            sx={{
                                                                minHeight: 34,
                                                                height: "auto",
                                                                borderRadius: 2,
                                                                backgroundColor: "rgba(251,243,214,0.65)",
                                                                border: "1px solid rgba(0,0,0,0.10)",
                                                                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.55)",
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
                                            </Box>

                                            {/* Row 2: Gender + Color */}
                                            <Box
                                                sx={{
                                                    display: "grid",
                                                    gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                                                    gap: 2,
                                                    mb: 1.5,
                                                }}
                                            >
                                                {hasGender && (
                                                    <Box>
                                                        <Typography sx={{ fontSize: 12, fontWeight: 800, mb: 0.75 }}>
                                                            Φύλο
                                                        </Typography>
                                                        <Box
                                                            sx={{
                                                                minHeight: 34,
                                                                height: "auto",
                                                                borderRadius: 2,
                                                                backgroundColor: "rgba(251,243,214,0.65)",
                                                                border: "1px solid rgba(0,0,0,0.10)",
                                                                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.55)",
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

                                                {hasColor && (
                                                    <Box>
                                                        <Typography sx={{ fontSize: 12, fontWeight: 800, mb: 0.75 }}>
                                                            Χρώμα
                                                        </Typography>
                                                        <Box
                                                            sx={{
                                                                minHeight: 34,
                                                                height: "auto",
                                                                borderRadius: 2,
                                                                backgroundColor: "rgba(251,243,214,0.65)",
                                                                border: "1px solid rgba(0,0,0,0.10)",
                                                                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.55)",
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
                                            </Box>

                                            {/* Rest as-is: keep Size below */}
                                            {hasSize && (
                                                <Box sx={{ mb: 1.5 }}>
                                                    <Typography sx={{ fontSize: 12, fontWeight: 800, mb: 0.75 }}>
                                                        Μέγεθος
                                                    </Typography>
                                                    <Box
                                                        sx={{
                                                            minHeight: 34,
                                                            height: "auto",
                                                            borderRadius: 2,
                                                            backgroundColor: "rgba(251,243,214,0.65)",
                                                            border: "1px solid rgba(0,0,0,0.10)",
                                                            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.55)",
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
                                        </>
                                    ) : (
                                        <>
                                            {/* FOUND layout (unchanged) */}
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
                                                            borderRadius: 2,
                                                            backgroundColor: "rgba(251,243,214,0.65)",
                                                            border: "1px solid rgba(0,0,0,0.10)",
                                                            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.55)",
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
                                                            borderRadius: 2,
                                                            backgroundColor: "rgba(251,243,214,0.65)",
                                                            border: "1px solid rgba(0,0,0,0.10)",
                                                            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.55)",
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
                                                            borderRadius: 2,
                                                            backgroundColor: "rgba(251,243,214,0.65)",
                                                            border: "1px solid rgba(0,0,0,0.10)",
                                                            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.55)",
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
                                                            borderRadius: 2,
                                                            backgroundColor: "rgba(251,243,214,0.65)",
                                                            border: "1px solid rgba(0,0,0,0.10)",
                                                            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.55)",
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
                                        </>
                                    )}
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
                                                    borderRadius: 2,
                                                    backgroundColor: "rgba(238,240,210,0.65)",
                                                    border: "1px solid rgba(0,0,0,0.10)",
                                                    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.55)",
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
                                                    borderRadius: 2,
                                                    backgroundColor: "rgba(238,240,210,0.65)",
                                                    border: "1px solid rgba(0,0,0,0.10)",
                                                    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.55)",
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
                                                    borderRadius: 2,
                                                    backgroundColor: "rgba(238,240,210,0.65)",
                                                    border: "1px solid rgba(0,0,0,0.10)",
                                                    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.55)",
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

                                    {mode === "lost" && hasAltContact && (
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
                </Box>
            </Modal>
        </Box>
    );
}
