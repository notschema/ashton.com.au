/**
 * HeroCard - Personal intro with location and time
 * Fun and edgy vibe, not geeky
 */

import { useState, useEffect } from 'react';
import { MapPin } from 'lucide-react';

const TIMEZONE = 'Australia/Sydney';

// Get contextual message based on hour
function getTimeContext(hour) {
    if (hour >= 0 && hour < 6) return "night owl mode 🦉";
    if (hour >= 6 && hour < 9) return "caffeinating ☕";
    if (hour >= 9 && hour < 12) return "in the zone 💀";
    if (hour >= 12 && hour < 14) return "touching grass 🌱";
    if (hour >= 14 && hour < 17) return "breaking things 🔥";
    if (hour >= 17 && hour < 21) return "off the clock ✌️";
    return "probably hacking something 👾";
}

export default function HeroCard() {
    const [time, setTime] = useState(null);

    useEffect(() => {
        const update = () => setTime(new Date());
        update();
        const interval = setInterval(update, 60000);
        return () => clearInterval(interval);
    }, []);

    let timeDisplay = '...';
    let context = '';

    if (time) {
        timeDisplay = time.toLocaleTimeString('en-AU', {
            timeZone: TIMEZONE,
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
        }).toLowerCase();

        const hour = parseInt(
            time.toLocaleTimeString('en-AU', {
                timeZone: TIMEZONE,
                hour: 'numeric',
                hour12: false,
            })
        );
        context = getTimeContext(hour);
    }

    return (
        <div className="relative h-full overflow-hidden rounded-xl bg-zinc-900/80 backdrop-blur border border-white/5 p-6 flex flex-col">
            {/* Gradient accent */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-blue-500/10 to-transparent rounded-bl-full" />

            {/* Content */}
            <div className="relative z-10 flex-1 flex flex-col">
                {/* Greeting */}
                <div className="mb-4">
                    <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                        yo, i'm <span className="text-blue-400">ashton</span>
                    </h1>
                    <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
                        i break into systems for a living. pentester by day,
                        infrastructure nerd by night. sydney-based.
                    </p>
                </div>

                {/* Spiel */}
                <p className="text-zinc-500 text-sm mb-4">
                    if it's connected, i'll find a way in. red team ops, secure infra,
                    and the occasional CTF when i'm bored.
                </p>

                {/* Location + Time */}
                <div className="mt-auto pt-4 border-t border-white/5">
                    <div className="flex items-center gap-2 text-sm">
                        <MapPin className="h-4 w-4 text-zinc-500" />
                        <span className="text-zinc-400">sydney</span>
                        <span className="text-zinc-600">•</span>
                        <span className="text-zinc-400">
                            <span className="text-blue-400 font-medium">{timeDisplay}</span> local
                        </span>
                    </div>
                    <p className="text-xs text-zinc-500 mt-1 ml-6">
                        {context}
                    </p>
                </div>
            </div>
        </div>
    );
}
