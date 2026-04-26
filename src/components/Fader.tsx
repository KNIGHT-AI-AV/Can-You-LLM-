import React, { useEffect, useRef, useState } from 'react';
import anime from 'animejs';
import { useHardwareStore } from '../store/useHardwareStore';
import { linearToLog, logToLinear } from '../utils/math';

interface FaderProps {
  label: string;
  storeKey: 'vram' | 'ram' | 'bandwidth' | 'storage' | 'storageSpeed' | 'contextLength';
  min: number;
  max: number;
  unit: string;
  isLogarithmic?: boolean;
}

export const Fader: React.FC<FaderProps> = ({ label, storeKey, min, max, unit, isLogarithmic = true }) => {
  const value = useHardwareStore((state) => state[storeKey]);
  const setValue = useHardwareStore((state) => state.setHardwareValue);
  
  const trackRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  const knobRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [isDragging, setIsDragging] = useState(false);

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
    percentage = Math.max(0, Math.min(100, percentage));
    
    let newValue = isLogarithmic ? linearToLog(percentage, min, max) : min + (max - min) * (percentage / 100);
    setValue(storeKey, newValue);

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
        <div className="fader-fill" ref={fillRef} />
        <div className="fader-knob" ref={knobRef} />
      </div>
    </div>
  );
};
