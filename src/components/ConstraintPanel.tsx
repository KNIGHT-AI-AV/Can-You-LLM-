import React from 'react';
import { Fader } from './Fader';

export const ConstraintPanel: React.FC = () => {
  return (
    <div className="glass-panel main-center">
      <h1 style={{ marginBottom: '8px', fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-1px' }}>Can You LLM ?</h1>
      <h2 style={{ marginBottom: '32px', fontSize: '1rem', fontWeight: 400, color: 'var(--trim)' }}>Hardware Physics Constraints</h2>
      <Fader label="Accelerator VRAM" storeKey="vram" min={4} max={256} unit="GB" />
      <Fader label="Host RAM" storeKey="ram" min={8} max={512} unit="GB" />
      <Fader label="Memory Bandwidth" storeKey="bandwidth" min={50} max={2000} unit="GB/s" />
      <Fader label="Storage Capacity" storeKey="storage" min={10} max={1000} unit="GB" />
    </div>
  );
};
