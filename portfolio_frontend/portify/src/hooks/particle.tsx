'use client';

import { useCallback, useRef } from 'react';
import { useCanvas } from './useCanvas';

type Particle = {
   x: number;
   y: number;
   velocity: { x: number; y: number };
   radius: number;
   color: string;
};

const createParticle = (ctx: CanvasRenderingContext2D): Particle => {
   const canvas = ctx.canvas;

   const x = Math.random() * canvas.width;
   const y = Math.random() * canvas.height;

   const velocity = {
      x: (Math.random() - 0.5) * 2,
      y: (Math.random() - 0.5) * 2,
   };

   const radius = Math.random() * 1.5 + 0.5;

   const color = `rgba(${Math.random() * 100 + 155}, 
      ${Math.random() * 100 + 155}, ${Math.random() * 100 + 155}, 0.1)`;

   return { x, y, velocity, radius, color };
};

const updateParticle = (particle: Particle, ctx: CanvasRenderingContext2D): Particle => {
   const canvas = ctx.canvas;
   if (!canvas) return particle;

   let { x, y, velocity } = particle;
   x += velocity.x;
   y += velocity.y;

   if (x < 0 || x > canvas.width) 
      velocity = { ...velocity, x: -velocity.x };

   if (y < 0 || y > canvas.height) 
      velocity = { ...velocity, y: -velocity.y };

   return { ...particle, x, y, velocity };
};

const drawParticle = (ctx: CanvasRenderingContext2D, particle: Particle) => {
   ctx.beginPath();
   ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);

   ctx.fillStyle = particle.color;
   ctx.fill();
};

const drawConnections = (ctx: CanvasRenderingContext2D, particles: Particle[]) => {
   ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';

   for (let i = 0; i < particles.length; i++) {
      const a = particles[i];
      if (!a) continue;

      for (let j = i + 1; j < particles.length; j++) {
      const b = particles[j];
      if (!b) continue;

      const dx = a.x - b.x;
      const dy = a.y - b.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 100) {
         ctx.beginPath();
         ctx.moveTo(a.x, a.y);
         ctx.lineTo(b.x, b.y);
         ctx.stroke();
      }
      }
   }
};


export function ParticleCanvas() {
   const particles = useRef<Particle[]>([]);

   const draw = useCallback((ctx: CanvasRenderingContext2D) => {

      if (particles.current.length === 0) {
         particles.current = Array.from({ length: 100 }, 
         () => createParticle(ctx));
      }

      const canvas = ctx.canvas;
      if (!canvas) return;

      ctx.fillStyle = 'rgba(10, 10, 10, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particles.current = particles.current.map(p => {
         const updated = updateParticle(p, ctx);
         drawParticle(ctx, updated);
         
         return updated;
      });

      drawConnections(ctx, particles.current);
   }, []);

   const canvasRef = useCanvas(draw);

   return (
      <canvas 
         ref={canvasRef} 
         className="absolute inset-0 w-full !h-full pointer-events-none"
      />
   )
}