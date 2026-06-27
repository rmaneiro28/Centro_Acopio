import React, { useState, useEffect, useRef, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Loader2 } from 'lucide-react';

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
      
      <div style={{ position: 'absolute', bottom: '10px', left: '10px', right: '10px', zIndex: 500, backgroundColor: 'var(--surface-color)', backdropFilter: 'blur(4px)', padding: '0.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--surface-border)', fontSize: '0.8rem', textAlign: 'center' }}>
        Haz clic en el mapa para ubicar el centro de acopio
      </div>
    </div>
  );
};

export default MapSelector;
