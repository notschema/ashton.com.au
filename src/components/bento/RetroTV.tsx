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

// 90s/00s kids TV shows only - reliable Giphy results
const NOSTALGIC_TOPICS = [
  'spongebob',
  'simpsons',
  'tom and jerry',
  'looney tunes',
  'scooby doo',
  'powerpuff girls',
  'pokemon',
  'rugrats',
  'fairly odd parents',
  'jimmy neutron',
  'dexter laboratory',
  'samurai jack',
  'avatar last airbender',
  'fosters home',
  'codename kids next door',
];

function getRandomTopic(): string {
  return NOSTALGIC_TOPICS[Math.floor(Math.random() * NOSTALGIC_TOPICS.length)];
}

// Giphy API Configuration
// Set PUBLIC_GIPHY_API_KEY in your environment variables
// Get your API key at: https://developers.giphy.com/dashboard/
const GIPHY_API_KEY = import.meta.env.PUBLIC_GIPHY_API_KEY || '';
const GIPHY_LIMIT = 10; // Fetch 10 GIFs to cycle through
const CHANNEL_DURATION = 20000; // 20 seconds per channel
const STATIC_DURATION = 500;

export default function RetroTV() {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [channelIndex, setChannelIndex] = useState(0);
  const [isStatic, setIsStatic] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentTopic, setCurrentTopic] = useState('');
  const intervalRef = useRef<NodeJS.Timeout>();

  // Fetch GIFs from Giphy with random nostalgic topic and smart caching
  useEffect(() => {
    // Client-side only logic to prevent hydration mismatch
    const today = new Date().toDateString();
    
    // Select random topic only on client mount
    let randomTopic = '';
    if (currentTopic) {
        randomTopic = currentTopic;
    } else {
        randomTopic = getRandomTopic();
        setCurrentTopic(randomTopic);
    }
    
    async function fetchGiphyContent() {
      // Load cache bucket
      let cache = { date: '', topics: {} as Record<string, Channel[]> };
      try {
        const stored = localStorage.getItem('retrotv_v2_cache');
        if (stored) cache = JSON.parse(stored);
      } catch (e) {
         console.warn('Cache parse error'); 
         // Reset cache on error
         localStorage.removeItem('retrotv_v2_cache');
      }

      // Reset cache if date changed
      if (cache.date !== today) {
        cache = { date: today, topics: {} };
      }

      // Check for cached data for THIS specific topic
      if (cache.topics[randomTopic]) {
        console.log(`📺 Using cached GIFs for: "${randomTopic}"`);
        setChannels(cache.topics[randomTopic]);
        setLoading(false);
        return;
      }

      // Fetch fresh data from Giphy
      try {
        console.log(`📺 Fetching GIFs for: "${randomTopic}"`);
        const response = await fetch(
          `https://api.giphy.com/v1/gifs/search?api_key=${GIPHY_API_KEY}&q=${encodeURIComponent(randomTopic)}&limit=${GIPHY_LIMIT}&rating=g`
        );
        
        if (response.status === 401) {
            console.error('❌ Giphy API Key Invalid/Missing. Check .env file.');
            throw new Error('401 Unauthorized');
        }

        const data = await response.json();
        
        if (data.data && data.data.length > 0) {
          const fetchedChannels: Channel[] = data.data.map((gif: any, index: number) => ({
            id: index + 1,
            name: gif.title.substring(0, 15).toUpperCase() || 'CHANNEL',
            url: gif.images.original.url,
          }));
          
          // Update cache with new topic data
          cache.topics[randomTopic] = fetchedChannels;
          localStorage.setItem('retrotv_v2_cache', JSON.stringify(cache));
          
          setChannels(fetchedChannels);
          console.log(`✅ Loaded ${fetchedChannels.length} GIFs: "${randomTopic}"`);
        } else {
          // Fallback
          setFallbackChannels();
        }
      } catch (error) {
        console.error('Error fetching Giphy content:', error);
        setFallbackChannels();
      } finally {
        setLoading(false);
      }
    }

    function setFallbackChannels() {
       setChannels([
        { id: 1, name: 'BEBOP', url: 'https://media.giphy.com/media/3o7qE3q6qQ5UnlWb6Y/giphy.gif' },
        { id: 2, name: 'MOON', url: 'https://media.giphy.com/media/3o7TKkkGvFJ3qH4Q9u/giphy.gif' },
        { id: 3, name: 'AKIRA', url: 'https://media.giphy.com/media/12b3E4U9aSndxC/giphy.gif' },
      ]);
      console.warn('Using fallback channels');
    }

    fetchGiphyContent();
  }, [currentTopic]);

  const currentChannel = channels[channelIndex];

  // Auto channel switching
  useEffect(() => {
    if (channels.length === 0 || loading) return;

    intervalRef.current = setInterval(() => {
      changeChannel((channelIndex + 1) % channels.length);
    }, CHANNEL_DURATION);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [channelIndex, channels, loading]);

  const changeChannel = (newIndex: number) => {
    setIsStatic(true);
    
    setTimeout(() => {
      setChannelIndex(newIndex);
      setIsStatic(false);
    }, STATIC_DURATION);
  };

  const handlePrevChannel = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (channels.length === 0) return;
    const newIndex = (channelIndex - 1 + channels.length) % channels.length;
    changeChannel(newIndex);
  };

  const handleNextChannel = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (channels.length === 0) return;
    const newIndex = (channelIndex + 1) % channels.length;
    changeChannel(newIndex);
  };

  // Loading state while fetching GIFs
  if (loading || channels.length === 0) {
    return (
      <div className="relative h-full w-full overflow-hidden bg-black flex items-center justify-center">
        <div className="relative w-full h-full bg-black overflow-hidden flex items-center justify-center">
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-white/60 font-mono text-xs tracking-wider uppercase animate-pulse">
              TUNING...
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="relative h-full w-full overflow-hidden bg-black flex items-center justify-center group"
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      {/* GIF Display */}
      <div className="relative w-full h-full bg-black overflow-hidden">
        
        {/* Channel Background */}
        <div
          className={cn(
            "absolute inset-0 bg-cover bg-center transition-opacity duration-200",
            isStatic && "opacity-0"
          )}
          style={{ 
            backgroundImage: currentChannel ? `url(${currentChannel.url})` : 'none',
            opacity: isStatic ? 0 : 1,
          }}
          aria-label={currentChannel ? `Channel ${currentChannel.id}: ${currentChannel.name}` : 'Channel'}
        />

        {/* Subtle dark overlay to blend with theme */}
        <div 
          className="absolute inset-0 bg-black/30 pointer-events-none"
          aria-hidden="true"
        />

        {/* Vignette */}
        <div 
          className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_40%,rgba(0,0,0,0.6)_100%)]"
          aria-hidden="true"
        />
        


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

        {/* GIPHY Attribution */}
        <div className="absolute bottom-2 right-2 z-30 pointer-events-none mix-blend-screen px-1.5 py-0.5 rounded bg-black/40 backdrop-blur-[1px]">
           <img 
             src="/giphy-attribution.png" 
             alt="Powered by GIPHY" 
             className="h-3.5 w-auto object-contain grayscale opacity-60"
           />
        </div>
      </div>
    </div>
  );
}
