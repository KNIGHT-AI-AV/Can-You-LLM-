import React, { useEffect, useRef, useState } from 'react';
// @ts-ignore
import anime from 'animejs';

export const CustomCursor: React.FC = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [angle, setAngle] = useState(0);
  const [isMoving, setIsMoving] = useState(false);

  useEffect(() => {
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let lastMouseX = mouseX;
    let lastMouseY = mouseY;
    let currentAngle = 0;
    let moveTimeout: any;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      
      const dx = mouseX - lastMouseX;
      const dy = mouseY - lastMouseY;
      
      if (Math.abs(dx) > 1 || Math.abs(dy) > 1) {
        currentAngle = Math.atan2(dy, dx) * (180 / Math.PI);
        setAngle(currentAngle + 90);
        setIsMoving(true);
        clearTimeout(moveTimeout);
        moveTimeout = setTimeout(() => setIsMoving(false), 100);
      }
      
      lastMouseX = mouseX;
      lastMouseY = mouseY;
    };

    window.addEventListener('mousemove', onMouseMove);

    const animateCursor = () => {
      if (cursorRef.current) {
        anime.set(cursorRef.current, { left: mouseX, top: mouseY });
      }
      requestAnimationFrame(animateCursor);
    };
    animateCursor();

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
    };
  }, []);

  const svgPath = "M12 2L2 21l10-4 10 4L12 2z";

  return (
    <>
      <style>{`
        @keyframes fast-rainbow {
          0% { filter: hue-rotate(0deg) drop-shadow(0 0 10px rgba(255,0,0,0.8)); }
          100% { filter: hue-rotate(360deg) drop-shadow(0 0 10px rgba(255,0,0,0.8)); }
        }
        .cursor-moving {
          animation: fast-rainbow 0.5s linear infinite;
        }
      `}</style>

      <div 
        ref={cursorRef} 
        className={isMoving ? 'cursor-moving' : ''}
        style={{
          position: 'fixed', top: 0, left: 0, width: '24px', height: '24px',
          pointerEvents: 'none', zIndex: 9999,
          transform: `translate(-50%, -50%) rotate(${angle}deg)`,
          transition: 'transform 0.1s cubic-bezier(0.2, 0.8, 0.2, 1)',
          display: 'flex', justifyContent: 'center', alignItems: 'center',
          mixBlendMode: 'screen'
        }}
      >
        <svg viewBox="0 0 24 24" style={{ width: '100%', height: '100%', fill: isMoving ? '#ff0000' : 'var(--text-main)' }}>
          <path d={svgPath} strokeLinejoin="round" strokeWidth="2" stroke="transparent"/>
        </svg>
      </div>
    </>
  );
};
