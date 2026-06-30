import React from 'react';
import { User, Activity, Building2, Phone, Hash, FileText } from 'lucide-react';

const PacienteCard = ({ paciente, onCenterClick }) => {
  // Manejo seguro del nombre del hospital devuelto por Join o por RPC
  const hospitalNombre = paciente.centro_nombre || paciente.centros_acopio?.nombre || 'Ubicación Desconocida';
  const hospitalTipo = paciente.centro_tipo || paciente.centros_acopio?.tipo || 'Desconocido';
  
  const getStatusColor = (status) => {
    switch(status?.toLowerCase()) {
      case 'estable': return 'var(--success-color, #10b981)';
      case 'delicado': return 'var(--warning-color, #f59e0b)';
      case 'critico': 
      case 'crítico': return 'var(--danger-color, #ef4444)';
      default: return 'var(--text-secondary)';
    }
  };

  return (
    <div className="glass-panel center-card animate-fade-in" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', height: '100%' }}>
      {/* Cabecera de la Tarjeta */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
        <div style={{
          width: '50px',
          height: '50px',
          borderRadius: '12px',
          background: 'rgba(59, 130, 246, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--accent-color)',
          flexShrink: 0
        }}>
          <User size={28} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h3 style={{ margin: '0 0 0.25rem 0', fontSize: '1.2rem', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {paciente.nombre_completo}
          </h3>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
            {paciente.edad && (
              <span className="badge badge-tag" style={{ fontSize: '0.75rem' }}>{paciente.edad} años</span>
            )}
            <span style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '0.2rem',
              fontSize: '0.75rem',
              padding: '0.2rem 0.5rem',
              borderRadius: '20px',
              background: `color-mix(in srgb, ${getStatusColor(paciente.estado_salud)} 15%, transparent)`,
              color: getStatusColor(paciente.estado_salud),
              fontWeight: 600,
              textTransform: 'uppercase'
            }}>
              <Activity size={12} /> {paciente.estado_salud || 'Desconocido'}
            </span>
          </div>
        </div>
      </div>

      {/* Detalles del Paciente */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
        {paciente.cedula && (
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            <Hash size={16} style={{ marginTop: '0.1rem', flexShrink: 0 }} />
            <span>C.I: {paciente.cedula}</span>
          </div>
        )}
        
        {paciente.telefono_contacto && (
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            <Phone size={16} style={{ marginTop: '0.1rem', flexShrink: 0 }} />
            <span>{paciente.telefono_contacto}</span>
          </div>
        )}

        {/* Info del Hospital */}
        <div 
          onClick={() => {
            if (paciente.centro_id && onCenterClick) onCenterClick(paciente.centro_id);
          }}
          style={{ 
            display: 'flex', 
            gap: '0.5rem', 
            alignItems: 'flex-start', 
            fontSize: '0.9rem', 
            color: 'var(--text-primary)',
            background: 'rgba(255,255,255,0.05)',
            padding: '0.5rem',
            borderRadius: '8px',
            marginTop: '0.5rem',
            cursor: onCenterClick ? 'pointer' : 'default',
            border: '1px solid var(--border-color)',
            transition: 'border-color 0.2s, background 0.2s'
          }}
          className={onCenterClick ? 'hover-hospital-box' : ''}
        >
          <Building2 size={18} style={{ color: 'var(--accent-color)', flexShrink: 0, marginTop: '0.1rem' }} />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontWeight: 500 }}>{hospitalNombre}</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'capitalize' }}>{hospitalTipo}</span>
          </div>
        </div>
        
        <style dangerouslySetInnerHTML={{__html: `
          .hover-hospital-box:hover {
            border-color: var(--accent-color) !important;
            background: rgba(59, 130, 246, 0.05) !important;
          }
        `}} />
      </div>

      {/* Footer con Observaciones */}
      {paciente.observaciones && (
        <div style={{ 
          marginTop: 'auto',
          paddingTop: '0.75rem', 
          borderTop: '1px solid var(--border-color)',
          fontSize: '0.85rem',
          color: 'var(--text-secondary)',
          display: 'flex',
          gap: '0.5rem',
          alignItems: 'flex-start'
        }}>
          <FileText size={14} style={{ marginTop: '0.1rem', flexShrink: 0 }} />
          <span style={{ fontStyle: 'italic', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {paciente.observaciones}
          </span>
        </div>
      )}
    </div>
  );
};

export default PacienteCard;
