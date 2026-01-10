import { useEffect, useMemo, useRef, useState } from "react";
import { Autocomplete, Box, TextField, Typography } from "@mui/material";
import { MapContainer, Marker, TileLayer, useMap } from "react-leaflet";
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
  return data?.display_name || "";
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
  coords,
  onCoordsChange,
  helperText,
  error,
}) {
  const [inputValue, setInputValue] = useState(value || "");
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const debounceTimer = useRef(null);
  const abortRef = useRef(null);

  useEffect(() => {
    setInputValue(value || "");
  }, [value]);

  const center = useMemo(() => {
    if (coords?.lat != null && coords?.lon != null) return coords;
    return DEFAULT_CENTER;
  }, [coords]);

  const markerPos = useMemo(() => {
    if (coords?.lat != null && coords?.lon != null) return [coords.lat, coords.lon];
    return [DEFAULT_CENTER.lat, DEFAULT_CENTER.lon];
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
  };

  const handleMarkerDragEnd = async (e) => {
    const { lat, lng } = e.target.getLatLng();
    onCoordsChange?.({ lat, lon: lng });

    const controller = new AbortController();
    try {
      const addr = await nominatimReverse(lat, lng, controller.signal);
      if (addr) onChange?.(addr);
    } catch {
      // ignore
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
          />
        )}
      />

      <Box>
        <Typography sx={{ fontSize: 13, opacity: 0.8, mb: 1 }}>
          Σύρετε τον δείκτη για να διορθώσετε την τοποθεσία.
        </Typography>
        <Box
          sx={{
            width: "100%",
            height: 280,
            borderRadius: 2,
            overflow: "hidden",
            border: "1px solid rgba(0,0,0,0.12)",
          }}
        >
          <MapContainer center={[center.lat, center.lon]} zoom={13} style={{ height: "100%", width: "100%" }}>
            <MapRecenter center={center} />
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker
              position={markerPos}
              draggable
              eventHandlers={{ dragend: handleMarkerDragEnd }}
            />
          </MapContainer>
        </Box>
      </Box>
    </Box>
  );
}
