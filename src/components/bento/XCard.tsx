/**
 * XCard - Beautiful X/Twitter profile link card
 * Elegant design with avatar, subtle gradient and premium hover effects
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
                {/* Content */}
            <div className="relative z-10 flex flex-col items-center justify-center h-full p-4">
                {/* X Logo - Large & Centered */}
                <div className="relative mb-4 group-hover:scale-110 transition-transform duration-300">
                    <XLogo className="h-10 w-10 text-white group-hover:text-white transition-colors duration-300" />
                    <div className="absolute inset-0 blur-md opacity-0 group-hover:opacity-40 transition-opacity duration-300">
                        <XLogo className="h-10 w-10 text-white" />
                    </div>
                </div>

                {/* Handle */}
                <div className="text-center mb-6">
                    <p className="font-semibold text-white text-sm group-hover:text-white transition-colors">
                        @{X_USERNAME}
                    </p>
                </div>

                {/* Follow button */}
                <div className="relative">
                    <div className="absolute -inset-1 bg-white/10 rounded-full blur opacity-0 group-hover:opacity-50 transition-opacity duration-300" />
                    <div className="relative px-5 py-1.5 rounded-full bg-white/5 border border-white/10 group-hover:bg-white group-hover:border-white transition-all duration-300 group-hover:shadow-lg group-hover:shadow-white/10">
                        <span className="text-xs font-semibold text-zinc-400 group-hover:text-black transition-colors duration-200">
                            Follow
                        </span>
                    </div>
                </div>
            </div>

            {/* Bottom accent line */}
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </a>
    );
}
