import React, { useEffect, useRef } from 'react';
import * as anime from 'animejs';
import { useHardwareStore } from '../store/useHardwareStore';
import { calculateTotalMemory } from '../utils/math';

export const ModelList: React.FC = () => {
  const models = useHardwareStore(state => state.models);
  const selectedModel = useHardwareStore(state => state.selectedModel);
  const selectModel = useHardwareStore(state => state.selectModel);
  
  const vram = useHardwareStore(state => state.vram);

  const listRef = useRef<HTMLDivElement>(null);

  const visibleModels = models.filter(model => {
    if (selectedModel) return true;
    const requiredMem = calculateTotalMemory(model.parameters_billion, model.layers, model.hidden_dimension, 8192);
    return requiredMem <= vram;
  }).sort((a, b) => b.intelligence_index - a.intelligence_index);

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
      <h2 style={{ marginBottom: '16px', fontSize: '1.2rem', fontWeight: 600, color: 'var(--text-main)' }}>
        {selectedModel ? "Selected Model" : "Capable Models"}
      </h2>
      <div className="model-list" ref={listRef}>
        {visibleModels.map(model => (
          <div 
            key={model.id} 
            className={`model-card model-card-anim ${selectedModel?.id === model.id ? 'active' : ''}`}
            onClick={() => selectModel(selectedModel?.id === model.id ? null : model)}
            onMouseEnter={onEnter}
            onMouseLeave={onLeave}
          >
            <div className="model-title">{model.name}</div>
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
