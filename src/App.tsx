import React from 'react';
import { CustomCursor } from './components/CustomCursor';
import { ConstraintPanel } from './components/ConstraintPanel';
import { ModelList } from './components/ModelList';

const App: React.FC = () => {
  return (
    <div className="layout">
      <CustomCursor />
      <ModelList />
      <ConstraintPanel />
    </div>
  );
};

export default App;
