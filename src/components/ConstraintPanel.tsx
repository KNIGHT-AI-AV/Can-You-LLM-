import React from 'react';
import { Fader } from './Fader';
import { useHardwareStore } from '../store/useHardwareStore';

export const ConstraintPanel: React.FC = () => {
  const vram = useHardwareStore(state => state.vram);
  const ram = useHardwareStore(state => state.ram);
  const bandwidth = useHardwareStore(state => state.bandwidth);
  const storage = useHardwareStore(state => state.storage);

  const calculateCost = () => {
    const vramCost = vram * (bandwidth > 1000 ? 350 : 60);
    const ramCost = ram * 3;
    const storageCost = storage * 0.10;
    return vramCost + ramCost + storageCost;
  };

  const getDeductibleFacts = () => {
    const powerDraw = (vram * 3.5 + ram * 0.5) / 1000; // rough kW estimate
    let formFactor = "Desktop Workstation";
    let cooling = "Air Cooled";
    
    if (vram > 2000) {
      formFactor = "Multi-Rack Supercluster";
      cooling = "Immersion / Liquid Loop";
    } else if (vram > 256) {
      formFactor = "42U Server Rack";
      cooling = "High-Velocity CRAC";
    }

    return { powerDraw: powerDraw.toFixed(1), formFactor, cooling };
  };

  const cost = calculateCost();
  const facts = getDeductibleFacts();

  return (
    <div className="glass-panel main-center" style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      <div style={{ display: 'flex', flexWrap: 'wrap-reverse', justifyContent: 'space-between', alignItems: 'flex-start', gap: '24px' }}>
        
        <div>
          <h1 style={{ marginBottom: '8px', fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-1px' }}>Can You LLM ?</h1>
          <h2 style={{ margin: 0, fontSize: '1rem', fontWeight: 400, color: 'var(--trim)' }}>Hardware Physics Constraints</h2>
        </div>

        <div style={{
          background: 'rgba(0, 0, 0, 0.4)',
          border: '1px solid var(--trim)',
          borderRadius: '8px',
          padding: '16px',
          textAlign: 'right',
          flex: '1 1 200px',
          maxWidth: '300px'
        }}>
          <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '1px' }}>Estimated System Cost</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#22c55e', margin: '4px 0 12px 0' }}>
            ${cost > 1000000 ? (cost/1000000).toFixed(1) + 'M' : cost > 1000 ? (cost/1000).toFixed(1) + 'k' : cost.toFixed(0)}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--trim)', marginBottom: '4px' }}>Power Draw: <span style={{color: '#fff'}}>{facts.powerDraw} kW</span></div>
          <div style={{ fontSize: '0.75rem', color: 'var(--trim)', marginBottom: '4px' }}>Form Factor: <span style={{color: '#fff'}}>{facts.formFactor}</span></div>
          <div style={{ fontSize: '0.75rem', color: 'var(--trim)' }}>Cooling: <span style={{color: '#fff'}}>{facts.cooling}</span></div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <Fader label="Accelerator VRAM" storeKey="vram" min={4} max={100000} unit="GB" />
      <Fader label="Host RAM" storeKey="ram" min={8} max={250000} unit="GB" />
      <Fader label="Memory Bandwidth" storeKey="bandwidth" min={50} max={500000} unit="GB/s" />
      <Fader label="Storage Capacity" storeKey="storage" min={10} max={1000000} unit="GB" />
    </div>
  );
};
