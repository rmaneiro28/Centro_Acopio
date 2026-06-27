import React, { useState } from 'react';
import { X, Send, Plus, MapPin } from 'lucide-react';
import MapSelector from './MapSelector';

const AddCenterModal = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    municipio: '',
    direccion: '',
    contacto_telefono: '',
    estado_capacidad: 'estable',
    insumos_urgentes: []
  });
  
  const [insumoInput, setInsumoInput] = useState('');
  const [coordinates, setCoordinates] = useState(null);
  const [isGeocoding, setIsGeocoding] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePhoneChange = (e) => {
    let input = e.target.value;
    
    // If the user is deleting the dash/space, allow it to process naturally by removing the last digit if they hit backspace on a separator
    // But a simple format approach:
    let cleaned = input.replace(/[^\d+]/g, '');
    let formatted = cleaned;

    if (cleaned.startsWith('+58')) {
      const rest = cleaned.slice(3);
      if (rest.length > 3) {
        formatted = `+58 ${rest.slice(0,3)}-${rest.slice(3,10)}`;
      } else if (rest.length > 0) {
        formatted = `+58 ${rest}`;
      }
    } else if (cleaned.startsWith('0')) {
      if (cleaned.length > 4) {
        formatted = `${cleaned.slice(0,4)}-${cleaned.slice(4,11)}`;
      }
    }

    setFormData(prev => ({ ...prev, contacto_telefono: formatted }));
  };

  const handleInsumoKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const val = insumoInput.trim();
      if (val && !formData.insumos_urgentes.includes(val)) {
        setFormData(prev => ({
          ...prev,
          insumos_urgentes: [...prev.insumos_urgentes, val]
        }));
      }
      setInsumoInput('');
    } else if (e.key === 'Backspace' && insumoInput === '') {
      setFormData(prev => ({
        ...prev,
        insumos_urgentes: prev.insumos_urgentes.slice(0, -1)
      }));
    }
  };

  const removeInsumo = (indexToRemove) => {
    setFormData(prev => ({
      ...prev,
      insumos_urgentes: prev.insumos_urgentes.filter((_, index) => index !== indexToRemove)
    }));
  };

  const handleLocationSelected = async (latlng) => {
    setCoordinates(latlng);
    setIsGeocoding(true);
    
    try {
      // Reverse geocoding with Nominatim (OpenStreetMap)
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latlng.lat}&lon=${latlng.lng}&zoom=18&addressdetails=1`);
      const data = await response.json();
      
      if (data && data.address) {
        const address = data.address;
        
        // Auto-fill Municipio if not set or just append to address
        const cityOrTown = address.city || address.town || address.village || address.county || '';
        if (cityOrTown && !formData.municipio) {
          setFormData(prev => ({ ...prev, municipio: cityOrTown }));
        }

        // Build a readable address string
        const street = address.road || '';
        const house = address.house_number || '';
        const suburb = address.suburb || address.neighbourhood || '';
        
        let newDir = [street, house, suburb].filter(Boolean).join(', ');
        if (!newDir) newDir = data.display_name; // fallback to full string

        setFormData(prev => ({ ...prev, direccion: newDir }));
      }
    } catch (error) {
      console.error("Error reverse geocoding:", error);
    } finally {
      setIsGeocoding(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Add any remaining text in the input as an insumo before submitting
    const finalInsumos = [...formData.insumos_urgentes];
    if (insumoInput.trim() && !finalInsumos.includes(insumoInput.trim())) {
      finalInsumos.push(insumoInput.trim());
    }

    const newCenter = {
      id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(),
      nombre: formData.nombre,
      municipio: formData.municipio,
      direccion: formData.direccion,
      contacto_telefono: formData.contacto_telefono,
      estado_capacidad: formData.estado_capacidad,
      insumos_urgentes: finalInsumos,
      insumos_recibidos: [],
      verificado: false,
      latitud: coordinates ? coordinates.lat : null,
      longitud: coordinates ? coordinates.lng : null,
      ultima_actualizacion: new Date().toISOString()
    };

    onSubmit(newCenter);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="glass-panel modal-content animate-fade-in" onClick={e => e.stopPropagation()} style={{ padding: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1.5rem', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Plus size={24} color="var(--accent-color)" /> Reportar Nuevo Centro
          </h3>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          
          {/* MAP SECTION */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', fontWeight: 500 }}>
              <MapPin size={18} color="var(--accent-color)" />
              Ubicación en el Mapa (Opcional pero recomendado)
            </label>
            <MapSelector onLocationSelected={handleLocationSelected} />
            {isGeocoding && <small style={{ color: 'var(--accent-color)', display: 'block', marginTop: '0.5rem' }}>Obteniendo dirección de las coordenadas...</small>}
          </div>

          <div style={{ marginBottom: '1.2rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Nombre de la Organización / Lugar *</label>
            <input 
              required
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              className="input-field" 
              placeholder="Ej. Iglesia San José, Grupo Scout..."
            />
          </div>

          <div style={{ marginBottom: '1.2rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Dirección Exacta *</label>
            <textarea 
              required
              name="direccion"
              value={formData.direccion}
              onChange={handleChange}
              className="input-field" 
              rows="2" 
              placeholder="Ej. Av. Principal, al lado de la panadería..."
              style={{ resize: 'vertical' }}
            ></textarea>
            <small style={{ color: 'var(--text-secondary)' }}>Haz clic en el mapa para autocompletar la dirección.</small>
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.2rem' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Municipio / Zona *</label>
              <input 
                required
                name="municipio"
                value={formData.municipio}
                onChange={handleChange}
                className="input-field" 
                placeholder="Ej. Chacao"
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Teléfono de Contacto</label>
              <input 
                name="contacto_telefono"
                value={formData.contacto_telefono}
                onChange={handlePhoneChange}
                className="input-field" 
                placeholder="Ej. +58 414-XXXXXXX"
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.2rem' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Estado Actual</label>
              <select 
                name="estado_capacidad"
                value={formData.estado_capacidad}
                onChange={handleChange}
                className="input-field"
              >
                <option value="estable">✅ Estable</option>
                <option value="critico">🚨 Crítico</option>
                <option value="lleno">🛑 Lleno</option>
              </select>
            </div>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Insumos Urgentes</label>
            <div 
              className="input-field"
              style={{ 
                display: 'flex', 
                flexWrap: 'wrap', 
                gap: '0.5rem', 
                minHeight: '45px',
                height: 'auto',
                padding: '0.5rem',
                alignItems: 'center',
                cursor: 'text'
              }}
              onClick={() => document.getElementById('insumo-input')?.focus()}
            >
              {formData.insumos_urgentes.map((insumo, index) => (
                <span key={index} className="badge badge-stable" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', textTransform: 'none', fontSize: '0.85rem' }}>
                  {insumo}
                  <button type="button" onClick={() => removeInsumo(index)} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', display: 'flex', padding: 0 }}>
                    <X size={14} />
                  </button>
                </span>
              ))}
              <input 
                id="insumo-input"
                value={insumoInput}
                onChange={(e) => setInsumoInput(e.target.value)}
                onKeyDown={handleInsumoKeyDown}
                style={{ 
                  flex: 1, 
                  minWidth: '120px', 
                  background: 'transparent', 
                  border: 'none', 
                  outline: 'none', 
                  color: 'var(--text-primary)',
                  fontSize: '0.95rem',
                  fontFamily: 'inherit'
                }} 
                placeholder={formData.insumos_urgentes.length === 0 ? "Ej. Agua, Medicinas (Presiona Enter o Coma)" : "Agregar otro..."}
              />
            </div>
            <small style={{ color: 'var(--text-secondary)' }}>Escribe un insumo y presiona <b>Enter</b> o <b>Coma</b> para agregarlo. Puedes agregar varios.</small>
          </div>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '2rem' }}>
            <button type="button" onClick={onClose} className="btn btn-outline">
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary">
              <Send size={16} /> Enviar Reporte
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCenterModal;
