/**
 * XCard - Premium X/Twitter profile card
 * Enhanced with depth, animations, and visual polish
 */

import { useState } from 'react';

// X Logo SVG
function XLogo({ className }) {
    return (
        <svg viewBox="0 0 24 24" className={className} fill="currentColor">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
    );
}

const X_USERNAME = 'AshtonAU';
const PROFILE_URL = `https://x.com/${X_USERNAME}`;

export default function XCard() {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <a
            href={PROFILE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative h-full flex flex-col overflow-hidden rounded-xl bg-zinc-900/80 backdrop-blur border border-white/5 transition-all duration-300 hover:border-white/20"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Noise texture overlay */}
            <div 
                className="absolute inset-0 opacity-[0.015] pointer-events-none"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                }}
            />

            {/* Radial gradient from logo position */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                <div className="absolute inset-0 bg-gradient-radial from-white/[0.04] via-transparent to-transparent" 
                     style={{ backgroundPosition: '50% 50%' }} />
            </div>

            {/* Animated scanline effect */}
            <div className="absolute inset-0 opacity-[0.02] group-hover:opacity-[0.04] transition-opacity duration-500">
                <div 
                    className="absolute inset-0"
                    style={{
                        backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)',
                    }}
                />
            </div>

            {/* Large X logo as background element */}
            <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] group-hover:opacity-[0.06] transition-all duration-500">
                <XLogo className="h-32 w-32 text-white group-hover:scale-110 transition-transform duration-700" />
            </div>

            {/* Glowing X logo in corner */}
            <div className="absolute top-3 right-3 z-10">
                <div className="relative">
                    {/* Glow effect */}
                    <div className="absolute inset-0 blur-xl opacity-0 group-hover:opacity-60 transition-opacity duration-500">
                        <XLogo className="h-8 w-8 text-cyan-400" />
                    </div>
                    {/* Main logo */}
                    <XLogo className="h-8 w-8 text-white relative z-10 group-hover:text-cyan-100 transition-colors duration-300" />
                </div>
            </div>

            {/* Content */}
            <div className="relative z-10 flex h-full flex-col justify-center items-center p-5">
                {/* Username with enhanced typography */}
                <div className="text-center">
                    <p className="font-bold text-2xl text-white group-hover:text-white transition-all duration-300 tracking-tight mb-1">
                        @{X_USERNAME}
                    </p>
                    
                    {/* Tagline with monospace font */}
                    <p className="font-mono text-xs text-zinc-500 group-hover:text-zinc-400 transition-colors duration-300 tracking-wider">
                        mostly lurking
                    </p>
                </div>
            </div>

            {/* Bottom glow accent */}
            <div className="absolute bottom-0 left-0 right-0 h-px">
                <div className="h-full w-full bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute inset-0 blur-sm bg-gradient-to-r from-transparent via-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>

            {/* Corner accent decoration */}
            <div className="absolute bottom-3 left-3 opacity-20 group-hover:opacity-40 transition-opacity duration-300">
                <div className="flex gap-1">
                    <div className="w-1 h-1 bg-white rounded-full"></div>
                    <div className="w-1 h-1 bg-white rounded-full"></div>
                    <div className="w-1 h-1 bg-white rounded-full"></div>
                </div>
            </div>
        </a>
    );
}
