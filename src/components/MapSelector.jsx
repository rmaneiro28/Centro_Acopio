import React, { useState, useEffect, useRef, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Loader2, Search } from 'lucide-react';

// Fix for default Leaflet marker icon in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Component to handle map clicks
function LocationMarker({ position, setPosition, onLocationSelected }) {
  const map = useMapEvents({
    click(e) {
      setPosition(e.latlng);
      if (onLocationSelected) {
        onLocationSelected(e.latlng);
      }
    },
  });

  // Fly to the marker if position changes externally (like geolocation)
  useEffect(() => {
    if (position) {
      map.flyTo(position, map.getZoom());
    }
  }, [position, map]);

  return position === null ? null : (
    <Marker position={position}></Marker>
  );
}

const MapSelector = ({ onLocationSelected, initialPosition = null }) => {
  // Default to Caracas, Venezuela if no initial position
  const defaultCenter = [10.4806, -66.9036];
  const [position, setPosition] = useState(initialPosition || defaultCenter);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=5`);
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error("Error searching location:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectResult = (result) => {
    const latlng = { lat: parseFloat(result.lat), lng: parseFloat(result.lon) };
    setPosition(latlng);
    setSearchResults([]);
    setSearchQuery(result.display_name);
    if (onLocationSelected) {
      onLocationSelected(latlng);
    }
  };

  useEffect(() => {
    if (initialPosition) {
      setPosition(initialPosition);
    } else {
      // Try to get user's location
      setLoadingLocation(true);
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const latlng = { lat: pos.coords.latitude, lng: pos.coords.longitude };
            setPosition(latlng);
            setLoadingLocation(false);
          },
          (err) => {
            console.warn("Geolocation denied or error:", err);
            setLoadingLocation(false);
          },
          { timeout: 5000 }
        );
      } else {
        setLoadingLocation(false);
      }
    }
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ position: 'relative' }}>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleSearch(e);
              }
            }}
            placeholder="Buscar dirección, ciudad o lugar..."
            className="input-field"
            style={{ flex: 1, padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--surface-border)', background: 'var(--surface-color)', color: 'var(--text-primary)' }}
          />
          <button type="button" onClick={handleSearch} className="btn btn-primary" style={{ padding: '0 1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }} disabled={isSearching}>
            {isSearching ? <Loader2 size={20} className="animate-spin" /> : <Search size={20} />}
          </button>
        </div>
        
        {searchResults.length > 0 && (
          <ul style={{
            position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 2000, 
            background: 'var(--surface-color)', border: '1px solid var(--surface-border)', 
            borderRadius: 'var(--radius-md)', padding: 0, margin: '0.5rem 0 0 0', 
            listStyle: 'none', maxHeight: '200px', overflowY: 'auto',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
          }}>
            {searchResults.map((result) => (
              <li key={result.place_id} 
                  onClick={() => handleSelectResult(result)}
                  style={{ padding: '0.75rem 1rem', cursor: 'pointer', borderBottom: '1px solid var(--surface-border)', fontSize: '0.9rem', color: 'var(--text-primary)', transition: 'background-color 0.2s' }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--surface-hover)'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
              >
                {result.display_name}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div style={{ position: 'relative', height: '300px', width: '100%', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--surface-border)' }}>
        {loadingLocation && (
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Loader2 size={32} className="animate-spin" color="var(--accent-color)" />
        </div>
      )}
      
      <MapContainer 
        center={position} 
        zoom={13} 
        scrollWheelZoom={true} 
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker position={position} setPosition={setPosition} onLocationSelected={onLocationSelected} />
      </MapContainer>
      
      <div style={{ position: 'absolute', bottom: '10px', left: '10px', right: '10px', zIndex: 500, backgroundColor: 'var(--surface-color)', backdropFilter: 'blur(4px)', padding: '0.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--surface-border)', fontSize: '0.8rem', textAlign: 'center', color: 'var(--text-primary)' }}>
        Haz clic en el mapa o busca una dirección para ubicar el centro de acopio
      </div>
      </div>
    </div>
  );
};

export default MapSelector;
