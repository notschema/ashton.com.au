'use client';
import { useEffect, useRef, useState, useCallback } from 'react';

interface Pixel {
  id: number;
  x: number;
  y: number;
  opacity: number;
  age: number;
}

// Cursor trail settings
const PIXEL_SIZE = 12;
const TRAIL_LENGTH = 20;
const FADE_SPEED = 0.04;

export default function PixelTrail() {
  const [pixels, setPixels] = useState<Pixel[]>([]);
  const [cursorPos, setCursorPos] = useState({ x: -100, y: -100 });
  const pixelIdRef = useRef(0);
  const lastPositionRef = useRef({ x: 0, y: 0 });
  const animationRef = useRef<number>();

  const createPixel = useCallback((x: number, y: number) => {
    return {
      id: pixelIdRef.current++,
      x,
      y,
      opacity: 1,
      age: 0,
    };
  }, []);

  // Track mouse movement
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = e.clientX;
      const y = e.clientY;

      setCursorPos({ x, y });

      const dx = x - lastPositionRef.current.x;
      const dy = y - lastPositionRef.current.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance > PIXEL_SIZE / 2) {
        const newPixel = createPixel(x, y);
        setPixels((prev) => [...prev.slice(-TRAIL_LENGTH), newPixel]);
        lastPositionRef.current = { x, y };
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [createPixel]);

  // Animation loop for fading pixels
  useEffect(() => {
    const animate = () => {
      setPixels((prev) =>
        prev
          .map((pixel) => ({
            ...pixel,
            opacity: pixel.opacity - FADE_SPEED,
            age: pixel.age + 1,
          }))
          .filter((pixel) => pixel.opacity > 0)
      );

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] h-screen w-screen overflow-hidden">
      <style>{`
        @media (hover: none) and (pointer: coarse) {
          .pixel-trail { display: none !important; }
        }
      `}</style>
      
      <div className="pixel-trail">
        {/* Main Cursor Head */}
        <div 
          className="absolute w-3 h-3 bg-foreground mix-blend-difference"
          style={{
            left: cursorPos.x - 6,
            top: cursorPos.y - 6,
          }}
        />

        {/* Cursor Trail */}
        {pixels.map((pixel) => {
          const sizeMultiplier = Math.max(0.3, 1 - pixel.age / 100);
          const currentSize = PIXEL_SIZE * sizeMultiplier;

          return (
            <div
              key={pixel.id}
              className="absolute bg-foreground"
              style={{
                left: pixel.x - currentSize / 2,
                top: pixel.y - currentSize / 2,
                width: currentSize,
                height: currentSize,
                opacity: pixel.opacity * 0.5,
                transition: 'width 0.1s ease-out, height 0.1s ease-out',
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
