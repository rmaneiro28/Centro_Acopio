import React, { useState, useEffect } from 'react';
import { Search, Loader2, Users } from 'lucide-react';
import { searchPacientes, getPacientesFiltrados } from '../services/centrosService';
import PacienteCard from './PacienteCard';
import UpdateModal from './UpdateModal';
import { getCentros } from '../services/centrosService'; // For resolving center object when clicking

const PersonasView = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedHospitalId, setSelectedHospitalId] = useState('');
  const [estadoFilter, setEstadoFilter] = useState('');
  const [edadRangoFilter, setEdadRangoFilter] = useState('');
  const [sortBy, setSortBy] = useState('');
  
  const [pacientes, setPacientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  
  // For center modal when clicking on a hospital in the patient card
  const [selectedCenter, setSelectedCenter] = useState(null);
  const [centrosCache, setCentrosCache] = useState([]);

  // Load initial patients
  useEffect(() => {
    const fetchInitial = async () => {
      setLoading(true);
      try {
        const data = await getPacientesFiltrados({ limit: 50 });
        setPacientes(data);
        
        // Also pre-fetch centros to resolve clicks efficiently
        const centros = await getCentros();
        setCentrosCache(centros);
      } catch (error) {
        console.error("Error fetching initial pacientes:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchInitial();
  }, []);

  // Handle Search & Filtering
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      setSearching(true);
      try {
        let results = [];
        if (searchTerm.trim() === '') {
          // Usar API robusta de filtrado y ordenamiento de Supabase
          results = await getPacientesFiltrados({
            limit: 50,
            hospitalId: selectedHospitalId,
            estado: estadoFilter,
            edadRango: edadRangoFilter,
            sortBy: sortBy
          });
        } else {
          // Para texto, usamos RPC (Fuzzy Search) y luego aplicamos filtros locales a los mejores matches
          results = await searchPacientes(searchTerm.trim());
          
          if (selectedHospitalId) results = results.filter(p => p.centro_id === selectedHospitalId);
          
          if (estadoFilter) {
            results = results.filter(p => p.estado_salud?.toLowerCase() === estadoFilter);
          }
          
          if (edadRangoFilter) {
            results = results.filter(p => {
              if (p.edad === null) return false;
              if (edadRangoFilter === 'infantil') return p.edad >= 0 && p.edad <= 12;
              if (edadRangoFilter === 'adolescente') return p.edad >= 13 && p.edad <= 17;
              if (edadRangoFilter === 'adulto') return p.edad >= 18 && p.edad <= 59;
              if (edadRangoFilter === 'mayor') return p.edad >= 60;
              return true;
            });
          }

          // Ordenamiento Local
          if (sortBy === 'nombre_asc') results.sort((a, b) => a.nombre_completo.localeCompare(b.nombre_completo));
          else if (sortBy === 'nombre_desc') results.sort((a, b) => b.nombre_completo.localeCompare(a.nombre_completo));
          else if (sortBy === 'edad_asc') results.sort((a, b) => (a.edad || 0) - (b.edad || 0));
          else if (sortBy === 'edad_desc') results.sort((a, b) => (b.edad || 0) - (a.edad || 0));
        }
        setPacientes(results);
      } catch (error) {
        console.error("Error searching:", error);
      } finally {
        setSearching(false);
      }
    }, 400); // 400ms debounce

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, selectedHospitalId, estadoFilter, edadRangoFilter, sortBy]);

  const handleCenterClick = (centroId) => {
    const center = centrosCache.find(c => c.id === centroId);
    if (center) {
      setSelectedCenter(center);
    }
  };

  return (
    <div className="animate-fade-in" style={{ padding: '0 1rem' }}>
      
      {/* Search Header */}
      <div style={{ maxWidth: '800px', margin: '0 auto 2rem auto', textAlign: 'center' }}>
        <h2 style={{ color: 'var(--text-primary)', marginBottom: '1rem', fontSize: '1.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
          <Users style={{ color: 'var(--accent-color)' }} /> Búsqueda de Personas
        </h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
          Encuentra personas ingresadas en hospitales y refugios. Puedes buscar por nombre o cédula. (Búsqueda tolerante a errores ortográficos).
        </p>

        <div style={{ position: 'relative', maxWidth: '600px', margin: '0 auto' }}>
          <Search size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
          <input 
            type="text" 
            className="input-field" 
            placeholder="Ej. Juan Pérez o 24555888"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ paddingLeft: '3rem', paddingRight: '3rem', fontSize: '1.1rem', height: '54px', borderRadius: '12px' }}
            autoFocus
          />
          {searching && (
            <Loader2 size={20} className="animate-spin" style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--accent-color)' }} />
          )}
        </div>

        <div style={{ maxWidth: '800px', margin: '1rem auto 0 auto', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <select 
            className="input-field" 
            value={selectedHospitalId} 
            onChange={(e) => setSelectedHospitalId(e.target.value)}
            style={{ flex: '1 1 200px', borderRadius: '12px', height: '48px', appearance: 'none', background: 'var(--glass-bg)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
          >
            <option value="">🏥 Todos los lugares</option>
            {centrosCache
              .filter(c => c.tipo === 'hospital' || c.tipo === 'refugio')
              .map(c => (
                <option key={c.id} value={c.id}>{c.nombre}</option>
              ))
            }
          </select>
          
          <select 
            className="input-field" 
            value={estadoFilter} 
            onChange={(e) => setEstadoFilter(e.target.value)}
            style={{ flex: '1 1 120px', borderRadius: '12px', height: '48px', appearance: 'none', background: 'var(--glass-bg)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
          >
            <option value="">❤️ Estatus (Todos)</option>
            <option value="estable">Estable</option>
            <option value="delicado">Delicado</option>
            <option value="critico">Crítico / Fallecida</option>
          </select>
          
          <select 
            className="input-field" 
            value={edadRangoFilter} 
            onChange={(e) => setEdadRangoFilter(e.target.value)}
            style={{ flex: '1 1 150px', borderRadius: '12px', height: '48px', appearance: 'none', background: 'var(--glass-bg)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
          >
            <option value="">🎂 Edad (Todas)</option>
            <option value="infantil">Infantil (0-12)</option>
            <option value="adolescente">Adolescentes (13-17)</option>
            <option value="adulto">Adultos (18-59)</option>
            <option value="mayor">Adultos Mayores (60+)</option>
          </select>

          <select 
            className="input-field" 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            style={{ flex: '1 1 150px', borderRadius: '12px', height: '48px', appearance: 'none', background: 'var(--glass-bg)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
          >
            <option value="">⏱️ Más Recientes</option>
            <option value="nombre_asc">Nombre (A - Z)</option>
            <option value="nombre_desc">Nombre (Z - A)</option>
            <option value="edad_asc">Edad (Menor a Mayor)</option>
            <option value="edad_desc">Edad (Mayor a Menor)</option>
          </select>
        </div>
      </div>

      {/* Grid Content */}
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem', color: 'var(--accent-color)' }}>
          <Loader2 size={40} className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} />
        </div>
      ) : (
        <>
          <div style={{ color: 'var(--text-secondary)', marginBottom: '1rem', textAlign: 'center' }}>
            {searchTerm || selectedHospitalId || estadoFilter || edadRangoFilter || sortBy 
              ? `Resultados encontrados: ${pacientes.length}` 
              : `Mostrando últimos 50 registros`}
          </div>

          {pacientes.length === 0 ? (
            <div className="glass-panel" style={{ padding: '4rem 2rem', textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
              <div style={{ 
                width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', 
                display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem auto' 
              }}>
                <Search size={32} style={{ color: 'var(--text-secondary)' }} />
              </div>
              <h3 style={{ fontSize: '1.2rem', margin: '0 0 0.5rem 0' }}>No se encontraron pacientes</h3>
              <p style={{ color: 'var(--text-secondary)' }}>
                No hay resultados para "{searchTerm}". Prueba buscar con otro nombre o asegúrate de que la persona haya sido registrada.
              </p>
            </div>
          ) : (
            <div className="grid-cards">
              {pacientes.map(paciente => (
                <PacienteCard 
                  key={paciente.id} 
                  paciente={paciente} 
                  onCenterClick={handleCenterClick}
                />
              ))}
            </div>
          )}
        </>
      )}

      {/* Modal para ver detalles del hospital si se hace clic desde la tarjeta del paciente */}
      {selectedCenter && (
        <UpdateModal 
          center={selectedCenter} 
          onClose={() => setSelectedCenter(null)} 
          onSubmit={() => setSelectedCenter(null)} // Dummy submit for view-only
        />
      )}
    </div>
  );
};

export default PersonasView;
