/**
 * XPresence - X/Twitter Profile Card
 * Shows profile info and recent activity
 * Original implementation following Discord/Spotify patterns
 */

import { useState, useEffect } from 'react';
import { MoveUpRight } from 'lucide-react';
import { cn } from '../../lib/utils';

// Configuration
const X_USERNAME = 'AshtonAU';
const PROFILE_URL = `https://x.com/${X_USERNAME}`;

// X Logo SVG component
function XLogo({ className }) {
    return (
        <svg viewBox="0 0 24 24" className={className} fill="currentColor">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
    );
}

export default function XPresence() {
    // Static profile - X API requires paid access ($100+/month)
    // For a portfolio, a clean static card with Follow button is best practice

    const profile = {
        username: X_USERNAME,
        displayName: 'Ashton',
        bio: 'Systems Engineer & Whitehat Pentester',
    };

    return (
        <div className="group relative h-full overflow-hidden rounded-xl bg-zinc-900/80 backdrop-blur border border-white/5">
            {/* X Logo */}
            <XLogo className="absolute top-3 right-3 h-8 w-8 text-white z-10" />

            {/* Content */}
            <div className="relative z-10 flex h-full flex-col p-5">
                {/* Profile section */}
                <div className="flex items-start gap-3 mb-3">
                    {/* Avatar */}
                    <div className="h-11 w-11 rounded-full bg-gradient-to-br from-blue-500/30 to-zinc-700 flex items-center justify-center shrink-0 ring-2 ring-white/10">
                        <span className="text-lg font-bold text-white">A</span>
                    </div>
                    <div className="min-w-0">
                        <p className="font-semibold text-white">{profile.displayName}</p>
                        <p className="text-sm text-zinc-400">@{profile.username}</p>
                    </div>
                </div>

                {/* Bio */}
                <p className="text-sm text-zinc-300 mb-3">{profile.bio}</p>

                {/* CTA */}
                <p className="text-xs text-zinc-500 mt-auto">
                    Tech insights, security tips, and behind-the-scenes builds.
                </p>
            </div>

            {/* Follow button */}
            <a
                href={PROFILE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute bottom-3 right-3 px-4 py-1.5 rounded-full bg-white text-black text-sm font-semibold hover:bg-zinc-200 transition-colors"
            >
                Follow
            </a>
        </div>
    );
}
