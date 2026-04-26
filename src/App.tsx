import React from 'react';
import { ConstraintPanel } from './components/ConstraintPanel';
import { ModelList } from './components/ModelList';
import { CustomCursor } from './components/CustomCursor';
import { ParticleBackground } from './components/ParticleBackground';

const TopBranding = () => (
  <div style={{
    position: 'fixed',
    top: '32px',
    left: 0,
    right: 0,
    zIndex: 5,
    pointerEvents: 'none',
    userSelect: 'none',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    filter: 'drop-shadow(0 0 15px rgba(255,255,255,0.1))'
  }}>
    <a 
      href="https://knightaiav.com" 
      target="_blank" 
      rel="noopener noreferrer"
      className="brand-group"
      style={{
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        gap: '6px', 
        pointerEvents: 'auto', 
        cursor: 'none',
        textDecoration: 'none'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span className="font-display brand-title" style={{ letterSpacing: '0.4em', fontSize: '1rem', fontWeight: 300, color: 'rgba(255,255,255,0.8)', transition: 'all 0.5s ease' }}>
          KNIGHT<span className="brand-accent" style={{ color: 'var(--accent)', fontWeight: 500, marginLeft: '4px', letterSpacing: '0.4em', transition: 'color 0.5s ease' }}>ΛI+ΛV</span>
        </span>
      </div>
      <span className="font-display" style={{ letterSpacing: '0.3em', fontSize: '0.55rem', textTransform: 'uppercase', fontWeight: 300, color: 'rgba(255,255,255,0.5)', transition: 'all 0.5s ease' }}>
        Designed by <span style={{ color: 'rgba(255,255,255,0.9)' }}>MΛYOWΛ ΛLΛKETU</span>
      </span>
    </a>
  </div>
);

function App() {
  return (
    <>
      <CustomCursor />
      <ParticleBackground />
      <TopBranding />
      <div className="layout" style={{ paddingTop: '100px' }}>
        <div className="constraint-panel-wrapper">
          <ConstraintPanel />
        </div>
        <div className="model-list-wrapper">
          <ModelList />
        </div>
      </div>
    </>
  );
}

export default App;
