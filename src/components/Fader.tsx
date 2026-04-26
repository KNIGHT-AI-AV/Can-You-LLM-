import React, { useEffect, useRef, useState } from 'react';
// @ts-ignore
import anime from 'animejs';
import { useHardwareStore } from '../store/useHardwareStore';
import { linearToLog, logToLinear } from '../utils/math';

interface FaderProps {
  label: string;
  storeKey: 'vram' | 'ram' | 'bandwidth' | 'storage' | 'storageSpeed';
  min: number;
  max: number;
  unit: string;
  isLogarithmic?: boolean;
}

const playFeltedNo = () => {
  const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
  if (!AudioContext) return;
  const ctx = new AudioContext();
  
  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = 300;
  filter.connect(ctx.destination);

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0, ctx.currentTime);
  gain.gain.linearRampToValueAtTime(0.5, ctx.currentTime + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
  gain.gain.setValueAtTime(0, ctx.currentTime + 0.12);
  gain.gain.linearRampToValueAtTime(0.4, ctx.currentTime + 0.14);
  gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);
  gain.connect(filter);

  const osc = ctx.createOscillator();
  osc.type = 'triangle';
  osc.frequency.setValueAtTime(150, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(50, ctx.currentTime + 0.1);
  osc.frequency.setValueAtTime(120, ctx.currentTime + 0.12);
  osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.25);
  
  osc.connect(gain);
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.25);
};

export const Fader: React.FC<FaderProps> = ({ label, storeKey, min, max, unit, isLogarithmic = true }) => {
  const value = useHardwareStore((state) => state[storeKey]);
  const setValue = useHardwareStore((state) => state.setHardwareValue);
  
  const trackRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  const knobRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [isDragging, setIsDragging] = useState(false);
  const [direction, setDirection] = useState<'left' | 'right'>('right');
  const lastPercentage = useRef(0);
  const hasHitBoundary = useRef(false);

  const getPercentage = (val: number) => {
    if (isLogarithmic) {
      return logToLinear(val, min, max);
    }
    return ((val - min) / (max - min)) * 100;
  };

  useEffect(() => {
    if (!isDragging && knobRef.current && fillRef.current) {
      const percentage = getPercentage(value as number);
      anime({
        targets: knobRef.current,
        left: `${percentage}%`,
        duration: 300,
        easing: 'easeOutExpo'
      });
      anime({
        targets: fillRef.current,
        width: `${percentage}%`,
        duration: 300,
        easing: 'easeOutExpo'
      });
    }
  }, [value, isDragging, min, max, isLogarithmic]);

  const handleDrag = (e: MouseEvent | React.MouseEvent) => {
    if (!trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    let percentage = ((e.clientX - rect.left) / rect.width) * 100;
    
    if (percentage > lastPercentage.current) setDirection('right');
    else if (percentage < lastPercentage.current) setDirection('left');
    lastPercentage.current = percentage;

    percentage = Math.max(0, Math.min(100, percentage));
    
    let newValue = isLogarithmic ? linearToLog(percentage, min, max) : min + (max - min) * (percentage / 100);
    
    const currentStoreValue = useHardwareStore.getState()[storeKey];
    setValue(storeKey, newValue);
    
    const actualNewStoreValue = useHardwareStore.getState()[storeKey];
    
    if (newValue < actualNewStoreValue) {
      if (!hasHitBoundary.current && actualNewStoreValue === currentStoreValue) {
        hasHitBoundary.current = true;
        playFeltedNo();
        if (knobRef.current) {
          // Shake and red glow
          anime({
            targets: knobRef.current,
            translateX: ['-50%', '-60%', '-40%', '-55%', '-45%', '-50%'],
            translateY: '-50%',
            duration: 400,
            easing: 'easeInOutSine'
          });
          const arrow = knobRef.current.querySelector('svg');
          if (arrow) {
            anime({
              targets: arrow,
              fill: ['#ff0000', '#ffffff'],
              filter: ['drop-shadow(0 0 15px red)', 'drop-shadow(0 0 8px rgba(255,255,255,0.8))'],
              duration: 500,
              easing: 'easeOutExpo'
            });
          }
        }
        if (trackRef.current) {
          anime({ targets: trackRef.current, borderColor: ['#ff0000', 'rgba(255,255,255,0.1)'], duration: 300, easing: 'easeOutExpo' });
        }
        if (fillRef.current) {
          fillRef.current.classList.add('flash-red');
          setTimeout(() => {
            if (fillRef.current) fillRef.current.classList.remove('flash-red');
          }, 400);
        }
      }
      percentage = getPercentage(actualNewStoreValue);
    } else {
      hasHitBoundary.current = false;
    }

    if (knobRef.current && fillRef.current) {
      anime.set(knobRef.current, { left: `${percentage}%` });
      anime.set(fillRef.current, { width: `${percentage}%` });
    }
  };

  useEffect(() => {
    if (isDragging) {
      const onMouseMove = (e: MouseEvent) => handleDrag(e);
      const onMouseUp = () => setIsDragging(false);
      
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
      
      return () => {
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('mouseup', onMouseUp);
      };
    }
  }, [isDragging]);

  const handleMouseEnter = () => {
    anime({ targets: containerRef.current, scale: 1.02, duration: 200, easing: 'easeOutSine' });
  };
  const handleMouseLeave = () => {
    anime({ targets: containerRef.current, scale: 1, duration: 200, easing: 'easeOutSine' });
  };

  return (
    <div className="fader-container" ref={containerRef} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <div className="fader-label">
        <span>{label}</span>
        <span style={{ color: 'var(--trim)' }}>{(value as number).toFixed(1)} {unit}</span>
      </div>
      <div 
        className="fader-track" 
        ref={trackRef}
        onMouseDown={(e) => {
          setIsDragging(true);
          handleDrag(e);
        }}
      >
        <div className={`fader-fill ${isDragging ? 'dragging-rainbow' : ''}`} ref={fillRef} />
        <div className="fader-knob" ref={knobRef}>
          <svg className="fader-arrow" viewBox="0 0 24 24" style={{ transform: direction === 'left' ? 'rotate(-90deg)' : 'rotate(90deg)' }}>
            <path d="M12 2L2 21l10-4 10 4L12 2z" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
    </div>
  );
};
