/**
 * ShrimpTank - Zen Planted Red Cherry Shrimp Aquarium
 * 
 * A peaceful, meditative aquarium with:
 * - Red cherry shrimp with realistic behaviors
 * - Lush planted aquascape (moss, carpeting plants, stem plants)
 * - Driftwood and dragon stone
 * - Gentle ambient lighting
 * - Slow, calming animations
 */

import { useEffect, useRef, useState, useCallback, memo } from 'react';

// Red Cherry Shrimp color grades
const SHRIMP_COLORS = [
  '#dc2626', // Cherry red
  '#ef4444', // Fire red
  '#b91c1c', // Deep red
  '#f87171', // Sakura
];

// Create a shrimp
function createShrimp(id, width, height) {
  return {
    id,
    x: Math.random() * (width - 30) + 15,
    y: height * 0.5 + Math.random() * (height * 0.4), // Bottom half
    vx: (Math.random() - 0.5) * 0.8,
    vy: (Math.random() - 0.5) * 0.3,
    size: 8 + Math.random() * 6,
    color: SHRIMP_COLORS[Math.floor(Math.random() * SHRIMP_COLORS.length)],
    flipX: Math.random() > 0.5,
    grazing: Math.random() > 0.7, // Some shrimp are grazing
    wobble: Math.random() * Math.PI * 2,
  };
}

// Create a bubble (rare, gentle)
function createBubble(x, bottom) {
  return {
    id: Date.now() + Math.random(),
    x,
    y: bottom,
    size: 1.5 + Math.random() * 2,
    speed: 0.3 + Math.random() * 0.3,
  };
}

function ShrimpTank() {
  const containerRef = useRef(null);
  const [shrimp, setShrimp] = useState([]);
  const [bubbles, setBubbles] = useState([]);
  const [mousePos, setMousePos] = useState(null);
  const animationRef = useRef();
  const lastBubbleTime = useRef(0);

  // Initialize shrimp
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const initialShrimp = Array.from({ length: 5 }, (_, i) =>
      createShrimp(i, rect.width, rect.height)
    );
    setShrimp(initialShrimp);
  }, []);

  // Mouse handlers
  const handleMouseMove = useCallback((e) => {
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  }, []);

  const handleMouseLeave = useCallback(() => setMousePos(null), []);

  // Click to add shrimp
  const handleClick = useCallback((e) => {
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    
    const newShrimp = createShrimp(Date.now(), rect.width, rect.height);
    newShrimp.x = e.clientX - rect.left;
    newShrimp.y = Math.max(rect.height * 0.5, e.clientY - rect.top);
    
    setShrimp(prev => [...prev.slice(-8), newShrimp]);
  }, []);

  // Main animation loop
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const animate = () => {
      const rect = container.getBoundingClientRect();
      const now = Date.now();

      // Rare gentle bubbles from plants
      if (now - lastBubbleTime.current > 3000 + Math.random() * 4000) {
        setBubbles(prev => [
          ...prev.slice(-5),
          createBubble(rect.width * 0.15, rect.height - 15),
        ]);
        lastBubbleTime.current = now;
      }

      // Update bubbles
      setBubbles(prev => prev
        .map(b => ({ ...b, y: b.y - b.speed }))
        .filter(b => b.y > -5)
      );

      // Update shrimp
      setShrimp(prevShrimp => prevShrimp.map(s => {
        let { x, y, vx, vy, flipX, grazing, wobble, size } = s;

        // Gentle avoidance of mouse
        if (mousePos) {
          const dx = x - mousePos.x;
          const dy = y - mousePos.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 40) {
            const force = (40 - dist) / 40 * 0.15;
            vx += (dx / dist) * force;
            vy += (dy / dist) * force;
            grazing = false;
          }
        }

        // Grazing behavior (stay mostly still, small movements)
        if (grazing) {
          vx += (Math.random() - 0.5) * 0.02;
          vy += (Math.random() - 0.5) * 0.01;
          // Occasionally start moving
          if (Math.random() < 0.002) grazing = false;
        } else {
          // Wandering - slow gentle movement
          vx += (Math.random() - 0.5) * 0.05;
          vy += (Math.random() - 0.5) * 0.02;
          // Occasionally start grazing
          if (Math.random() < 0.01) grazing = true;
        }

        // Wobble animation
        wobble += 0.08;

        // Strong damping for slow movement
        vx *= 0.92;
        vy *= 0.92;

        // Speed limits (very slow)
        const maxSpeed = 0.8;
        vx = Math.max(-maxSpeed, Math.min(maxSpeed, vx));
        vy = Math.max(-maxSpeed * 0.5, Math.min(maxSpeed * 0.5, vy));

        // Move
        x += vx;
        y += vy;

        // Boundaries - shrimp stay in bottom area
        const padding = 5;
        const topLimit = rect.height * 0.35;
        
        if (x < padding) { x = padding; vx = Math.abs(vx) * 0.5; }
        if (x > rect.width - padding - size) { 
          x = rect.width - padding - size; 
          vx = -Math.abs(vx) * 0.5; 
        }
        if (y < topLimit) { y = topLimit; vy = Math.abs(vy) * 0.5; }
        if (y > rect.height - padding - 8) { 
          y = rect.height - padding - 8; 
          vy = -Math.abs(vy) * 0.3; 
        }

        // Flip based on direction
        if (Math.abs(vx) > 0.1) {
          flipX = vx < 0;
        }

        return { ...s, x, y, vx, vy, flipX, grazing, wobble };
      }));

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [mousePos]);

  return (
    <div
      ref={containerRef}
      className="relative size-full overflow-hidden cursor-pointer select-none rounded-xl"
      style={{
        background: 'linear-gradient(to bottom, #1a2f23 0%, #0f1a14 100%)',
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      {/* Ambient light from above */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 0%, rgba(255,255,255,0.03) 0%, transparent 60%)',
        }}
      />

      {/* Dragon stone (left) */}
      <div
        className="absolute bottom-1"
        style={{
          left: '8%',
          width: 18,
          height: 22,
          background: 'linear-gradient(135deg, #4a4a4a 0%, #2d2d2d 100%)',
          borderRadius: '40% 50% 20% 30%',
          opacity: 0.8,
        }}
      />

      {/* Dragon stone (right) */}
      <div
        className="absolute bottom-1"
        style={{
          right: '12%',
          width: 14,
          height: 16,
          background: 'linear-gradient(135deg, #555 0%, #333 100%)',
          borderRadius: '50% 40% 30% 40%',
          opacity: 0.8,
        }}
      />

      {/* Driftwood */}
      <div
        className="absolute bottom-2"
        style={{
          left: '35%',
          width: 30,
          height: 6,
          background: 'linear-gradient(90deg, #3d2914 0%, #5c3d1e 50%, #3d2914 100%)',
          borderRadius: '30%',
          transform: 'rotate(-8deg)',
          opacity: 0.9,
        }}
      />

      {/* Java Moss on driftwood */}
      <div
        className="absolute"
        style={{
          left: '38%',
          bottom: 6,
          width: 20,
          height: 12,
          background: 'radial-gradient(ellipse, #2d5a2d 30%, #1a3d1a 100%)',
          borderRadius: '60% 70% 50% 40%',
          opacity: 0.85,
        }}
      />

      {/* Monte Carlo carpet (left patch) */}
      <div
        className="absolute bottom-0"
        style={{
          left: '5%',
          width: '25%',
          height: 8,
          background: 'linear-gradient(90deg, #2d6b2d 0%, #3d8b3d 50%, #2d6b2d 100%)',
          borderRadius: '50% 60% 0 0',
          opacity: 0.9,
        }}
      />

      {/* Monte Carlo carpet (right patch) */}
      <div
        className="absolute bottom-0"
        style={{
          right: '5%',
          width: '30%',
          height: 10,
          background: 'linear-gradient(90deg, #3d8b3d 0%, #2d6b2d 50%, #3d8b3d 100%)',
          borderRadius: '60% 50% 0 0',
          opacity: 0.9,
        }}
      />

      {/* Rotala stem plant (back left) */}
      {[0, 1, 2].map(i => (
        <div
          key={`rotala-l-${i}`}
          className="absolute origin-bottom"
          style={{
            left: `${10 + i * 4}%`,
            bottom: 5,
            width: 3,
            height: 35 - i * 5,
            background: 'linear-gradient(to top, #2d5a2d, #4d8b4d)',
            borderRadius: '50%',
            animation: `gentleSway ${4 + i * 0.5}s ease-in-out infinite`,
            animationDelay: `${i * 0.3}s`,
          }}
        />
      ))}

      {/* Rotala stem plant (back right) */}
      {[0, 1].map(i => (
        <div
          key={`rotala-r-${i}`}
          className="absolute origin-bottom"
          style={{
            right: `${15 + i * 5}%`,
            bottom: 5,
            width: 3,
            height: 30 - i * 8,
            background: 'linear-gradient(to top, #2d5a2d, #5a9b5a)',
            borderRadius: '50%',
            animation: `gentleSway ${4.5 + i * 0.5}s ease-in-out infinite`,
            animationDelay: `${i * 0.4}s`,
          }}
        />
      ))}

      {/* Substrate (fine black sand) */}
      <div
        className="absolute bottom-0 w-full h-1.5"
        style={{ 
          background: 'linear-gradient(to right, #1a1a1a, #252525, #1a1a1a)',
        }}
      />

      {/* Bubbles */}
      {bubbles.map(b => (
        <div
          key={b.id}
          className="absolute rounded-full pointer-events-none"
          style={{
            left: b.x,
            top: b.y,
            width: b.size,
            height: b.size,
            background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.6), rgba(255,255,255,0.15))',
          }}
        />
      ))}

      {/* Shrimp */}
      {shrimp.map(s => (
        <div
          key={s.id}
          className="absolute pointer-events-none"
          style={{
            left: s.x,
            top: s.y,
            transform: `scaleX(${s.flipX ? -1 : 1})`,
          }}
        >
          {/* Shrimp body - simplified but cute */}
          <svg
            width={s.size}
            height={s.size * 0.5}
            viewBox="0 0 20 10"
            fill="none"
          >
            {/* Body segments */}
            <ellipse cx="10" cy="5" rx="7" ry="4" fill={s.color} opacity={0.95} />
            <ellipse cx="12" cy="5" rx="5" ry="3" fill={s.color} opacity={0.9} />
            {/* Head */}
            <ellipse cx="4" cy="5" rx="3.5" ry="3" fill={s.color} />
            {/* Eye */}
            <circle cx="2.5" cy="4" r="0.8" fill="#1e1e1e" />
            {/* Antennae */}
            <line x1="1" y1="3" x2="-2" y2="1" stroke={s.color} strokeWidth="0.5" opacity={0.8} />
            <line x1="1" y1="4" x2="-2" y2="3" stroke={s.color} strokeWidth="0.5" opacity={0.8} />
            {/* Tail fan */}
            <path d="M17 5 L20 3 L20 7 Z" fill={s.color} opacity={0.8} />
            {/* Legs (simplified) */}
            {s.grazing && (
              <>
                <line x1="6" y1="8" x2="5" y2="10" stroke={s.color} strokeWidth="0.4" opacity={0.6} />
                <line x1="8" y1="8" x2="8" y2="10" stroke={s.color} strokeWidth="0.4" opacity={0.6} />
                <line x1="10" y1="8" x2="11" y2="10" stroke={s.color} strokeWidth="0.4" opacity={0.6} />
              </>
            )}
          </svg>
        </div>
      ))}

      {/* Subtle hint */}
      <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 text-[8px] text-white/15 pointer-events-none">
        tap to add shrimp
      </div>

      <style>{`
        @keyframes gentleSway {
          0%, 100% { transform: rotate(-2deg); }
          50% { transform: rotate(2deg); }
        }
      `}</style>
    </div>
  );
}

export default memo(ShrimpTank);
