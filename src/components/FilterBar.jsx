import React from 'react';
import { Search, Map, Filter } from 'lucide-react';

const FilterBar = ({ onSearchChange, onMunicipioChange, onNecesidadChange, onEstadoChange }) => {
  return (
    <div className="glass-panel" style={{ padding: '1rem', marginBottom: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        
        {/* Búsqueda Global */}
        <div style={{ flex: '1 1 300px', position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
          <input 
            type="text" 
            className="input-field" 
            placeholder="Buscar por nombre o dirección..." 
            style={{ paddingLeft: '2.5rem' }}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        {/* Filtro Municipio */}
        <div style={{ flex: '1 1 150px', position: 'relative' }}>
          <Map size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
          <input 
            type="text" 
            className="input-field" 
            placeholder="Municipio (Ej. Chacao)" 
            style={{ paddingLeft: '2.5rem' }}
            onChange={(e) => onMunicipioChange(e.target.value)}
          />
        </div>

        {/* Filtro Necesidad */}
        <div style={{ flex: '1 1 200px', position: 'relative' }}>
          <Filter size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
          <input 
            type="text" 
            className="input-field" 
            placeholder="¿Qué deseas donar? (Ej. Agua, Ropa)" 
            style={{ paddingLeft: '2.5rem' }}
            onChange={(e) => onNecesidadChange(e.target.value)}
          />
        </div>

        {/* Filtro Estado */}
        <div style={{ flex: '1 1 150px', position: 'relative' }}>
          <select 
            className="input-field" 
            onChange={(e) => onEstadoChange(e.target.value)}
            defaultValue=""
          >
            <option value="">Todos los Estados</option>
            <option value="critico">Solo Críticos 🚨</option>
            <option value="estable">Estables ✅</option>
            <option value="lleno">Llenos 🛑</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
