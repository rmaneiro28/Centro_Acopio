import React, { useEffect, useState } from 'react';
import { MapPin, Clock, Phone, AlertCircle, CheckCircle2, XCircle, Info, ChevronRight, Map } from 'lucide-react';

const Badge = ({ estado }) => {
  if (estado === 'critico') return <span className="badge badge-critical"><AlertCircle size={14} className="mr-1" /> Crítico</span>;
  if (estado === 'estable') return <span className="badge badge-stable"><CheckCircle2 size={14} className="mr-1" /> Estable</span>;
  if (estado === 'lleno') return <span className="badge badge-full"><XCircle size={14} className="mr-1" /> Lleno</span>;
  return null;
};

const CenterCard = ({ center, onUpdateClick }) => {
  const [, setTick] = useState(0);

  useEffect(() => {
    // Actualizar el componente cada 60 segundos para refrescar el tiempo relativo ("hace X min")
    const intervalId = setInterval(() => {
      setTick(t => t + 1);
    }, 60000);
    return () => clearInterval(intervalId);
  }, []);

  const timeAgo = (dateString) => {
    const rtf = new Intl.RelativeTimeFormat('es', { numeric: 'auto' });
    const diff = (new Date(dateString) - new Date()) / 1000;
    
    if (Math.abs(diff) < 60) return rtf.format(Math.round(diff), 'second');
    if (Math.abs(diff) < 3600) return rtf.format(Math.round(diff / 60), 'minute');
    if (Math.abs(diff) < 86400) return rtf.format(Math.round(diff / 3600), 'hour');
    return rtf.format(Math.round(diff / 86400), 'day');
  };

  const hasCoordinates = center.latitud && center.longitud;
  const mapUrl = hasCoordinates ? `https://www.google.com/maps/search/?api=1&query=${center.latitud},${center.longitud}` : null;

  return (
    <div className="glass-panel animate-fade-in" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
        <h3 style={{ fontSize: '1.25rem', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {center.tipo === 'refugio' ? '🏠' : center.tipo === 'hospital' ? '🏥' : '📦'} {center.nombre}
        </h3>
        <Badge estado={center.estado_capacidad} />
      </div>
      
      <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
          <MapPin size={16} style={{ marginTop: '0.1rem', flexShrink: 0 }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
            <span>{center.municipio} - {center.direccion}</span>
            {hasCoordinates && (
              <a href={mapUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', color: 'var(--accent-color)', textDecoration: 'none', fontSize: '0.8rem', fontWeight: 500 }}>
                <Map size={12} /> Ver en el mapa
              </a>
            )}
          </div>
        </div>
        
        {center.contacto_telefono && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Phone size={16} />
            <a href={`tel:${center.contacto_telefono}`} style={{ color: 'var(--accent-color)', textDecoration: 'none' }}>
              {center.contacto_telefono}
            </a>
          </div>
        )}
      </div>

      <div style={{ flexGrow: 1 }}>
        <div style={{ marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <AlertCircle size={16} color="var(--status-critical)" />
            <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>Prioridad Alta:</span>
          </div>
          {center.insumos_urgentes.length > 0 ? (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {center.insumos_urgentes.map(item => (
                <span key={item} className="badge badge-tag">{item}</span>
              ))}
            </div>
          ) : (
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>No reporta insumos urgentes.</span>
          )}
        </div>

        {center.insumos_recibidos.length > 0 && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <Info size={16} color="var(--status-full)" />
              <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>Ya no necesitan:</span>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {center.insumos_recibidos.map(item => (
                <span key={item} className="badge badge-tag" style={{ opacity: 0.6 }}>{item}</span>
              ))}
            </div>
          </div>
        )}
      </div>
      
      <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--surface-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
          <Clock size={14} />
          <span>Actualizado {timeAgo(center.ultima_actualizacion)}</span>
        </div>
        
        <button onClick={() => onUpdateClick(center)} className="btn btn-outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>
          Actualizar <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
};

export default CenterCard;
