import { useEffect, useRef, useState, memo } from 'react'

interface Fish {
    id: number
    x: number
    y: number
    vx: number
    vy: number
    size: number
    color: string
    flipX: boolean
}

const FISH_COLORS = [
    'oklch(0.72 0.13 50)',   // Orange (primary)
    'oklch(0.80 0.10 80)',   // Yellow
    'oklch(0.60 0.15 35)',   // Terracotta
    'oklch(0.85 0.08 90)',   // Cream
]

const createFish = (id: number, width: number, height: number): Fish => ({
    id,
    x: Math.random() * (width - 40) + 20,
    y: Math.random() * (height - 40) + 20,
    vx: (Math.random() - 0.5) * 2,
    vy: (Math.random() - 0.5) * 1,
    size: Math.random() * 12 + 16,
    color: FISH_COLORS[Math.floor(Math.random() * FISH_COLORS.length)],
    flipX: Math.random() > 0.5,
})

const Fishtank = () => {
    const containerRef = useRef<HTMLDivElement>(null)
    const [fish, setFish] = useState<Fish[]>([])
    const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null)
    const animationRef = useRef<number>()

    // Initialize fish
    useEffect(() => {
        const container = containerRef.current
        if (!container) return

        const rect = container.getBoundingClientRect()
        const initialFish = Array.from({ length: 5 }, (_, i) =>
            createFish(i, rect.width, rect.height)
        )
        setFish(initialFish)
    }, [])

    // Handle mouse movement
    const handleMouseMove = (e: React.MouseEvent) => {
        const container = containerRef.current
        if (!container) return

        const rect = container.getBoundingClientRect()
        setMousePos({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        })
    }

    const handleMouseLeave = () => {
        setMousePos(null)
    }

    // Animation loop
    useEffect(() => {
        const container = containerRef.current
        if (!container) return

        const animate = () => {
            const rect = container.getBoundingClientRect()

            setFish(prevFish => prevFish.map(f => {
                let { x, y, vx, vy, flipX } = f

                // If mouse is near, swim away from it
                if (mousePos) {
                    const dx = x - mousePos.x
                    const dy = y - mousePos.y
                    const dist = Math.sqrt(dx * dx + dy * dy)

                    if (dist < 60) {
                        const force = (60 - dist) / 60
                        vx += (dx / dist) * force * 0.5
                        vy += (dy / dist) * force * 0.3
                    }
                }

                // Add some random movement
                vx += (Math.random() - 0.5) * 0.1
                vy += (Math.random() - 0.5) * 0.05

                // Damping
                vx *= 0.98
                vy *= 0.98

                // Speed limits
                const maxSpeed = 3
                vx = Math.max(-maxSpeed, Math.min(maxSpeed, vx))
                vy = Math.max(-maxSpeed * 0.5, Math.min(maxSpeed * 0.5, vy))

                // Move
                x += vx
                y += vy

                // Boundaries with bounce
                const padding = 10
                if (x < padding) { x = padding; vx = Math.abs(vx) * 0.8 }
                if (x > rect.width - padding - f.size) { x = rect.width - padding - f.size; vx = -Math.abs(vx) * 0.8 }
                if (y < padding) { y = padding; vy = Math.abs(vy) * 0.8 }
                if (y > rect.height - padding - f.size * 0.6) { y = rect.height - padding - f.size * 0.6; vy = -Math.abs(vy) * 0.8 }

                // Flip direction based on velocity
                if (Math.abs(vx) > 0.3) {
                    flipX = vx < 0
                }

                return { ...f, x, y, vx, vy, flipX }
            }))

            animationRef.current = requestAnimationFrame(animate)
        }

        animationRef.current = requestAnimationFrame(animate)

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current)
            }
        }
    }, [mousePos])

    // Add fish on click
    const handleClick = (e: React.MouseEvent) => {
        const container = containerRef.current
        if (!container) return

        const rect = container.getBoundingClientRect()
        const newFish = createFish(Date.now(), rect.width, rect.height)
        newFish.x = e.clientX - rect.left
        newFish.y = e.clientY - rect.top

        setFish(prev => [...prev.slice(-7), newFish]) // Keep max 8 fish
    }

    return (
        <div
            ref={containerRef}
            className="relative size-full overflow-hidden cursor-pointer select-none"
            style={{
                background: 'linear-gradient(to bottom, oklch(0.25 0.04 220), oklch(0.18 0.03 220))'
            }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onClick={handleClick}
        >
            {/* Water caustics */}
            <div className="absolute inset-0 opacity-10 pointer-events-none">
                <div
                    className="absolute inset-0 animate-pulse"
                    style={{
                        background: 'radial-gradient(ellipse at 30% 20%, rgba(255,255,255,0.3) 0%, transparent 50%)',
                    }}
                />
            </div>

            {/* Bubbles */}
            {[...Array(3)].map((_, i) => (
                <div
                    key={`bubble-${i}`}
                    className="absolute rounded-full bg-white/20 animate-[rise_4s_ease-in-out_infinite]"
                    style={{
                        width: 4 + i * 2,
                        height: 4 + i * 2,
                        left: `${25 + i * 25}%`,
                        bottom: 0,
                        animationDelay: `${i * 1.5}s`,
                    }}
                />
            ))}

            {/* Seaweed */}
            {[15, 75].map((left, i) => (
                <div
                    key={`seaweed-${i}`}
                    className="absolute bottom-0 origin-bottom animate-[sway_3s_ease-in-out_infinite]"
                    style={{
                        left: `${left}%`,
                        width: 6,
                        height: 40 + i * 15,
                        background: 'oklch(0.40 0.10 140)',
                        borderRadius: '50% 50% 0 0',
                        animationDelay: `${i * 0.5}s`,
                    }}
                />
            ))}

            {/* Sand */}
            <div
                className="absolute bottom-0 w-full h-3"
                style={{ background: 'oklch(0.65 0.05 80)' }}
            />

            {/* Fish */}
            {fish.map(f => (
                <div
                    key={f.id}
                    className="absolute transition-transform duration-75"
                    style={{
                        left: f.x,
                        top: f.y,
                        transform: `scaleX(${f.flipX ? -1 : 1})`,
                    }}
                >
                    {/* Fish body */}
                    <svg
                        width={f.size}
                        height={f.size * 0.6}
                        viewBox="0 0 24 14"
                        fill="none"
                    >
                        {/* Body */}
                        <ellipse cx="10" cy="7" rx="9" ry="6" fill={f.color} />
                        {/* Tail */}
                        <path d="M19 7L24 2L24 12L19 7Z" fill={f.color} />
                        {/* Eye */}
                        <circle cx="5" cy="6" r="2" fill="oklch(0.12 0.01 60)" />
                        <circle cx="4.5" cy="5.5" r="0.8" fill="white" />
                    </svg>
                </div>
            ))}

            {/* Hint text */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[10px] text-white/30 pointer-events-none">
                click to add fish
            </div>

            <style>{`
        @keyframes rise {
          0% { transform: translateY(0); opacity: 0.6; }
          100% { transform: translateY(-150px); opacity: 0; }
        }
        @keyframes sway {
          0%, 100% { transform: rotate(-5deg); }
          50% { transform: rotate(5deg); }
        }
      `}</style>
        </div>
    )
}

export default memo(Fishtank)
