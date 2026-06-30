import React from 'react';
import { MapPin, Users, Plus, Code } from 'lucide-react';

const TopNavbar = ({ mainSection, setMainSection, onReportClick, onApiClick }) => {
  return (
    <nav className="top-navbar">
      {/* Brand (Left) */}
      <div className="navbar-brand" onClick={() => window.location.reload()}>
        <img src="/logo.png" alt="RedAyuda Logo" />
        <h1>RedAyuda</h1>
      </div>

      {/* Center Links (Desktop only) */}
      <div className="navbar-center-links">
        <button 
          className={`nav-pill ${mainSection === 'lugares' ? 'active' : ''}`}
          onClick={() => setMainSection('lugares')}
        >
          <MapPin size={18} /> Lugares
        </button>
        <button 
          className={`nav-pill ${mainSection === 'personas' ? 'active' : ''}`}
          onClick={() => setMainSection('personas')}
        >
          <Users size={18} /> Personas
        </button>
      </div>

      {/* Actions (Right) */}
      <div className="navbar-actions">
        <button className="btn btn-primary" onClick={onReportClick}>
          <Plus size={18} /> Reportar Lugar
        </button>
        <button className="btn btn-outline" onClick={onApiClick} title="API Developers">
          <Code size={18} />
        </button>
      </div>
    </nav>
  );
};

export default TopNavbar;
