import React from 'react';
import { CustomCursor } from './components/CustomCursor';
import { ConstraintPanel } from './components/ConstraintPanel';
import { ModelList } from './components/ModelList';
import { ParticleBackground } from './components/ParticleBackground';

const App: React.FC = () => {
  return (
    <>
      <ParticleBackground />
      <CustomCursor />
      <div className="layout">
        <ModelList />
        <ConstraintPanel />
      </div>
    </>
  );
};

export default App;
