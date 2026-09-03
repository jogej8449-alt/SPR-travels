import { useState, useEffect, useRef, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix default Leaflet marker icons (broken in bundlers)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Default center: Vijayawada, Andhra Pradesh (easier starting point)
const DEFAULT_CENTER = [16.5062, 80.6480];
const DEFAULT_ZOOM = 11;
const SELECTED_ZOOM = 15;

// Debounce helper
function useDebounce(value, delay) {
    const [debouncedValue, setDebouncedValue] = useState(value);
    useEffect(() => {
        const handler = setTimeout(() => setDebouncedValue(value), delay);
        return () => clearTimeout(handler);
    }, [value, delay]);
    return debouncedValue;
}

// Component: listens for map clicks and moves marker
function MapClickHandler({ onMapClick }) {
    useMapEvents({
        click(e) {
            onMapClick(e.latlng.lat, e.latlng.lng);
        }
    });
    return null;
}

// Component: moves the map view to a given position
function MapFlyTo({ position }) {
    const map = useMap();
    useEffect(() => {
        if (position) {
            map.flyTo(position, SELECTED_ZOOM, { duration: 1 });
        }
    }, [position, map]);
    return null;
}

// Reverse geocode lat/lng → address using Nominatim (free, OSM-based)
async function reverseGeocode(lat, lng) {
    try {
        const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=jsonv2`,
            { headers: { 'Accept-Language': 'en' } }
        );
        const data = await res.json();
        return data.display_name || `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
    } catch {
        return `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
    }
}

// Search locations via Nominatim as per user request (general-purpose)
async function searchPlaces(query, signal) {
    const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=jsonv2&addressdetails=1&namedetails=1&limit=10&countrycodes=in`,
        { signal, headers: { 'Accept-Language': 'en' } }
    );
    return res.json();
}

/**
 * LocationPicker
 * Props:
 *   mode          : "pickup" | "drop"
 *   initialLocation : { address, lat, lng } | null
 *   onLocationConfirm(locationObj) : called with { address, lat, lng }
 *   onBack()      : called when user clicks ← Back
 */
const LocationPicker = ({ mode, initialLocation, onLocationConfirm, onBack }) => {
    const label = mode === 'pickup' ? 'Pickup' : 'Drop';
    const emoji = mode === 'pickup' ? '📍' : '🎯';

    // Track selected point
    const [selected, setSelected] = useState(
        initialLocation ? { lat: initialLocation.lat, lng: initialLocation.lng } : null
    );
    const [address, setAddress] = useState(initialLocation?.address || '');
    const [loadingAddr, setLoadingAddr] = useState(false);

    // Search state
    const [searchQuery, setSearchQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [searching, setSearching] = useState(false);
    const [searchError, setSearchError] = useState('');

    // Use 600ms debounce as requested
    const debouncedQuery = useDebounce(searchQuery, 600);

    // Fly-to position
    const [flyTo, setFlyTo] = useState(
        initialLocation ? [initialLocation.lat, initialLocation.lng] : null
    );

    // used to cancel in-flight fetch
    const abortRef = useRef(null);

    // When user clicks on the map
    const handleMapClick = useCallback(async (lat, lng) => {
        setSelected({ lat, lng });
        setLoadingAddr(true);
        setAddress('');
        const addr = await reverseGeocode(lat, lng);
        setAddress(addr);
        setLoadingAddr(false);
        setSuggestions([]);
        setSearchQuery('');
    }, []);

    // Fetch search suggestions when debounced query changes
    useEffect(() => {
        if (debouncedQuery.trim().length < 3) {
            setSuggestions([]);
            setSearchError('');
            return;
        }
        if (abortRef.current) abortRef.current.abort();
        const controller = new AbortController();
        abortRef.current = controller;

        setSearching(true);
        setSearchError('');

        searchPlaces(debouncedQuery, controller.signal)
            .then(results => {
                setSuggestions(results || []);
                if (results && results.length === 0) {
                    setSearchError('No matching locations found. Try another search or select directly on the map.');
                }
                setSearching(false);
            })
            .catch(err => {
                if (err.name !== 'AbortError') {
                    setSearchError('Location search is temporarily unavailable. Please try again or select the location directly on the map.');
                    setSearching(false);
                }
            });
    }, [debouncedQuery]);

    // User clicks a suggestion
    const handleSuggestionClick = (place) => {
        const lat = parseFloat(place.lat);
        const lng = parseFloat(place.lon);
        setSelected({ lat, lng });
        setAddress(place.display_name);
        setFlyTo([lat, lng]);
        setSuggestions([]);
        setSearchQuery('');
    };

    // Use current browser location
    const handleUseMyLocation = () => {
        if (!navigator.geolocation) return;
        navigator.geolocation.getCurrentPosition(async (pos) => {
            const { latitude: lat, longitude: lng } = pos.coords;
            setSelected({ lat, lng });
            setFlyTo([lat, lng]);
            setLoadingAddr(true);
            const addr = await reverseGeocode(lat, lng);
            setAddress(addr);
            setLoadingAddr(false);
        }, () => {
            alert('Location permission denied. Please tap on the map.');
        });
    };

    const handleConfirm = () => {
        if (!selected) return;
        onLocationConfirm({ address, lat: selected.lat, lng: selected.lng });
    };

    const S = styles;

    return (
        <div style={S.container}>
            {/* Back */}
            <button onClick={onBack} style={S.backBtn}>← Back</button>

            <h2 style={S.title}>{emoji} Select {label} Location</h2>

            {/* Search bar */}
            <div style={S.searchWrap}>
                <input
                    style={S.searchInput}
                    type="text"
                    placeholder="🔍 Search (e.g. 'Kanuru, Vijayawada')"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    autoComplete="off"
                />
                {searching && <div style={S.searchHint}>Searching...</div>}
                {searchError && <div style={{ ...S.searchHint, color: '#f59e0b' }}>{searchError}</div>}
                {suggestions.length > 0 && (
                    <div style={S.suggestionList}>
                        {suggestions.map((s, i) => (
                            <div
                                key={i}
                                style={S.suggestionItem}
                                onClick={() => handleSuggestionClick(s)}
                                onMouseEnter={e => e.currentTarget.style.background = 'rgba(245,183,84,0.15)'}
                                onMouseLeave={e => e.currentTarget.style.background = 'rgba(13,26,48,0.95)'}
                            >
                                <div style={{ fontWeight: 600, color: '#fff', marginBottom: '2px' }}>
                                    📍 {s.name || s.display_name.split(',')[0]}
                                </div>
                                <div style={{ fontSize: '0.8rem', color: '#aaa', paddingLeft: '18px' }}>
                                    {[
                                        s.address?.city_district || s.address?.county || s.address?.state_district,
                                        s.address?.state,
                                        s.address?.country
                                    ].filter(Boolean).join(', ') || s.display_name.split(',').slice(1).join(',').trim()}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Use My Location */}
            <button onClick={handleUseMyLocation} style={S.myLocBtn}>
                📍 Use My Current Location
            </button>

            {/* Map */}
            <div style={S.mapWrap}>
                <MapContainer
                    center={flyTo || DEFAULT_CENTER}
                    zoom={flyTo ? SELECTED_ZOOM : DEFAULT_ZOOM}
                    style={{ height: '100%', width: '100%', borderRadius: '12px' }}
                    scrollWheelZoom={true}
                >
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://openstreetmap.org">OpenStreetMap</a>'
                    />
                    <MapClickHandler onMapClick={handleMapClick} />
                    {flyTo && <MapFlyTo position={flyTo} />}
                    {selected && <Marker position={[selected.lat, selected.lng]} />}
                </MapContainer>
                <p style={S.mapHint}>Click or tap anywhere on the map to select a location</p>
            </div>

            {/* Selected location display */}
            {selected && (
                <div style={S.selectedBox}>
                    <p style={S.selectedLabel}>{emoji} Selected {label} Location</p>
                    <p style={S.selectedAddr}>
                        {loadingAddr ? 'Getting address...' : (address || `${selected.lat.toFixed(5)}, ${selected.lng.toFixed(5)}`)}
                    </p>
                    <button
                        onClick={handleConfirm}
                        disabled={loadingAddr}
                        style={{ ...S.confirmBtn, opacity: loadingAddr ? 0.5 : 1 }}
                    >
                        ✓ CONFIRM {label.toUpperCase()} LOCATION
                    </button>
                </div>
            )}
        </div>
    );
};

const styles = {
    container: {
        padding: '1.5rem 5%',
        maxWidth: '900px',
        margin: '0 auto',
    },
    backBtn: {
        background: 'transparent',
        color: '#ccc',
        border: 'none',
        cursor: 'pointer',
        fontSize: '1rem',
        marginBottom: '1rem',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        padding: '6px 0',
        transition: 'color 0.2s',
    },
    title: {
        fontSize: 'clamp(1.3rem,4vw,1.8rem)',
        fontWeight: 700,
        marginBottom: '1rem',
        color: '#fff',
    },
    searchWrap: {
        position: 'relative',
        marginBottom: '0.75rem',
    },
    searchInput: {
        width: '100%',
        padding: '12px 16px',
        borderRadius: '10px',
        background: 'rgba(255,255,255,0.07)',
        border: '1px solid rgba(255,255,255,0.15)',
        color: '#fff',
        fontSize: '1rem',
        outline: 'none',
        boxSizing: 'border-box',
    },
    searchHint: {
        fontSize: '0.82rem',
        color: '#aaa',
        marginTop: '4px',
        paddingLeft: '4px',
    },
    suggestionList: {
        position: 'absolute',
        top: '100%',
        left: 0,
        right: 0,
        background: 'rgba(13,26,48,0.97)',
        border: '1px solid rgba(255,255,255,0.12)',
        borderRadius: '10px',
        zIndex: 9999,
        maxHeight: '220px',
        overflowY: 'auto',
        boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
    },
    suggestionItem: {
        padding: '12px 14px',
        cursor: 'pointer',
        fontSize: '0.88rem',
        color: '#ddd',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        lineHeight: 1.4,
        transition: 'background 0.15s',
    },
    myLocBtn: {
        background: 'rgba(255,255,255,0.07)',
        border: '1px solid rgba(255,255,255,0.15)',
        color: '#ccc',
        padding: '9px 18px',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '0.9rem',
        marginBottom: '1rem',
        transition: 'all 0.2s',
    },
    mapWrap: {
        height: '420px',
        borderRadius: '12px',
        overflow: 'hidden',
        border: '1px solid rgba(255,255,255,0.1)',
        marginBottom: '0.5rem',
        position: 'relative',
    },
    mapHint: {
        color: 'rgba(255,255,255,0.3)',
        fontSize: '0.78rem',
        textAlign: 'center',
        marginTop: '4px',
        marginBottom: '1rem',
    },
    selectedBox: {
        background: 'rgba(245,183,84,0.08)',
        border: '1px solid rgba(245,183,84,0.3)',
        borderRadius: '12px',
        padding: '1.25rem 1.5rem',
        marginTop: '0.5rem',
    },
    selectedLabel: {
        color: '#f5b754',
        fontSize: '0.85rem',
        fontWeight: 600,
        letterSpacing: '1px',
        textTransform: 'uppercase',
        margin: '0 0 6px 0',
    },
    selectedAddr: {
        color: '#fff',
        fontWeight: 600,
        fontSize: '1rem',
        lineHeight: 1.5,
        margin: '0 0 1rem 0',
    },
    confirmBtn: {
        width: '100%',
        padding: '14px',
        background: 'linear-gradient(135deg,#f5b754,#e8920a)',
        color: '#000',
        border: 'none',
        borderRadius: '10px',
        fontWeight: 800,
        fontSize: '1rem',
        cursor: 'pointer',
        letterSpacing: '0.5px',
        transition: 'all 0.25s',
    },
};

export default LocationPicker;
