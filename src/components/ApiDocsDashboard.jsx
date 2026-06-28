import React, { useState } from 'react';
import { getCentros } from '../services/centrosService';
import {
  X, Code, Terminal, Server, Copy,
  Activity, Play, Check, ChevronRight,
  MapPin, Archive, ActivitySquare
} from 'lucide-react';
import './ApiDocsDashboard.css';

const ENDPOINTS = {
  get_centros: {
    id: 'get_centros',
    title: 'Obtener Lugares',
    description: '"Obtiene el catálogo completo de centros de acopio, refugios y hospitales. Esta es una API 100% pública que no requiere tokens de autenticación gracias a nuestro Proxy seguro."',
    method: 'GET',
    badgeClass: 'api-badge-get',
    url: 'https://redayudavzla.vercel.app/v1/centros_acopio',
    queryParams: [
      { key: 'select', type: 'STRING', desc: '(Opcional) Filtrar campos a devolver. Por defecto: *' },
      { key: 'tipo', type: 'STRING', desc: '(Opcional) Filtrar por centro_acopio, refugio o hospital.' }
    ],
    responseSchema: [
      { key: 'id', type: 'UUID', desc: 'Identificador único del registro.' },
      { key: 'nombre', type: 'STRING', desc: 'Nombre de la organización o lugar.' },
      { key: 'tipo', type: 'STRING', desc: 'Categoría del lugar de ayuda.' },
      { key: 'municipio', type: 'STRING', desc: 'Ubicación municipal.' },
      { key: 'estado_capacidad', type: 'STRING', desc: 'Estado actual: estable, critico, lleno.' },
      { key: 'insumos_urgentes', type: 'ARRAY', desc: 'Lista de insumos requeridos urgentemente.' }
    ],
    snippets: {
      JS: `fetch("https://redayudavzla.vercel.app/v1/centros_acopio?select=*")\n  .then(res => res.json())\n  .then(console.log);`,
      PYTHON: `import requests\n\nres = requests.get("https://redayudavzla.vercel.app/v1/centros_acopio?select=*")\nprint(res.json())`,
      CURL: `curl -X GET "https://redayudavzla.vercel.app/v1/centros_acopio?select=*"`
    }
  },
  post_centro: {
    id: 'post_centro',
    title: 'Reportar Lugar',
    description: '"Permite reportar un nuevo centro de acopio o refugio. Los datos pasan a formar parte de la base de datos pública al instante."',
    method: 'POST',
    badgeClass: 'api-badge-post',
    url: 'https://redayudavzla.vercel.app/v1/centros_acopio',
    queryParams: [],
    responseSchema: [
      { key: 'status', type: 'NUMBER', desc: '201 Created si la petición fue exitosa.' },
      { key: 'data', type: 'OBJECT', desc: 'El objeto completo creado en la base de datos.' }
    ],
    snippets: {
      JS: `fetch("https://redayudavzla.vercel.app/v1/centros_acopio", {\n  method: "POST",\n  headers: { "Content-Type": "application/json" },\n  body: JSON.stringify({ nombre: "Nuevo Centro", tipo: "refugio" })\n})`,
      PYTHON: `import requests\n\nrequests.post(\n  "https://redayudavzla.vercel.app/v1/centros_acopio", \n  json={"nombre": "Nuevo Centro"}\n)`,
      CURL: `curl -X POST "https://redayudavzla.vercel.app/v1/centros_acopio" \\\n -H "Content-Type: application/json" \\\n -d '{"nombre": "Nuevo Centro"}'`
    }
  },
  patch_centro: {
    id: 'patch_centro',
    title: 'Actualizar Estado',
    description: '"Permite actualizar la información de un lugar existente (por ejemplo, cambiar su capacidad a critico o actualizar insumos)."',
    method: 'PATCH',
    badgeClass: 'api-badge-patch',
    url: 'https://redayudavzla.vercel.app/v1/centros_acopio?id=eq.[TU_ID_AQUI]',
    queryParams: [
      { key: 'id', type: 'UUID', desc: '(Obligatorio) El ID del centro a actualizar usando el filtro eq.' }
    ],
    responseSchema: [
      { key: 'status', type: 'NUMBER', desc: '204 No Content si la actualización fue exitosa.' },
      { key: 'message', type: 'STRING', desc: 'Mensaje de éxito o error.' }
    ],
    snippets: {
      JS: `fetch("https://redayudavzla.vercel.app/v1/centros_acopio?id=eq.1234...", {\n  method: "PATCH",\n  headers: { "Content-Type": "application/json" },\n  body: JSON.stringify({ estado_capacidad: "critico" })\n})`,
      PYTHON: `import requests\n\nrequests.patch(\n  "https://redayudavzla.vercel.app/v1/centros_acopio?id=eq.1234...", \n  json={"estado_capacidad": "critico"}\n)`,
      CURL: `curl -X PATCH "https://redayudavzla.vercel.app/v1/centros_acopio?id=eq.1234..." \\\n -H "Content-Type: application/json" \\\n -d '{"estado_capacidad": "critico"}'`
    }
  }
};

const ApiDocsDashboard = ({ onClose }) => {
  const [activeEndpoint, setActiveEndpoint] = useState('get_centros');
  const [activeTab, setActiveTab] = useState('JS');
  const [copied, setCopied] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [response, setResponse] = useState(null);

  const endpoint = ENDPOINTS[activeEndpoint];

  const handleCopy = () => {
    navigator.clipboard.writeText(endpoint.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRun = async () => {
    setIsRunning(true);
    setResponse(null);
    try {
      if (activeEndpoint === 'get_centros') {
        const data = await getCentros();
        // Mostrar los primeros 3 items para no saturar la vista
        setResponse(JSON.stringify(data.slice(0, 3), null, 2));
      } else if (activeEndpoint === 'post_centro') {
        // Respuesta simulada para POST para no escribir basura en BD
        setTimeout(() => {
          setResponse(JSON.stringify({ 
            status: 201,
            message: "Registro creado exitosamente (Mock)", 
            data: { id: "123e4567-e89b-12d3-a456-426614174000", nombre: "Nuevo Centro" }
          }, null, 2));
          setIsRunning(false);
        }, 1200);
        return;
      } else {
        // PATCH simulado
        setTimeout(() => {
          setResponse(JSON.stringify({ 
            status: 204,
            message: "Estado actualizado exitosamente (Mock)"
          }, null, 2));
          setIsRunning(false);
        }, 1000);
        return;
      }
    } catch (e) {
      setResponse(JSON.stringify({ error: e.message }, null, 2));
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="api-dashboard animate-fade-in">
      {/* Sidebar */}
      <div className="api-sidebar">
        <div className="api-sidebar-brand">
          <Code size={24} color="#0bd486" />
          RedAyuda <span>API</span>
        </div>

        <div className="api-sidebar-menu">
          <div className="api-sidebar-label">Arquitectura</div>
          <div className="api-menu-item" style={{ cursor: 'default' }}>
            <ActivitySquare size={16} /> Estado: Operativo
            <span style={{ width: 8, height: 8, background: '#0bd486', borderRadius: '50%', marginLeft: 'auto', boxShadow: '0 0 8px #0bd486' }}></span>
          </div>

          <div className="api-sidebar-label" style={{ marginTop: '1.5rem' }}>Endpoints</div>
          <div
            className={`api-menu-item ${activeEndpoint === 'get_centros' ? 'active' : ''}`}
            onClick={() => { setActiveEndpoint('get_centros'); setResponse(null); }}
          >
            <MapPin size={16} /> Obtener Lugares
          </div>
          <div 
            className={`api-menu-item ${activeEndpoint === 'post_centro' ? 'active' : ''}`}
            onClick={() => { setActiveEndpoint('post_centro'); setResponse(null); }}
          >
            <Archive size={16} /> Reportar Lugar
          </div>
          <div 
            className={`api-menu-item ${activeEndpoint === 'patch_centro' ? 'active' : ''}`}
            onClick={() => { setActiveEndpoint('patch_centro'); setResponse(null); }}
          >
            <Activity size={16} /> Actualizar Estado
          </div>

          <div className="api-sidebar-label" style={{ marginTop: '1.5rem' }}>Proyecto</div>
          <a href="https://github.com/rmaneiro28" target="_blank" rel="noopener noreferrer" className="api-menu-item" style={{ textDecoration: 'none' }}>
            Desarrollador
          </a>
          <a href="https://github.com/rmaneiro28/Centro_Acopio" target="_blank" rel="noopener noreferrer" className="api-menu-item" style={{ textDecoration: 'none' }}>
            Repositorio & Wiki
          </a>
        </div>
      </div>

      {/* Main Content */}
      <div className="api-main">
        <button className="api-close-btn" onClick={onClose}>
          <X size={16} /> Volver a la App
        </button>

        <h1 className="api-title">{endpoint.title}</h1>
        <p className="api-description">
          {endpoint.description}
          <br /><br />
          <span style={{ color: '#0bd486', fontSize: '0.85rem', fontWeight: 600, border: '1px solid #0bd486', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>✓ API PÚBLICA (NO REQUIERE API-KEY)</span>
        </p>

        <div className="api-section-title">
          <Code size={14} /> Endpoint API
        </div>
        <div className="api-endpoint-box">
          <div className="api-endpoint-url">
            <span className={endpoint.badgeClass}>{endpoint.method}</span>
            {endpoint.url}
          </div>
          <button className="api-copy-btn" onClick={handleCopy} title="Copiar URL">
            {copied ? <Check size={18} color="#0bd486" /> : <Copy size={18} />}
          </button>
        </div>

        <div className="api-section-title">Parámetros de Consulta (Query)</div>
        <div className="api-table-wrapper">
          <table className="api-table">
            <thead>
              <tr>
                <th>Campo</th>
                <th>Tipo</th>
                <th>Info</th>
              </tr>
            </thead>
            <tbody>
              {endpoint.queryParams.length === 0 ? (
                <tr><td colSpan="3" style={{ textAlign: 'center', color: '#8b949e' }}>Ninguno requerido</td></tr>
              ) : (
                endpoint.queryParams.map((param, i) => (
                  <tr key={i}>
                    <td className="api-table-key">{param.key}</td>
                    <td className="api-table-type">{param.type}</td>
                    <td>{param.desc}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="api-section-title">Esquema de Respuesta (JSON)</div>
        <div className="api-table-wrapper">
          <table className="api-table">
            <thead>
              <tr>
                <th>Clave</th>
                <th>Tipo</th>
                <th>Descripción</th>
              </tr>
            </thead>
            <tbody>
              {endpoint.responseSchema.map((schema, i) => (
                <tr key={i}>
                  <td className="api-table-key">{schema.key}</td>
                  <td className="api-table-type">{schema.type}</td>
                  <td>{schema.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Sandbox */}
      <div className="api-sandbox">
        <div className="api-sandbox-header">
          <ChevronRight size={16} color="#0bd486" /> LIVE SANDBOX CONSOLE
        </div>

        <div className="api-sandbox-content">
          <div className="api-tabs">
            {['JS', 'PYTHON', 'CURL'].map(tab => (
              <button
                key={tab}
                className={`api-tab-btn ${activeTab === tab ? 'active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="api-code-block">
            <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
              {endpoint.snippets[activeTab]}
            </pre>
          </div>

          <button
            className="api-run-btn"
            onClick={handleRun}
            disabled={isRunning}
          >
            {isRunning ? <Activity size={18} className="animate-spin" /> : <Play size={18} fill="currentColor" />}
            RUN ENDPOINT
          </button>

          <div className="api-section-title" style={{ marginTop: 'auto' }}>Response Payload</div>
          <div className="api-response-wrapper">
            {response ? (
              <div className="api-response-content api-response-json">
                {response}
              </div>
            ) : (
              <div className="api-response-content" style={{ flexDirection: 'column', gap: '1rem', opacity: 0.5 }}>
                <Activity size={32} />
                WAITING FOR TRANSMISSION...
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiDocsDashboard;
