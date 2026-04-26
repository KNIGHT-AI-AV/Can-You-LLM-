import React from 'react';
import { Fader } from './Fader';
import { useHardwareStore } from '../store/useHardwareStore';

const AnimatedCost: React.FC<{ targetCost: number }> = ({ targetCost }) => {
  const [displayCost, setDisplayCost] = React.useState(targetCost);
  const [isAnimating, setIsAnimating] = React.useState(false);
  const costRef = React.useRef({ value: targetCost });
  const timeoutRef = React.useRef<any>(null);

  React.useEffect(() => {
    setIsAnimating(true);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    
    anime({
      targets: costRef.current,
      value: targetCost,
      duration: 800,
      easing: 'easeOutExpo',
      update: () => setDisplayCost(costRef.current.value)
    });

    timeoutRef.current = setTimeout(() => {
      setIsAnimating(false);
    }, 800);
  }, [targetCost]);

  const formattedCost = displayCost > 1000000 
    ? (displayCost/1000000).toFixed(1) + 'M' 
    : displayCost > 1000 
      ? (displayCost/1000).toFixed(1) + 'k' 
      : displayCost.toFixed(0);

  return (
    <div className={`cost-display ${isAnimating ? 'cost-animating' : ''}`}>
      ${formattedCost}
    </div>
  );
};

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
          <AnimatedCost targetCost={cost} />
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
        
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
          <button 
            onClick={() => useHardwareStore.getState().resetHardware()}
            style={{
              background: 'transparent',
              border: '1px solid rgba(255,255,255,0.1)',
              color: 'var(--text-muted)',
              padding: '6px 16px',
              borderRadius: '6px',
              cursor: 'none',
              fontSize: '0.75rem',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '1px',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = 'var(--trim)'; e.currentTarget.style.background = 'rgba(212, 175, 55, 0.1)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.background = 'transparent'; }}
          >
            Reset Faders
          </button>
        </div>
      </div>
    </div>
  );
};
