/**
 * HeroCard - Personal intro with location and time
 * Theme-aware with semantic color tokens
 */

import { useState, useEffect } from 'react';
import { MapPin } from 'lucide-react';

const TIMEZONE = 'Australia/Sydney';

// Rotating bio snippets - casual storytelling
const BIO_SNIPPETS = [
    "ex-google. ex-apple. now learning the security side of things and breaking stuff along the way.",
    "10+ years in IT, now getting into security. still learning, still breaking things.",
    "systems engineer by trade, aspiring security nerd. figuring it out one bug at a time.",
    "ex-big tech, now dabbling in pentesting and bug bounties. work in progress.",
    "from helpdesk to hybrid cloud to trying to hack things (legally). the journey continues.",
];

// Get contextual message based on hour
function getTimeContext(hour) {
    if (hour >= 0 && hour < 6) return "night owl mode";
    if (hour >= 6 && hour < 9) return "caffeinating";
    if (hour >= 9 && hour < 12) return "in the zone";
    if (hour >= 12 && hour < 14) return "touching grass";
    if (hour >= 14 && hour < 17) return "breaking things";
    if (hour >= 17 && hour < 21) return "off the clock";
    return "probably hacking something";
}

export default function HeroCard() {
    const [time, setTime] = useState(null);
    const [bioSnippet] = useState(() => 
        BIO_SNIPPETS[Math.floor(Math.random() * BIO_SNIPPETS.length)]
    );

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
        <div className="relative h-full overflow-hidden bg-transparent p-6 flex flex-col">
            {/* Gradient accent */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-primary/5 to-transparent" />

            {/* Content */}
            <div className="relative z-10 flex-1 flex flex-col">
                {/* Greeting */}
                <div className="mb-4">
                    <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">
                        hey, i'm <span className="text-primary">ashton</span>
                    </h1>
                    <p className="text-muted-foreground/80 text-xs sm:text-sm leading-relaxed">
                        {bioSnippet}{' '}
                        <a href="/about" className="text-primary hover:underline">more about me</a>.
                    </p>
                </div>

                {/* Location + Time */}
                <div className="mt-auto pt-4 border-t border-border space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">sydney</span>
                        <span className="text-border">•</span>
                        <span className="text-muted-foreground">
                            <span className="text-primary font-medium">{timeDisplay}</span> local
                        </span>
                    </div>
                    <p className="text-xs text-muted-foreground/70 ml-6">
                        {context}
                    </p>

                    {/* Contact CTA */}
                    <a
                        href="mailto:hello@ashton.com.au"
                        className="inline-flex items-center gap-2 px-4 py-2 border border-border text-foreground hover:border-foreground/50 hover:bg-background/50 transition-colors text-sm font-medium"
                    >
                        Get in touch
                    </a>
                </div>
            </div>
        </div>
    );
}


