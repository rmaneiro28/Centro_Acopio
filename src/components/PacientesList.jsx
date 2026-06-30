import React, { useState, useEffect } from 'react';
import { getPacientesByCentro, addPaciente } from '../services/centrosService';
import { Loader2, UserPlus, Phone, MapPin, Activity } from 'lucide-react';

const PacientesList = ({ centroId }) => {
  const [pacientes, setPacientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    nombre_completo: '',
    edad: '',
    cedula: '',
    telefono_contacto: '',
    direccion: '',
    observaciones: '',
    estado_salud: 'estable'
  });

  useEffect(() => {
    loadPacientes();
  }, [centroId]);

  const loadPacientes = async () => {
    setLoading(true);
    try {
      const data = await getPacientesByCentro(centroId);
      setPacientes(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.nombre_completo.trim()) return alert('El nombre es obligatorio');
    
    try {
      const dataToSave = { ...formData, centro_id: centroId };
      if (!dataToSave.edad) delete dataToSave.edad;
      
      const newPaciente = await addPaciente(dataToSave);
      setPacientes([newPaciente, ...pacientes]);
      setShowForm(false);
      setFormData({
        nombre_completo: '', edad: '', cedula: '', telefono_contacto: '',
        direccion: '', observaciones: '', estado_salud: 'estable'
      });
    } catch (error) {
      alert('Error al registrar paciente');
    }
  };

  return (
    <div style={{ marginTop: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h4 style={{ margin: 0, color: 'var(--text-primary)', fontSize: '1.1rem' }}>Personas Ingresadas</h4>
        <button 
          type="button"
          onClick={() => setShowForm(!showForm)} 
          className="btn btn-outline" 
          style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem', display: 'flex', gap: '0.4rem', alignItems: 'center' }}
        >
          {showForm ? 'Cancelar Registro' : <><UserPlus size={16} /> Registrar Ingreso</>}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} style={{ background: 'rgba(255,255,255,0.02)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-color)', marginBottom: '1.5rem' }} className="animate-fade-in">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.5rem' }}>Nombre Completo *</label>
              <input className="input-field" value={formData.nombre_completo} onChange={e => setFormData({...formData, nombre_completo: e.target.value})} required placeholder="Ej. Orozco Yusbelis" />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.5rem' }}>Cédula / ID</label>
              <input className="input-field" value={formData.cedula} onChange={e => setFormData({...formData, cedula: e.target.value})} placeholder="Ej. 24.140.952" />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.5rem' }}>Edad</label>
              <input className="input-field" type="number" value={formData.edad} onChange={e => setFormData({...formData, edad: e.target.value})} placeholder="Ej. 35" />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.5rem' }}>Teléfono</label>
              <input className="input-field" value={formData.telefono_contacto} onChange={e => setFormData({...formData, telefono_contacto: e.target.value})} placeholder="Ej. 0412-9970844" />
            </div>
          </div>
          
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.5rem' }}>Estado de Salud</label>
            <select className="input-field" value={formData.estado_salud} onChange={e => setFormData({...formData, estado_salud: e.target.value})}>
              <option value="estable">Estable</option>
              <option value="critico">Crítico</option>
              <option value="alta">Dado de Alta</option>
              <option value="trasladado">Trasladado</option>
            </select>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.5rem' }}>Dirección / Zona de Procedencia</label>
            <input className="input-field" value={formData.direccion} onChange={e => setFormData({...formData, direccion: e.target.value})} placeholder="Ej. Santa Rosalia" />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.5rem' }}>Observaciones</label>
            <textarea className="input-field" rows="2" value={formData.observaciones} onChange={e => setFormData({...formData, observaciones: e.target.value})} placeholder="Notas médicas, familiares a contactar..."></textarea>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Guardar Registro de Persona</button>
        </form>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--accent-color)' }}><Loader2 className="animate-spin" style={{ margin: '0 auto' }}/></div>
      ) : pacientes.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-secondary)', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px dashed var(--border-color)' }}>
          <p style={{ margin: 0 }}>No hay personas registradas en este lugar.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', maxHeight: '400px', overflowY: 'auto', paddingRight: '0.5rem' }}>
          {pacientes.map(p => (
            <div key={p.id} style={{ background: '#1c232b', padding: '1.2rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.8rem', alignItems: 'center' }}>
                <strong style={{ fontSize: '1.1rem', color: 'var(--text-primary)' }}>{p.nombre_completo}</strong>
                <span className={`badge ${p.estado_salud === 'critico' ? 'badge-critical' : p.estado_salud === 'alta' ? 'badge-stable' : 'badge-tag'}`} style={{ textTransform: 'uppercase', fontSize: '0.75rem' }}>
                  {p.estado_salud}
                </span>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.8rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                {p.cedula && <div><strong style={{ color: '#8b949e' }}>CI:</strong> {p.cedula}</div>}
                {p.edad && <div><strong style={{ color: '#8b949e' }}>Edad:</strong> {p.edad} años</div>}
                {p.telefono_contacto && <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><Phone size={14} color="#8b949e"/> {p.telefono_contacto}</div>}
                {p.direccion && <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><MapPin size={14} color="#8b949e"/> {p.direccion}</div>}
              </div>
              
              {p.observaciones && (
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '1rem', padding: '0.8rem', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', fontStyle: 'italic' }}>
                  "{p.observaciones}"
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PacientesList;
