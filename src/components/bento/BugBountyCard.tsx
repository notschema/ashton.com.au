/**
 * BugBountyCard - Clean bug bounty hunting card
 * Displays HackerOne/Bugcrowd presence with severity breakdown
 */

import { useState } from 'react';
import { Bug, Shield } from 'lucide-react';

// Configuration - Update these values as you find bugs!
const BUGS_2026 = {
    critical: 0,
    high: 2,
    medium: 0,
    low: 1,
    info: 1,
};

const HACKERONE_USERNAME = 'AshtonSec';
const PROFILE_URL = `https://hackerone.com/${HACKERONE_USERNAME}`;

// Severity colors (Low to Critical)
const SEVERITY_CONFIG = [
    { key: 'info', label: 'I', color: 'text-muted-foreground', bg: 'bg-muted/30 border-border' },
    { key: 'low', label: 'L', color: 'text-blue-400', bg: 'bg-blue-400/10 border-blue-400/20' },
    { key: 'medium', label: 'M', color: 'text-yellow-500', bg: 'bg-yellow-500/10 border-yellow-500/20' },
    { key: 'high', label: 'H', color: 'text-orange-500', bg: 'bg-orange-500/10 border-orange-500/20' },
    { key: 'critical', label: 'C', color: 'text-red-500', bg: 'bg-red-500/10 border-red-500/20' },
];

// Platform badges
const PLATFORMS = [
    { name: 'HackerOne', active: true },
    { name: 'Bugcrowd', active: true },
    { name: 'Private', active: true },
];

export default function BugBountyCard() {
    const [isHovered, setIsHovered] = useState(false);
    const totalBugs = Object.values(BUGS_2026).reduce((a, b) => a + b, 0);

    return (
        <a
            href={PROFILE_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`View bug bounty profile on HackerOne - ${totalBugs} total findings in 2026`}
            className="group relative h-full flex flex-col overflow-hidden bg-transparent transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Radial gradient from logo position */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                <div className="absolute inset-0 bg-gradient-radial from-foreground/[0.04] via-transparent to-transparent" 
                     style={{ backgroundPosition: '50% 50%' }} />
            </div>

            {/* Animated scanline effect */}
            <div className="absolute inset-0 opacity-[0.02] group-hover:opacity-[0.04] transition-opacity duration-500">
                <div 
                    className="absolute inset-0"
                    style={{
                        backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, var(--foreground) 2px, var(--foreground) 4px)',
                        opacity: 0.03,
                    }}
                />
            </div>

            {/* Large bug icon as background element */}
            <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] group-hover:opacity-[0.06] transition-all duration-500">
                <Bug className="h-32 w-32 text-foreground group-hover:scale-110 transition-transform duration-700" />
            </div>

            {/* Glowing icon in corner */}
            <div className="absolute top-3 right-3 z-10">
                <div className="relative">
                    <div className="absolute inset-0 blur-xl opacity-0 group-hover:opacity-60 transition-opacity duration-500">
                        <Shield className="h-7 w-7 text-primary" />
                    </div>
                    <Shield className="h-7 w-7 text-foreground relative z-10 group-hover:text-primary transition-colors duration-300" />
                </div>
            </div>

            {/* Content */}
            <div className="relative z-10 flex h-full flex-col justify-center items-center p-4">
                {/* Title */}
                <p className="font-bold text-lg text-foreground mb-1">Bug Bounty</p>
                <p className="font-mono text-[10px] text-muted-foreground mb-3">2026 FINDINGS</p>

                {/* Severity breakdown */}
                <div className="flex gap-2 mb-3">
                    {SEVERITY_CONFIG.map(sev => (
                        <div 
                            key={sev.key}
                            className={`flex flex-col items-center px-3 py-2 border ${sev.bg} transition-all`}
                            title={sev.key.charAt(0).toUpperCase() + sev.key.slice(1)}
                        >
                            <span className={`font-mono text-sm font-bold ${sev.color}`}>{sev.label}</span>
                            <span className="font-mono text-lg font-semibold text-foreground tabular-nums">{BUGS_2026[sev.key as keyof typeof BUGS_2026]}</span>
                        </div>
                    ))}
                </div>

                {/* Total */}
                <p className="font-mono text-xs text-muted-foreground">
                    <span className="text-foreground font-bold">{totalBugs}</span> total
                </p>
            </div>

            {/* Bottom glow accent */}
            <div className="absolute bottom-0 left-0 right-0 h-px">
                <div className="h-full w-full bg-gradient-to-r from-transparent via-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute inset-0 blur-sm bg-gradient-to-r from-transparent via-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>

            {/* External link indicator */}
            <div className="absolute bottom-3 right-3 p-1.5 bg-muted/50 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M17 7H7M17 7V17" />
                </svg>
            </div>
        </a>
    );
}
