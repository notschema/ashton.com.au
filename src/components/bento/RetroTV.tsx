/**
 * RetroTV Component
 * 
 * A minimalist CRT TV bento card with authentic 80's Apple aesthetic.
 * - Auto channel switching (10s intervals)
 * - Hover to reveal ◀ ▶ channel controls
 * - Clean retro CRT effects
 */

import React, { useState, useEffect, useRef } from 'react';
import { cn } from '../../lib/utils';

// ============================================================================
// TVNoise Component (Inline)
// ============================================================================

interface TVNoiseProps {
  className?: string;
  opacity?: number;
  intensity?: number;
}

function TVNoise({ className, opacity = 0.03, intensity = 0.1 }: TVNoiseProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let isAnimating = true;

    const resizeCanvas = () => {
      if (!canvas) return;
      const parent = canvas.parentElement;
      if (!parent) return;

      const dpr = window.devicePixelRatio || 1;
      const width = parent.clientWidth;
      const height = parent.clientHeight;

      if (width > 0 && height > 0) {
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
        ctx.scale(dpr, dpr);
      }
    };

    const generateNoise = () => {
      if (!canvas || !ctx || !isAnimating) return;

      const { width, height } = canvas;
      if (width <= 0 || height <= 0) return;

      const imageData = ctx.createImageData(width, height);
      const data = imageData.data;

      for (let i = 0; i < data.length; i += 4) {
        if (Math.random() < intensity) {
          const value = Math.floor(Math.random() * 255);
          data[i] = value;
          data[i + 1] = value;
          data[i + 2] = value;
          data[i + 3] = Math.floor(Math.random() * 100 + 50);
        } else {
          data[i + 3] = 0;
        }
      }

      ctx.putImageData(imageData, 0, 0);
      animationFrameRef.current = requestAnimationFrame(generateNoise);
    };

    resizeCanvas();
    animationFrameRef.current = requestAnimationFrame(generateNoise);

    const handleResize = () => resizeCanvas();
    window.addEventListener("resize", handleResize);

    return () => {
      isAnimating = false;
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      window.removeEventListener("resize", handleResize);
    };
  }, [intensity]);

  return (
    <canvas
      ref={canvasRef}
      className={cn("pointer-events-none absolute inset-0 w-full h-full z-10", className)}
      style={{ opacity, mixBlendMode: "overlay" }}
      aria-hidden="true"
    />
  );
}

// ============================================================================
// Main RetroTV Component
// ============================================================================

interface Channel {
  id: number;
  name: string;
  url: string;
}

const CHANNELS: Channel[] = [
  { id: 1, name: 'BEBOP', url: 'https://media.giphy.com/media/3o7qE3q6qQ5UnlWb6Y/giphy.gif' },
  { id: 2, name: 'MOON', url: 'https://media.giphy.com/media/3o7TKkkGvFJ3qH4Q9u/giphy.gif' },
  { id: 3, name: 'AKIRA', url: 'https://media.giphy.com/media/12b3E4U9aSndxC/giphy.gif' },
  { id: 4, name: 'EVANGELION', url: 'https://media.giphy.com/media/AgjH5J0gFs5S8/giphy.gif' },
  { id: 5, name: 'LAIN', url: 'https://media.giphy.com/media/vP5gXvSXJ2olW/giphy.gif' },
];

const CHANNEL_DURATION = 10000;
const STATIC_DURATION = 500;

export default function RetroTV() {
  const [channelIndex, setChannelIndex] = useState(0);
  const [isStatic, setIsStatic] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout>();

  const currentChannel = CHANNELS[channelIndex];

  // Auto channel switching
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      changeChannel((channelIndex + 1) % CHANNELS.length);
    }, CHANNEL_DURATION);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [channelIndex]);

  const changeChannel = (newIndex: number) => {
    setIsStatic(true);
    
    setTimeout(() => {
      setChannelIndex(newIndex);
      setIsStatic(false);
    }, STATIC_DURATION);
  };

  const handlePrevChannel = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newIndex = (channelIndex - 1 + CHANNELS.length) % CHANNELS.length;
    changeChannel(newIndex);
  };

  const handleNextChannel = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newIndex = (channelIndex + 1) % CHANNELS.length;
    changeChannel(newIndex);
  };

  return (
    <div 
      className="relative h-full w-full overflow-hidden rounded-xl bg-[#2a2a2a] border-4 border-[#3a3a3a] shadow-inner flex items-center justify-center group"
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      {/* CRT Screen */}
      <div className="relative w-full h-full bg-[#1a1a1a] overflow-hidden rounded-sm">
        
        {/* Channel Background */}
        <div
          className={cn(
            "absolute inset-0 bg-cover bg-center transition-opacity duration-200",
            "contrast-110 brightness-90",
            isStatic && "opacity-0"
          )}
          style={{ 
            backgroundImage: `url(${currentChannel.url})`,
            opacity: isStatic ? 0 : 0.7,
          }}
          aria-label={`Channel ${currentChannel.id}: ${currentChannel.name}`}
        />

        {/* Static Noise */}
        <TVNoise 
          opacity={isStatic ? 0.9 : 0.08} 
          intensity={isStatic ? 0.6 : 0.12}
          className="z-10 mix-blend-overlay transition-opacity duration-300"
        />

        {/* CRT Scanlines */}
        <div 
          className="absolute inset-0 z-20 pointer-events-none bg-repeat opacity-40"
          style={{
            background: `linear-gradient(rgba(18,16,16,0) 50%, rgba(0,0,0,0.3) 50%)`,
            backgroundSize: '100% 3px',
          }}
          aria-hidden="true"
        />

        {/* Screen Vignette */}
        <div 
          className="absolute inset-0 z-30 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_20%,rgba(0,0,0,0.5)_100%)]"
          aria-hidden="true"
        />
        
        {/* Minimal OSD - Top Right */}
        <div className="absolute top-3 right-3 z-40 flex flex-col items-end pointer-events-none select-none">
          <span className="text-amber-400/60 font-mono text-xs tracking-wider uppercase">
            {String(currentChannel.id).padStart(2, '0')}
          </span>
        </div>

        {/* Channel Controls - Hover Only */}
        <div 
          className={cn(
            "absolute inset-x-0 bottom-0 z-40 flex items-center justify-center gap-2 pb-4 transition-all duration-300",
            showControls ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
          )}
        >
          <button
            onClick={handlePrevChannel}
            className="px-4 py-2 rounded-lg bg-zinc-900/70 backdrop-blur border border-white/10 text-zinc-400 hover:text-white hover:border-white/20 transition-all font-mono text-sm"
            aria-label="Previous Channel"
          >
            CH▼
          </button>
          <button
            onClick={handleNextChannel}
            className="px-4 py-2 rounded-lg bg-zinc-900/70 backdrop-blur border border-white/10 text-zinc-400 hover:text-white hover:border-white/20 transition-all font-mono text-sm"
            aria-label="Next Channel"
          >
            CH▲
          </button>
        </div>

        {/* Subtle Glass Reflection */}
        <div 
          className="absolute inset-0 z-50 pointer-events-none bg-gradient-to-br from-white/5 to-transparent opacity-30"
          aria-hidden="true"
        />
      </div>

      {/* Power LED */}
      <div 
        className="absolute bottom-2 right-3 z-50 w-1 h-1 rounded-full bg-amber-500 shadow-[0_0_4px_rgba(245,158,11,0.8)]"
        aria-label="Power indicator"
      />
    </div>
  );
}
