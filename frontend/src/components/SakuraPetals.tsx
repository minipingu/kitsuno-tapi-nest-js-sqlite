import { useEffect, useRef } from 'react';
import { useTheme } from '@/context/ThemeContext';

interface Petal {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  rotation: number;
  rotationSpeed: number;
  flip: number;
  flipSpeed: number;
  opacity: number;
  colorIndex: number;
}

export default function SakuraPetals() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { isDark } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    // Respect user's motion preference
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    if (prefersReducedMotion) return;

    let animationFrameId: number;
    let isVisible = !document.hidden;

    // Responsive petal count: 16 on mobile for 60fps battery efficiency, 32 on desktop
    const isMobile = window.innerWidth < 768;
    const petalCount = isMobile ? 16 : 32;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize, { passive: true });

    // Sakura Color Palettes
    // Light Mode (Asa-Sakura): soft blush, gentle cherry blossom pinks
    // Dark Mode (Yozakura): luminous glowing night blossoms
    const lightColors = [
      'rgba(255, 183, 197, ', // Classic cherry pink
      'rgba(244, 114, 182, ', // Rose petal
      'rgba(251, 113, 133, ', // Deep sakura blush
      'rgba(254, 205, 211, ', // Very soft pale petal
    ];

    const darkColors = [
      'rgba(251, 113, 133, ', // Glowing rose
      'rgba(244, 114, 182, ', // Luminous pink
      'rgba(253, 164, 175, ', // Moonlit petal
      'rgba(249, 168, 212, ', // Soft purple-pink
    ];

    const colors = isDark ? darkColors : lightColors;

    // Initialize petals with random positions and velocities
    const petals: Petal[] = Array.from({ length: petalCount }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 6 + 7, // 7px to 13px
      speedY: Math.random() * 1.2 + 0.8, // gentle downward speed
      speedX: Math.random() * 1.0 - 0.2, // slight rightward wind drift
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.02,
      flip: Math.random() * Math.PI,
      flipSpeed: Math.random() * 0.03 + 0.01,
      opacity: Math.random() * 0.35 + 0.45, // 0.45 - 0.8
      colorIndex: Math.floor(Math.random() * colors.length),
    }));

    // Draw a single curved Sakura petal shape using bezier curves
    const drawPetal = (p: Petal) => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      // Simulate 3D tumbling by scaling on horizontal axis
      ctx.scale(Math.cos(p.flip), 1);

      ctx.beginPath();
      ctx.moveTo(0, 0);
      // Top left curve
      ctx.bezierCurveTo(
        -p.size * 0.5,
        -p.size * 0.5,
        -p.size * 0.8,
        p.size * 0.2,
        0,
        p.size * 1.4
      );
      // Top right curve with tiny characteristic cherry petal notch
      ctx.bezierCurveTo(
        p.size * 0.8,
        p.size * 0.2,
        p.size * 0.5,
        -p.size * 0.5,
        0,
        0
      );
      ctx.closePath();

      ctx.fillStyle = `${colors[p.colorIndex]}${p.opacity})`;
      ctx.fill();
      ctx.restore();
    };

    let windTime = 0;

    const render = () => {
      if (!isVisible) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      windTime += 0.015;

      // Gentle natural breeze oscillation
      const breeze = Math.sin(windTime) * 0.8 + 0.5;

      for (let i = 0; i < petals.length; i++) {
        const p = petals[i];

        // Update positions
        p.y += p.speedY;
        p.x += p.speedX + breeze * 0.6;
        p.rotation += p.rotationSpeed;
        p.flip += p.flipSpeed;

        // Wrap around screen seamlessly
        if (p.y > canvas.height + 20) {
          p.y = -20;
          p.x = Math.random() * canvas.width;
        }
        if (p.x > canvas.width + 20) {
          p.x = -20;
        } else if (p.x < -20) {
          p.x = canvas.width + 20;
        }

        drawPetal(p);
      }

      animationFrameId = requestAnimationFrame(render);
    };

    // Pause animation when user switches tab to save mobile battery
    const handleVisibilityChange = () => {
      isVisible = !document.hidden;
      if (isVisible) {
        animationFrameId = requestAnimationFrame(render);
      } else {
        cancelAnimationFrame(animationFrameId);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isDark]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-20 w-full h-full"
      style={{ willChange: 'transform' }}
    />
  );
}
