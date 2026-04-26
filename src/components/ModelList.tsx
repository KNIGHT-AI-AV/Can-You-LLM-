import React, { useEffect, useRef } from 'react';
// @ts-ignore
import anime from 'animejs';
import { useHardwareStore } from '../store/useHardwareStore';
import { calculateTotalMemory } from '../utils/math';

export const ModelList: React.FC = () => {
  const models = useHardwareStore(state => state.models);
  const selectedModel = useHardwareStore(state => state.selectedModel);
  const selectModel = useHardwareStore(state => state.selectModel);
  const showAllModels = useHardwareStore(state => state.showAllModels);
  const toggleShowAllModels = useHardwareStore(state => state.toggleShowAllModels);
  const sortBy = useHardwareStore(state => state.sortBy);
  const setSortBy = useHardwareStore(state => state.setSortBy);
  
  const vram = useHardwareStore(state => state.vram);

  const listRef = useRef<HTMLDivElement>(null);

  const visibleModels = models.filter(model => {
    if (selectedModel) return true;
    if (showAllModels) return true;
    const requiredMem = calculateTotalMemory(model.parameters_billion, model.layers, model.hidden_dimension, 8192);
    return requiredMem <= vram;
  }).sort((a, b) => {
    if (sortBy === 'vram') {
      const memA = calculateTotalMemory(a.parameters_billion, a.layers, a.hidden_dimension, 8192);
      const memB = calculateTotalMemory(b.parameters_billion, b.layers, b.hidden_dimension, 8192);
      return memB - memA;
    }
    if (sortBy === 'parameters') {
      return b.parameters_billion - a.parameters_billion;
    }
    if (sortBy === 'context') {
      return b.context_window - a.context_window;
    }
    return b.intelligence_index - a.intelligence_index;
  });

  useEffect(() => {
    if (listRef.current) {
      anime({
        targets: '.model-card-anim',
        translateY: [20, 0],
        opacity: [0, 1],
        delay: anime.stagger(50),
        duration: 400,
        easing: 'easeOutSine'
      });
    }
  }, [selectedModel]);

  const onEnter = (e: React.MouseEvent) => {
    anime({ targets: e.currentTarget, scale: 1.03, duration: 200, easing: 'easeOutSine' });
  };
  const onLeave = (e: React.MouseEvent) => {
    anime({ targets: e.currentTarget, scale: 1, duration: 200, easing: 'easeOutSine' });
  };

  return (
    <div className="glass-panel sidebar" style={{ flex: '0 0 350px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--text-main)', margin: 0 }}>
          Models List
        </h2>
        <button 
          onClick={toggleShowAllModels}
          style={{
            background: showAllModels ? 'var(--accent)' : 'rgba(255, 255, 255, 0.05)',
            border: `1px solid ${showAllModels ? 'var(--accent)' : 'var(--trim)'}`,
            color: showAllModels ? '#fff' : 'var(--trim)',
            padding: '4px 10px',
            borderRadius: '6px',
            cursor: 'none',
            fontSize: '0.75rem',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={onEnter}
          onMouseLeave={onLeave}
        >
          {showAllModels ? "Show Capable" : "Reset"}
        </button>
      </div>

      <div style={{ display: 'flex', gap: '6px', marginBottom: '16px', flexWrap: 'wrap' }}>
        {(['intelligence', 'vram', 'parameters', 'context'] as const).map(type => (
          <button
            key={type}
            onClick={() => setSortBy(type)}
            style={{
              background: sortBy === type ? 'var(--accent)' : 'transparent',
              border: `1px solid ${sortBy === type ? 'var(--accent)' : 'rgba(255,255,255,0.1)'}`,
              color: sortBy === type ? '#fff' : 'rgba(255,255,255,0.5)',
              padding: '4px 8px',
              borderRadius: '4px',
              fontSize: '0.65rem',
              cursor: 'none',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}
            onMouseEnter={onEnter}
            onMouseLeave={onLeave}
          >
            {type}
          </button>
        ))}
      </div>

      <div className="model-list" ref={listRef}>
        {visibleModels.map((model, index) => (
          <div 
            key={model.id} 
            className={`model-card model-card-anim ${selectedModel?.id === model.id ? 'active' : ''}`}
            onClick={() => selectModel(selectedModel?.id === model.id ? null : model)}
            onMouseEnter={onEnter}
            onMouseLeave={onLeave}
          >
            <div className="model-header" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="model-rank" style={{ color: 'var(--accent)', fontWeight: 700 }}>#{index + 1}</span>
              <div className="model-title">{model.name}</div>
            </div>
            <div className="model-stats">
              <span>{model.parameters_billion}B Params</span>
              <span>Int: {model.intelligence_index}</span>
            </div>
            {selectedModel?.id === model.id && (
              <div style={{ marginTop: '12px', fontSize: '0.85rem', color: '#cbd5e1' }}>
                <span style={{color: '#22c55e', fontWeight: 600}}>Locked.</span> Min VRAM footprint: 
                {' '} {calculateTotalMemory(model.parameters_billion, model.layers, model.hidden_dimension, 8192).toFixed(2)} GB
              </div>
            )}
          </div>
        ))}
        {visibleModels.length === 0 && (
          <div style={{ padding: '24px', textAlign: 'center', color: '#64748b' }}>
            No models can run entirely within the current VRAM constraints.
          </div>
        )}
      </div>
    </div>
  );
};
