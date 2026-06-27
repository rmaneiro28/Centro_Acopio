import React, { useState, useEffect, useMemo } from 'react';
import FilterBar from './components/FilterBar';
import CenterCard from './components/CenterCard';
import UpdateModal from './components/UpdateModal';
import AddCenterModal from './components/AddCenterModal';
import { getCentros, updateCentro, addCentro } from './services/centrosService';
import { ShieldAlert, Loader2, Plus } from 'lucide-react';

function App() {
  const [centros, setCentros] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [municipio, setMunicipio] = useState('');
  const [necesidad, setNecesidad] = useState('');
  const [estadoFilter, setEstadoFilter] = useState('');

  // Modal state
  const [selectedCenter, setSelectedCenter] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    // Attempt to load from localStorage first for instant offline feel
    const cachedData = localStorage.getItem('centrosAcopioData');
    if (cachedData) {
      setCentros(JSON.parse(cachedData));
      // We don't set loading to false here so the UI can silently update when fresh data arrives
    }

    // Fetch fresh data from Supabase
    const fetchCentros = async () => {
      try {
        const data = await getCentros();
        setCentros(data);
        localStorage.setItem('centrosAcopioData', JSON.stringify(data));
      } catch (error) {
        console.error("Error fetching centros:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCentros();
  }, []);

  const filteredCentros = useMemo(() => {
    return centros.filter(center => {
      const matchSearch = center.nombre.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          center.direccion.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchMunicipio = municipio ? center.municipio.toLowerCase().includes(municipio.toLowerCase()) : true;
      
      // Check if any urgent need contains the typed string
      const matchNecesidad = necesidad ? center.insumos_urgentes.some(insumo => 
        insumo.toLowerCase().includes(necesidad.toLowerCase())
      ) : true;

      const matchEstado = estadoFilter ? center.estado_capacidad === estadoFilter : true;
      
      return matchSearch && matchMunicipio && matchNecesidad && matchEstado;
    });
  }, [centros, searchQuery, municipio, necesidad, estadoFilter]);

  const handleUpdateSubmit = async (updatedCenter) => {
    try {
      const { id, ...dataToUpdate } = updatedCenter;
      // We update estado and priorities
      const savedData = await updateCentro(id, { 
        estado_capacidad: dataToUpdate.estado_capacidad,
        insumos_urgentes: dataToUpdate.insumos_urgentes,
        insumos_recibidos: dataToUpdate.insumos_recibidos,
        ultima_actualizacion: dataToUpdate.ultima_actualizacion 
      });
      
      const newCentros = centros.map(c => c.id === id ? { ...c, ...savedData } : c);
      setCentros(newCentros);
      localStorage.setItem('centrosAcopioData', JSON.stringify(newCentros));
    } catch (error) {
      console.error("Error al actualizar:", error);
      alert("Hubo un error al actualizar el estado.");
    } finally {
      setSelectedCenter(null);
    }
  };

  const handleAddSubmit = async (newCenter) => {
    try {
      const savedData = await addCentro(newCenter);
      const newCentros = [savedData, ...centros];
      setCentros(newCentros);
      localStorage.setItem('centrosAcopioData', JSON.stringify(newCentros));
    } catch (error) {
      console.error("Error al agregar:", error);
      alert("Hubo un error al agregar el centro.");
    } finally {
      setShowAddModal(false);
    }
  };

  return (
    <div className="container">
      <header className="app-header animate-fade-in" style={{ position: 'relative' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem', alignItems: 'center', gap: '1rem' }}>
          <img src="/logo.png" alt="AcopioActivo Logo" style={{ width: '64px', height: '64px', borderRadius: '16px', boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)' }} />
          <h1 className="app-title" style={{ margin: 0 }}>AcopioActivo</h1>
        </div>
        <p className="app-subtitle">Encuentra dónde donar o ayudar cerca de ti. Información verificada por la comunidad.</p>
        
        <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'center' }}>
          <button 
            className="btn btn-primary" 
            onClick={() => setShowAddModal(true)}
          >
            <Plus size={18} /> Reportar Nuevo Centro
          </button>
        </div>
      </header>

      <FilterBar 
        onSearchChange={setSearchQuery}
        onMunicipioChange={setMunicipio}
        onNecesidadChange={setNecesidad}
        onEstadoChange={setEstadoFilter}
      />

      {loading && centros.length === 0 ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem', color: 'var(--accent-color)' }}>
          <Loader2 size={40} className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} />
        </div>
      ) : (
        <>
          <div style={{ marginBottom: '1rem', color: 'var(--text-secondary)' }}>
            Mostrando {filteredCentros.length} centro(s) de acopio
          </div>
          
          <div className="grid-cards">
            {filteredCentros.map(center => (
              <CenterCard 
                key={center.id} 
                center={center} 
                onUpdateClick={setSelectedCenter} 
              />
            ))}
          </div>

          {filteredCentros.length === 0 && (
            <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', marginTop: '2rem' }}>
              <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)' }}>No se encontraron centros de acopio que coincidan con tu búsqueda.</p>
            </div>
          )}
        </>
      )}

      {selectedCenter && (
        <UpdateModal 
          center={selectedCenter} 
          onClose={() => setSelectedCenter(null)} 
          onSubmit={handleUpdateSubmit} 
        />
      )}

      {showAddModal && (
        <AddCenterModal 
          onClose={() => setShowAddModal(false)}
          onSubmit={handleAddSubmit}
        />
      )}
    </div>
  );
}

export default App;
