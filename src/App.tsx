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
        <div className="constraint-panel-wrapper">
          <ConstraintPanel />
        </div>
        <div className="model-list-wrapper">
          <ModelList />
        </div>
      </div>
    </>
  );
};

export default App;
