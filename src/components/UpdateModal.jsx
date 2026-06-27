import React, { useState } from 'react';
import { X, Send } from 'lucide-react';

const UpdateModal = ({ center, onClose, onSubmit }) => {
  const [estado, setEstado] = useState(center.estado_capacidad);
  
  const [urgentes, setUrgentes] = useState(center.insumos_urgentes || []);
  const [urgentesInput, setUrgentesInput] = useState('');
  
  const [recibidos, setRecibidos] = useState(center.insumos_recibidos || []);
  const [recibidosInput, setRecibidosInput] = useState('');
  
  const [comentario, setComentario] = useState('');

  const handleKeyDown = (e, list, setList, input, setInput) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const val = input.trim();
      if (val && !list.includes(val)) {
        setList([...list, val]);
      }
      setInput('');
    } else if (e.key === 'Backspace' && input === '') {
      setList(list.slice(0, -1));
    }
  };

  const removeTag = (list, setList, indexToRemove) => {
    setList(list.filter((_, index) => index !== indexToRemove));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const finalUrgentes = [...urgentes];
    if (urgentesInput.trim() && !finalUrgentes.includes(urgentesInput.trim())) {
      finalUrgentes.push(urgentesInput.trim());
    }
    
    const finalRecibidos = [...recibidos];
    if (recibidosInput.trim() && !finalRecibidos.includes(recibidosInput.trim())) {
      finalRecibidos.push(recibidosInput.trim());
    }

    onSubmit({
      ...center,
      estado_capacidad: estado,
      insumos_urgentes: finalUrgentes,
      insumos_recibidos: finalRecibidos,
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
            <div 
              className="input-field"
              style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', minHeight: '45px', height: 'auto', padding: '0.5rem', alignItems: 'center', cursor: 'text' }}
              onClick={() => document.getElementById('urgentes-input')?.focus()}
            >
              {urgentes.map((insumo, index) => (
                <span key={index} className="badge badge-stable" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', textTransform: 'none', fontSize: '0.85rem' }}>
                  {insumo}
                  <button type="button" onClick={() => removeTag(urgentes, setUrgentes, index)} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', display: 'flex', padding: 0 }}>
                    <X size={14} />
                  </button>
                </span>
              ))}
              <input 
                id="urgentes-input"
                value={urgentesInput}
                onChange={(e) => setUrgentesInput(e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, urgentes, setUrgentes, urgentesInput, setUrgentesInput)}
                style={{ flex: 1, minWidth: '120px', background: 'transparent', border: 'none', outline: 'none', color: 'var(--text-primary)', fontSize: '0.95rem', fontFamily: 'inherit' }} 
                placeholder={urgentes.length === 0 ? "Ej. Agua, Medicinas (Presiona Enter)" : "Agregar otro..."}
              />
            </div>
            <small style={{ color: 'var(--text-secondary)' }}>Lo que el centro más necesita en este momento.</small>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Ya no necesitan (Capacidad Llena)</label>
            <div 
              className="input-field"
              style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', minHeight: '45px', height: 'auto', padding: '0.5rem', alignItems: 'center', cursor: 'text' }}
              onClick={() => document.getElementById('recibidos-input')?.focus()}
            >
              {recibidos.map((insumo, index) => (
                <span key={index} className="badge badge-tag" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', textTransform: 'none', fontSize: '0.85rem' }}>
                  {insumo}
                  <button type="button" onClick={() => removeTag(recibidos, setRecibidos, index)} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', display: 'flex', padding: 0 }}>
                    <X size={14} />
                  </button>
                </span>
              ))}
              <input 
                id="recibidos-input"
                value={recibidosInput}
                onChange={(e) => setRecibidosInput(e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, recibidos, setRecibidos, recibidosInput, setRecibidosInput)}
                style={{ flex: 1, minWidth: '120px', background: 'transparent', border: 'none', outline: 'none', color: 'var(--text-primary)', fontSize: '0.95rem', fontFamily: 'inherit' }} 
                placeholder={recibidos.length === 0 ? "Ej. Ropa de adulto (Presiona Enter)" : "Agregar otro..."}
              />
            </div>
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
