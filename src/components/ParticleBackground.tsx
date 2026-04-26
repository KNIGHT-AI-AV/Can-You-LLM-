import React, { useEffect, useRef } from 'react';

class Particle {
  x: number;
  y: number;
  z: number;
  radius: number;
  vx: number;
  vy: number;
  baseX: number;
  baseY: number;

  constructor(width: number, height: number) {
    this.x = Math.random() * width;
    this.y = Math.random() * height;
    this.z = Math.random() * 2 + 0.1; // Depth: 0.1 (far) to 2.1 (near)
    this.baseX = this.x;
    this.baseY = this.y;
    this.radius = (Math.random() * 1.5 + 0.5) * this.z;
    this.vx = (Math.random() - 0.5) * 0.2 * this.z;
    this.vy = (Math.random() - 0.5) * 0.2 * this.z;
  }

  update(width: number, height: number, mouseX: number, mouseY: number) {
    this.x += this.vx;
    this.y += this.vy;

    // Wrap around
    if (this.x < 0) this.x = width;
    if (this.x > width) this.x = 0;
    if (this.y < 0) this.y = height;
    if (this.y > height) this.y = 0;

    // Mouse Repulsion Physics
    if (mouseX !== -1 && mouseY !== -1) {
      const dx = mouseX - this.x;
      const dy = mouseY - this.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const repulseRadius = 150 * this.z;

      if (distance < repulseRadius) {
        const force = (repulseRadius - distance) / repulseRadius;
        const angle = Math.atan2(dy, dx);
        this.x -= Math.cos(angle) * force * 5 * this.z;
        this.y -= Math.sin(angle) * force * 5 * this.z;
      }
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    // Parallax opacity: closer particles are brighter and less blurry
    const opacity = Math.min(1, 0.2 + (this.z * 0.3));
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
    
    if (this.z > 1.5) {
      ctx.shadowBlur = 10;
      ctx.shadowColor = 'rgba(255, 255, 255, 0.8)';
    } else {
      ctx.shadowBlur = 0;
    }
    
    ctx.fill();
    ctx.closePath();
  }
}

export const ParticleBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1, y: -1 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const particles: Particle[] = [];
    const particleCount = Math.floor((width * height) / 10000); // Responsive count

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle(width, height));
    }

    let animationFrameId: number;

    const render = () => {
      // Clear completely to prevent milky grey smudging
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        particles[i].update(width, height, mouseRef.current.x, mouseRef.current.y);
        particles[i].draw(ctx);
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;

      // Dynamically scale star count to maintain density
      const targetCount = Math.floor((width * height) / 10000);
      if (particles.length < targetCount) {
        for (let i = particles.length; i < targetCount; i++) {
          particles.push(new Particle(width, height));
        }
      } else if (particles.length > targetCount) {
        particles.splice(targetCount);
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
    };

    const handleMouseLeave = () => {
      mouseRef.current.x = -1;
      mouseRef.current.y = -1;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
        background: '#0a0000',
        pointerEvents: 'none'
      }}
    />
  );
};
