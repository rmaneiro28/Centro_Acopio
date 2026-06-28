import React, { useState, useEffect, useMemo } from 'react';
import FilterBar from './components/FilterBar';
import CenterCard from './components/CenterCard';
import UpdateModal from './components/UpdateModal';
import AddCenterModal from './components/AddCenterModal';
import GlobalMap from './components/GlobalMap';
import ApiDocsDashboard from './components/ApiDocsDashboard';
import { getCentros, updateCentro, addCentro } from './services/centrosService';
import { ShieldAlert, Loader2, Plus, Map, List, Code } from 'lucide-react';

function App() {
  const [centros, setCentros] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filters state
  const [activeTab, setActiveTab] = useState('centro_acopio');
  const [viewMode, setViewMode] = useState('list'); // 'list' | 'map'
  const [searchQuery, setSearchQuery] = useState('');
  const [municipio, setMunicipio] = useState('');
  const [necesidad, setNecesidad] = useState('');
  const [estadoFilter, setEstadoFilter] = useState('');

  // Modal state
  const [selectedCenter, setSelectedCenter] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // Simple Router State
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    const handlePopState = () => setCurrentPath(window.location.pathname);
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (path) => {
    window.history.pushState(null, '', path);
    setCurrentPath(path);
  };

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
      const isCorrectType = center.tipo === activeTab || (!center.tipo && activeTab === 'centro_acopio');
      
      const matchSearch = center.nombre.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          center.direccion.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchMunicipio = municipio ? center.municipio.toLowerCase().includes(municipio.toLowerCase()) : true;
      
      // Check if any urgent need contains the typed string
      const matchNecesidad = necesidad ? center.insumos_urgentes.some(insumo => 
        insumo.toLowerCase().includes(necesidad.toLowerCase())
      ) : true;

      const matchEstado = estadoFilter ? center.estado_capacidad === estadoFilter : true;
      
      return isCorrectType && matchSearch && matchMunicipio && matchNecesidad && matchEstado;
    });
  }, [centros, searchQuery, municipio, necesidad, estadoFilter, activeTab]);

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

  if (currentPath === '/v1/docs/api') {
    return <ApiDocsDashboard onClose={() => navigateTo('/')} />;
  }

  return (
    <div className="container">
      <header className="app-header animate-fade-in" style={{ position: 'relative' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem', alignItems: 'center', gap: '1rem' }}>
          <img src="/logo.png" alt="RedAyuda Logo" style={{ width: '64px', height: '64px', borderRadius: '16px', boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)' }} />
          <h1 className="app-title" style={{ margin: 0 }}>RedAyuda</h1>
        </div>
        <p className="app-subtitle">Encuentra dónde donar o ayudar cerca de ti. Información verificada por la comunidad.</p>
        
        <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <button 
            className="btn btn-primary" 
            onClick={() => setShowAddModal(true)}
          >
            <Plus size={18} /> Reportar Nuevo Lugar
          </button>
          <button 
            className="btn btn-outline" 
            onClick={() => navigateTo('/v1/docs/api')}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <Code size={18} /> API Developers
          </button>
        </div>

        {/* TABS */}
        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', marginTop: '2.5rem', flexWrap: 'wrap' }}>
          <button 
            className={`btn ${activeTab === 'centro_acopio' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setActiveTab('centro_acopio')}
          >
            📦 Centros de Acopio
          </button>
          <button 
            className={`btn ${activeTab === 'refugio' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setActiveTab('refugio')}
          >
            🏠 Refugios
          </button>
          <button 
            className={`btn ${activeTab === 'hospital' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setActiveTab('hospital')}
          >
            🏥 Hospitales / Clínicas
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
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ color: 'var(--text-secondary)' }}>
              Mostrando {filteredCentros.length} {activeTab === 'centro_acopio' ? 'centro(s) de acopio' : activeTab === 'refugio' ? 'refugio(s)' : 'hospital(es)'}
            </div>
            
            <div style={{ display: 'flex', background: 'rgba(255,255,255,0.1)', borderRadius: 'var(--radius-sm)', padding: '0.2rem' }}>
              <button 
                onClick={() => setViewMode('list')}
                style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.5rem 1rem', background: viewMode === 'list' ? 'var(--accent-color)' : 'transparent', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', transition: 'all 0.2s' }}
              >
                <List size={16} /> Lista
              </button>
              <button 
                onClick={() => setViewMode('map')}
                style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.5rem 1rem', background: viewMode === 'map' ? 'var(--accent-color)' : 'transparent', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', transition: 'all 0.2s' }}
              >
                <Map size={16} /> Mapa
              </button>
            </div>
          </div>
          
          {viewMode === 'map' ? (
            <GlobalMap centros={filteredCentros} onUpdateClick={setSelectedCenter} />
          ) : (
            <div className="grid-cards">
              {filteredCentros.map(center => (
                <CenterCard 
                  key={center.id} 
                  center={center} 
                  onUpdateClick={setSelectedCenter} 
                />
              ))}
            </div>
          )}

          {filteredCentros.length === 0 && (
            <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', marginTop: '2rem' }}>
              <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)' }}>No se encontraron {activeTab === 'centro_acopio' ? 'centros de acopio' : activeTab === 'refugio' ? 'refugios' : 'hospitales / clínicas'} que coincidan con tu búsqueda.</p>
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
