/**
 * SydneyTime - Original Implementation
 * Shows current time in Sydney with contextual message
 */

import { useState, useEffect } from 'react';

const TIMEZONE = 'Australia/Sydney';

// Get contextual message based on hour
function getMessage(hour) {
    if (hour >= 0 && hour < 6) {
        const late = [
            "burning the midnight oil",
            "probably debugging something",
            "deep in a security rabbit hole",
            "catching up on writeups",
        ];
        return late[Math.floor(Math.random() * late.length)];
    }
    if (hour >= 6 && hour < 9) return "getting caffeinated";
    if (hour >= 9 && hour < 12) return "in deep work mode";
    if (hour >= 12 && hour < 14) return "grabbing lunch";
    if (hour >= 14 && hour < 17) return "still building things";
    if (hour >= 17 && hour < 21) return "winding down";
    return "probably still tinkering";
}

export default function SydneyTime() {
    const [time, setTime] = useState(null);

    useEffect(() => {
        function update() {
            setTime(new Date());
        }

        update();
        const interval = setInterval(update, 60000);
        return () => clearInterval(interval);
    }, []);

    if (!time) {
        return <span className="text-zinc-500">...</span>;
    }

    const formatted = time.toLocaleTimeString('en-AU', {
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

    const message = getMessage(hour);

    return (
        <span className="text-zinc-400 text-sm">
            It's <span className="text-blue-400 font-medium">{formatted}</span> in Sydney, so I'm {message}
        </span>
    );
}
