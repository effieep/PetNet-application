import { useEffect, useMemo, useRef, useState } from "react";
import { Autocomplete, Box, CircularProgress, TextField, Typography } from "@mui/material";
import PlaceIcon from "@mui/icons-material/Place";
import { MapContainer, TileLayer, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";

// Fix default marker icons in bundlers like CRA
// eslint-disable-next-line no-underscore-dangle
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const DEFAULT_CENTER = { lat: 37.9838, lon: 23.7275 }; // Athens

function MapRecenter({ center }) {
  const map = useMap();
  useEffect(() => {
    if (!center) return;
    map.setView([center.lat, center.lon], map.getZoom(), { animate: true });
  }, [center, map]);
  return null;
}

function MapCenterSync({ onCenterSettled }) {
  const debounceTimer = useRef(null);
  const abortRef = useRef(null);

  useMapEvents({
    moveend() {
      if (debounceTimer.current) window.clearTimeout(debounceTimer.current);
      debounceTimer.current = window.setTimeout(() => {
        const map = this;
        const c = map.getCenter();
        if (abortRef.current) abortRef.current.abort();
        abortRef.current = new AbortController();
        onCenterSettled?.({ lat: c.lat, lon: c.lng, signal: abortRef.current.signal });
      }, 250);
    },
    zoomend() {
      if (debounceTimer.current) window.clearTimeout(debounceTimer.current);
      debounceTimer.current = window.setTimeout(() => {
        const map = this;
        const c = map.getCenter();
        if (abortRef.current) abortRef.current.abort();
        abortRef.current = new AbortController();
        onCenterSettled?.({ lat: c.lat, lon: c.lng, signal: abortRef.current.signal });
      }, 250);
    },
  });

  useEffect(
    () => () => {
      if (debounceTimer.current) window.clearTimeout(debounceTimer.current);
      if (abortRef.current) abortRef.current.abort();
    },
    []
  );

  return null;
}

async function nominatimSearch(query, signal) {
  const url = new URL("https://nominatim.openstreetmap.org/search");
  url.searchParams.set("format", "json");
  url.searchParams.set("addressdetails", "1");
  url.searchParams.set("limit", "6");
  url.searchParams.set("q", query);
  const res = await fetch(url.toString(), {
    signal,
    headers: {
      // Nominatim requests a valid User-Agent/Referer; browsers restrict UA, so we provide Referer.
      // This is best-effort and should be OK for dev; for production consider your own geocoding provider.
      Referer: window.location.origin,
    },
  });
  if (!res.ok) throw new Error("Search failed");
  const data = await res.json();
  return Array.isArray(data) ? data : [];
}

async function nominatimReverse(lat, lon, signal) {
  const url = new URL("https://nominatim.openstreetmap.org/reverse");
  url.searchParams.set("format", "json");
  url.searchParams.set("lat", String(lat));
  url.searchParams.set("lon", String(lon));
  url.searchParams.set("zoom", "18");
  url.searchParams.set("addressdetails", "1");
  const res = await fetch(url.toString(), {
    signal,
    headers: { Referer: window.location.origin },
  });
  if (!res.ok) throw new Error("Reverse failed");
  const data = await res.json();
  return {
    displayName: data?.display_name || "",
    address: data?.address || null,
  };
}

function extractRegionFromNominatimAddress(address) {
  if (!address) return "";

  // Nominatim/OSM uses different keys depending on country.
  // In Greece, the administrative region is typically under `state`.
  return (
    address.state ||
    address.region ||
    address.province ||
    address.state_district ||
    address.county ||
    address.city ||
    address.town ||
    address.village ||
    ""
  );
}

/**
 * AddressPicker
 * - Autocomplete suggestions (Nominatim)
 * - Select suggestion -> updates address and coords
 * - Drag pin -> reverse-geocodes and updates address + coords
 */
export default function AddressPicker({
  label = "Διεύθυνση / Περιοχή",
  value,
  onChange,
  onRegionChange,
  coords,
  onCoordsChange,
  helperText,
  error,
}) {
  const [inputValue, setInputValue] = useState(value || "");
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [reverseLoading, setReverseLoading] = useState(false);
  const debounceTimer = useRef(null);
  const abortRef = useRef(null);
  const reverseTokenRef = useRef(0);

  useEffect(() => {
    setInputValue(value || "");
  }, [value]);

  const center = useMemo(() => {
    if (coords?.lat != null && coords?.lon != null) return coords;
    return DEFAULT_CENTER;
  }, [coords]);

  useEffect(() => {
    if (!inputValue || inputValue.trim().length < 3) {
      setOptions([]);
      return;
    }

    setLoading(true);
    if (debounceTimer.current) window.clearTimeout(debounceTimer.current);
    debounceTimer.current = window.setTimeout(async () => {
      if (abortRef.current) abortRef.current.abort();
      const controller = new AbortController();
      abortRef.current = controller;
      try {
        const results = await nominatimSearch(inputValue.trim(), controller.signal);
        setOptions(
          results.map((r) => ({
            id: r.place_id,
            label: r.display_name,
            lat: Number(r.lat),
            lon: Number(r.lon),
            region: extractRegionFromNominatimAddress(r.address),
          }))
        );
      } catch (e) {
        // ignore aborts
      } finally {
        setLoading(false);
      }
    }, 350);

    return () => {
      if (debounceTimer.current) window.clearTimeout(debounceTimer.current);
    };
  }, [inputValue]);

  const handlePick = (picked) => {
    if (!picked) return;
    onChange?.(picked.label);
    onCoordsChange?.({ lat: picked.lat, lon: picked.lon });
    onRegionChange?.(picked.region || "");
  };

  const resolveTypedAddressIfNeeded = async () => {
    const q = String(inputValue || "").trim();
    if (q.length < 3) return;

    // If we already have coords, we assume the user has selected a suggestion or used the map.
    if (coords?.lat != null && coords?.lon != null) return;

    // Resolve the typed text to a best match so we can persist address/region/lat/lon.
    try {
      const results = await nominatimSearch(q, undefined);
      const best = Array.isArray(results) && results.length > 0 ? results[0] : null;
      if (!best) return;

      const bestLat = Number(best.lat);
      const bestLon = Number(best.lon);
      const bestLabel = best.display_name || q;
      const bestRegion = extractRegionFromNominatimAddress(best.address);

      if (Number.isFinite(bestLat) && Number.isFinite(bestLon)) {
        onCoordsChange?.({ lat: bestLat, lon: bestLon });
      }
      onChange?.(bestLabel);
      setInputValue(bestLabel);
      onRegionChange?.(bestRegion || "");
    } catch {
      // best-effort; ignore
    }
  };

  const handleCenterSettled = async ({ lat, lon, signal }) => {
    reverseTokenRef.current += 1;
    const token = reverseTokenRef.current;

    onCoordsChange?.({ lat, lon });
    setReverseLoading(true);
    try {
      const res = await nominatimReverse(lat, lon, signal);
      const addr = res?.displayName || "";
      const region = extractRegionFromNominatimAddress(res?.address);
      if (addr) {
        // Update both the parent form value and the visible input.
        onChange?.(addr);
        setInputValue(addr);
      }
      onRegionChange?.(region || "");
    } catch {
      // ignore
    } finally {
      if (reverseTokenRef.current === token) setReverseLoading(false);
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <Autocomplete
        freeSolo
        options={options}
        loading={loading}
        value={null}
        inputValue={inputValue}
        onInputChange={(_, newInput) => {
          setInputValue(newInput);
          onChange?.(newInput);
        }}
        onChange={(_, newValue) => handlePick(newValue)}
        getOptionLabel={(o) => (typeof o === "string" ? o : o.label)}
        renderInput={(params) => (
          <TextField
            {...params}
            fullWidth
            label={label}
            variant="outlined"
            size="small"
            error={error}
            helperText={helperText}
            onBlur={() => {
              resolveTypedAddressIfNeeded();
            }}
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  {reverseLoading && (
                    <CircularProgress
                      color="inherit"
                      size={16}
                      sx={{ mr: 1 }}
                      aria-label="Γίνεται ενημέρωση διεύθυνσης από τον χάρτη"
                    />
                  )}
                  {params.InputProps.endAdornment}
                </>
              ),
            }}
          />
        )}
      />

      <Box>
        <Typography sx={{ fontSize: 13, opacity: 0.8, mb: 1 }}>
          Μετακινήστε τον χάρτη ώστε ο δείκτης στο κέντρο να δείχνει το σημείο.
        </Typography>
        <Box
          sx={{
            width: "100%",
            height: 280,
            borderRadius: 2,
            overflow: "hidden",
            border: "1px solid rgba(0,0,0,0.12)",
            position: "relative",
          }}
        >
          <MapContainer
            center={[center.lat, center.lon]}
            zoom={13}
            style={{ height: "100%", width: "100%" }}
          >
            <MapRecenter center={center} />
            <MapCenterSync onCenterSettled={handleCenterSettled} />
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              // Modern-looking basemap (no API key)
              url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            />
          </MapContainer>

          {/* Fixed center pin overlay */}
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -100%)",
              pointerEvents: "none",
              zIndex: 1200,
              // Keep it readable without blocking map content
              filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.35))",
            }}
          >
            <PlaceIcon sx={{ fontSize: 40, color: "#d32f2f", opacity: 0.95 }} />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
