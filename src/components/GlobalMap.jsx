import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const createIcon = (color, emoji) => {
  return L.divIcon({
    html: `<div style="background-color: ${color}; width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 18px; color: white; border: 2px solid white; box-shadow: 0 4px 6px rgba(0,0,0,0.3);">${emoji}</div>`,
    className: 'custom-map-icon',
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -36]
  });
};

const icons = {
  centro_acopio: createIcon('#3b82f6', '📦'), // Azul
  refugio: createIcon('#10b981', '🏠'),      // Verde
  hospital: createIcon('#ef4444', '🏥')      // Rojo
};

const GlobalMap = ({ centros, onUpdateClick }) => {
  const defaultCenter = [10.4806, -66.9036]; // Caracas
  
  const markers = centros.filter(c => c.latitud && c.longitud);

  return (
    <div className="glass-panel animate-fade-in" style={{ height: '500px', width: '100%', borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid var(--surface-border)', marginBottom: '2rem', position: 'relative', zIndex: 1 }}>
      <MapContainer 
        center={defaultCenter} 
        zoom={12} 
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {markers.map(center => (
          <Marker 
            key={center.id} 
            position={[center.latitud, center.longitud]}
            icon={icons[center.tipo] || icons.centro_acopio}
          >
            <Popup>
              <div style={{ padding: '0.25rem', minWidth: '180px' }}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem', color: '#111' }}>{center.nombre}</h4>
                <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.85rem', color: '#555', lineHeight: '1.2' }}>{center.direccion}</p>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.8rem' }}>
                  <button 
                    onClick={() => onUpdateClick(center)}
                    style={{ background: '#3b82f6', color: 'white', border: 'none', padding: '0.4rem', borderRadius: '4px', cursor: 'pointer', fontSize: '0.85rem', width: '100%', fontWeight: 600 }}
                  >
                    Actualizar
                  </button>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default GlobalMap;
