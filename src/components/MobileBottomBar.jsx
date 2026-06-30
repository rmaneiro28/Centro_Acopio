import React from 'react';
import { MapPin, Users, Plus, Code } from 'lucide-react';

const MobileBottomBar = ({ mainSection, setMainSection, onReportClick, onApiClick }) => {
  return (
    <nav className="mobile-bottom-bar">
      <button 
        className={`tab-btn ${mainSection === 'lugares' ? 'active' : ''}`}
        onClick={() => setMainSection('lugares')}
      >
        <MapPin size={24} />
        Lugares
      </button>
      
      <button 
        className={`tab-btn ${mainSection === 'personas' ? 'active' : ''}`}
        onClick={() => setMainSection('personas')}
      >
        <Users size={24} />
        Personas
      </button>

      <button className="tab-btn" onClick={onReportClick}>
        <div style={{ background: 'var(--accent-color)', color: 'white', padding: '0.5rem', borderRadius: '50%', marginTop: '-15px', marginBottom: '2px', boxShadow: '0 4px 12px rgba(59, 130, 246, 0.4)' }}>
          <Plus size={24} />
        </div>
        Reportar
      </button>

      <button className="tab-btn" onClick={onApiClick}>
        <Code size={24} />
        API
      </button>
    </nav>
  );
};

export default MobileBottomBar;
