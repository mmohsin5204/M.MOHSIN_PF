import { useEffect, useRef } from 'react';

export default function CanvasParticleField() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let width = 0;
    let height = 0;

    // Define 3D Particle
    interface Particle3D {
      x: number;
      y: number;
      z: number;
      xProjected: number;
      yProjected: number;
      sizeProjected: number;
      color: string;
    }

    const particles: Particle3D[] = [];
    const particleCount = 200;
    const fov = 400; // Field of view (perspective)

    // Interaction states
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    let rotationX = 0.002;
    let rotationY = 0.003;

    // Initialize 3D points inside a sphere
    for (let i = 0; i < particleCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const radius = 180 + Math.random() * 70; // spherical shell

      particles.push({
        x: radius * Math.sin(phi) * Math.cos(theta),
        y: radius * Math.sin(phi) * Math.sin(theta),
        z: radius * Math.cos(phi),
        xProjected: 0,
        yProjected: 0,
        sizeProjected: 0,
        color: `rgba(59, 130, 246, ${0.3 + Math.random() * 0.5})`, // beautiful accents
      });
    }

    // Handle Resize using ResizeObserver
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const { width: parentWidth, height: parentHeight } = entry.contentRect;
        width = parentWidth;
        height = parentHeight;
        canvas.width = width;
        canvas.height = height;
      }
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    // Capture mouse movement for interactive drift
    const handleMouseMove = (e: MouseEvent) => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left - width / 2;
      const y = e.clientY - rect.top - height / 2;
      mouse.targetX = x * 0.003;
      mouse.targetY = y * 0.003;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // 3D Rotations
    const rotateX = (point: Particle3D, angle: number) => {
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      const y1 = point.y * cos - point.z * sin;
      const z1 = point.z * cos + point.y * sin;
      point.y = y1;
      point.z = z1;
    };

    const rotateY = (point: Particle3D, angle: number) => {
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      const x1 = point.x * cos - point.z * sin;
      const z1 = point.z * cos + point.x * sin;
      point.x = x1;
      point.z = z1;
    };

    // Render loop
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Dampened mouse drift
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      // Adjust rotation speed based on cursor
      const currentRotX = rotationX + mouse.y * 0.01;
      const currentRotY = rotationY + mouse.x * 0.01;

      // Draw global cosmic glowing center
      const gradient = ctx.createRadialGradient(
        width / 2, height / 2, 0,
        width / 2, height / 2, Math.min(width, height) * 0.35
      );
      gradient.addColorStop(0, 'rgba(59, 130, 246, 0.06)');
      gradient.addColorStop(0.5, 'rgba(147, 51, 234, 0.03)');
      gradient.addColorStop(1, 'transparent');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Projects 3D to 2D
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        rotateX(p, currentRotX);
        rotateY(p, currentRotY);

        // Perspective projection calculation
        const perspective = fov / (fov + p.z);
        p.xProjected = p.x * perspective + width / 2;
        p.yProjected = p.y * perspective + height / 2;
        p.sizeProjected = Math.max(0.5, 2.5 * perspective);
      }

      // Draw connection lines for close nodes (constellation grid)
      ctx.lineWidth = 0.5;
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        if (p1.z > 100) continue; // Skip lines for very far background particles

        let connections = 0;
        for (let j = i + 1; j < particles.length; j++) {
          if (connections > 2) break; // Limit lines per particle to save performance
          const p2 = particles[j];

          // Compute 3D distance
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dz = p1.z - p2.z;
          const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

          if (dist < 85) {
            const alpha = (1 - dist / 85) * 0.15;
            ctx.strokeStyle = `rgba(147, 51, 234, ${alpha})`;
            ctx.beginPath();
            ctx.moveTo(p1.xProjected, p1.yProjected);
            ctx.lineTo(p2.xProjected, p2.yProjected);
            ctx.stroke();
            connections++;
          }
        }
      }

      // Render nodes
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        
        // Depth-based opacity
        const depthAlpha = Math.max(0.1, Math.min(1, (p.z + 250) / 500));
        ctx.fillStyle = p.color.replace(')', `, ${depthAlpha})`);
        
        ctx.beginPath();
        ctx.arc(p.xProjected, p.yProjected, p.sizeProjected, 0, Math.PI * 2);
        ctx.fill();

        // Subtle outer glow for featured front particles
        if (p.z < -100 && i % 8 === 0) {
          ctx.shadowBlur = 10;
          ctx.shadowColor = '#3b82f6';
          ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
          ctx.beginPath();
          ctx.arc(p.xProjected, p.yProjected, p.sizeProjected * 1.5, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0; // reset
        }
      }

      animationId = requestAnimationFrame(render);
    };

    render();

    // Cleanup
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('mousemove', handleMouseMove);
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0 w-full h-full pointer-events-none z-0">
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
}
