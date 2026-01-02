/**
 * XCard - Minimal X/Twitter profile card
 * Clean design with just username and subtle tagline
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
            className="group relative h-full flex flex-col overflow-hidden rounded-xl bg-zinc-900/80 backdrop-blur border border-white/5 transition-all duration-300 hover:border-white/10"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* X Logo - top right corner */}
            <XLogo className="absolute top-3 right-3 h-8 w-8 text-white z-10" />

            {/* Subtle hover glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            {/* Content */}
            <div className="relative z-10 flex h-full flex-col justify-center p-5">
                {/* Username */}
                <p className="font-semibold text-white text-lg group-hover:text-zinc-200 transition-colors">
                    @{X_USERNAME}
                </p>
                
                {/* Witty tagline */}
                <p className="text-xs text-zinc-500 mt-1">
                    mostly lurking
                </p>
            </div>
        </a>
    );
}
