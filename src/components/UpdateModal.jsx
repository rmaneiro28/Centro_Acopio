import React, { useState } from 'react';
import { X, Send } from 'lucide-react';

const UpdateModal = ({ center, onClose, onSubmit }) => {
  const [estado, setEstado] = useState(center.estado_capacidad);
  // Join the arrays to display them as comma-separated strings
  const [urgentes, setUrgentes] = useState(center.insumos_urgentes.join(', '));
  const [recibidos, setRecibidos] = useState(center.insumos_recibidos.join(', '));
  const [comentario, setComentario] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Parse strings back to arrays
    const parseList = (str) => str.split(',').map(i => i.trim()).filter(i => i !== '');

    onSubmit({
      ...center,
      estado_capacidad: estado,
      insumos_urgentes: parseList(urgentes),
      insumos_recibidos: parseList(recibidos),
      ultima_actualizacion: new Date().toISOString()
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="glass-panel modal-content animate-fade-in" onClick={e => e.stopPropagation()} style={{ padding: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1.5rem', margin: 0 }}>Actualizar Estado</h3>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
            <X size={24} />
          </button>
        </div>

        <p style={{ marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>
          Estás reportando el estado para: <strong style={{ color: 'var(--text-primary)' }}>{center.nombre}</strong>
        </p>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Estado de Capacidad Actual</label>
            <select 
              className="input-field" 
              value={estado} 
              onChange={(e) => setEstado(e.target.value)}
            >
              <option value="critico">🚨 Crítico (Necesitan insumos urgente)</option>
              <option value="estable">✅ Estable (Recibiendo con normalidad)</option>
              <option value="lleno">🛑 Lleno (Capacidad máxima, no enviar más)</option>
            </select>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Prioridad Alta (Insumos Urgentes)</label>
            <input 
              className="input-field" 
              value={urgentes}
              onChange={(e) => setUrgentes(e.target.value)}
              placeholder="Ej. Agua, Medicinas, Cobijas (separado por coma)"
            />
            <small style={{ color: 'var(--text-secondary)' }}>Lo que el centro más necesita en este momento.</small>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Ya no necesitan (Capacidad Llena)</label>
            <input 
              className="input-field" 
              value={recibidos}
              onChange={(e) => setRecibidos(e.target.value)}
              placeholder="Ej. Ropa de adulto, Zapatos (separado por coma)"
            />
            <small style={{ color: 'var(--text-secondary)' }}>Insumos que el centro ya tiene en exceso y pide no enviar más.</small>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Comentarios adicionales (Opcional)</label>
            <textarea 
              className="input-field" 
              rows="2" 
              placeholder="Ej. El acceso por la calle principal está cerrado..."
              value={comentario}
              onChange={(e) => setComentario(e.target.value)}
              style={{ resize: 'vertical' }}
            ></textarea>
          </div>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '2rem' }}>
            <button type="button" onClick={onClose} className="btn btn-outline">
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary">
              <Send size={16} /> Reportar Actualización
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateModal;
