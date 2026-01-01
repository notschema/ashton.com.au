import { useEffect, useRef, useCallback, useState } from 'react';

/**
 * HAUNT V3 - Premium Website Pet
 * Weather-aware, slow wandering, with feet
 */

// ============================================
// UTILITIES
// ============================================

const easeInOutCubic = (t) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
const lerp = (a, b, t) => a + (b - a) * t;
const clamp = (val, min, max) => Math.max(min, Math.min(max, val));
const random = (min, max) => Math.random() * (max - min) + min;
const randomInt = (min, max) => Math.floor(random(min, max + 1));

// ============================================
// WEATHER
// ============================================

const SYDNEY_LAT = -33.87;
const SYDNEY_LON = 151.21;

async function fetchWeather() {
    try {
        const res = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${SYDNEY_LAT}&longitude=${SYDNEY_LON}&current=temperature_2m,weather_code,is_day`
        );
        const data = await res.json();
        return {
            temp: data.current.temperature_2m,
            code: data.current.weather_code,
            isDay: data.current.is_day === 1
        };
    } catch (e) {
        console.warn('Weather fetch failed:', e);
        return { temp: 20, code: 0, isDay: true };
    }
}

function getWeatherState(weather) {
    if (!weather.isDay) return { state: 'night', temp: weather.temp };
    const code = weather.code;
    let state = 'cloudy';
    if (code <= 1) state = 'sunny';
    else if (code <= 3) state = 'cloudy';
    else if (code >= 51 && code <= 67) state = 'rainy';
    else if (code >= 80 && code <= 82) state = 'rainy';
    else if (code >= 95) state = 'stormy';
    
    // Cold check (<20°C)
    if (weather.temp < 20) state = 'cold';
    
    return { state, temp: weather.temp };
}

// ============================================
// TIMING
// ============================================

const WANDER_INTERVAL_MIN = 8000;   // 8 seconds
const WANDER_INTERVAL_MAX = 15000;  // 15 seconds
const IDLE_DURATION_MIN = 3000;     // 3 seconds pause
const IDLE_DURATION_MAX = 6000;     // 6 seconds pause
const MOVE_SPEED = 0.4;             // Very slow, Wall-E style
const BLINK_INTERVAL_MIN = 4000;
const BLINK_INTERVAL_MAX = 8000;
const EVENT_INTERVAL_MIN = 25000;
const EVENT_INTERVAL_MAX = 40000;

// ============================================
// HAUNT CLASS
// ============================================

class Haunt {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        
        // Position
        this.x = width / 2;
        this.y = height - 35;
        this.targetX = this.x;
        this.homeY = this.y;
        
        // Movement state
        this.isMoving = false;
        this.facingRight = true;
        this.walkCycle = 0;
        
        // Animation
        this.floatPhase = 0;
        this.scale = 1;
        this.rotation = 0;
        
        // Eyes
        this.eyeLookX = 0;
        this.eyeLookY = 0;
        this.isBlinking = false;
        this.lastBlink = Date.now();
        this.nextBlinkIn = random(BLINK_INTERVAL_MIN, BLINK_INTERVAL_MAX);
        
        // Expression
        this.mouthOpen = 0;
        this.showHeart = false;
        
        // Wandering
        this.lastWander = Date.now();
        this.nextWanderIn = random(WANDER_INTERVAL_MIN, WANDER_INTERVAL_MAX);
        this.idleUntil = 0;
        
        // Events
        this.currentEvent = null;
        this.eventProgress = 0;
        this.lastEvent = Date.now();
        this.nextEventIn = random(EVENT_INTERVAL_MIN, EVENT_INTERVAL_MAX);
        this.events = ['giggle', 'hop', 'lookAround', 'spin'];
        
        // Weather
        this.weatherState = 'cloudy';
        this.isSleeping = false;
        this.baseIsSleeping = false;
        
        // Bento State (from other components)
        this.isVibing = false;      // Music playing
        this.discordStatus = 'offline';
        this.vibePhase = 0;
        this.musicNotes = [];
    }

    setWeather(state) {
        this.weatherState = state;
        this.baseIsSleeping = state === 'night';
    }
    
    setSpotifyState(isPlaying) {
        this.isVibing = isPlaying;
        this.updateSleepState();
    }
    
    setDiscordState(status) {
        this.discordStatus = status;
        this.updateSleepState();
    }
    
    updateSleepState() {
        // Don't sleep if bento is active (music playing or user online/playing)
        const bentoActive = this.isVibing || 
                           this.discordStatus === 'online' || 
                           this.discordStatus === 'dnd';
        this.isSleeping = this.baseIsSleeping && !bentoActive;
    }

    update(deltaTime, mouseX, mouseY, isMouseInside, isMouseOnPet) {
        const now = Date.now();
        
        // === SLEEPING (night mode) ===
        if (this.isSleeping) {
            this.floatPhase += (deltaTime / 4000) * Math.PI * 2;
            if (this.floatPhase > Math.PI * 2) this.floatPhase -= Math.PI * 2;
            return;
        }
        
        // === FLOATING ===
        this.floatPhase += (deltaTime / 3500) * Math.PI * 2;
        if (this.floatPhase > Math.PI * 2) this.floatPhase -= Math.PI * 2;
        
        // === VIBING (music playing) ===
        if (this.isVibing) {
            this.vibePhase += deltaTime * 0.012;
            // Spawn music notes occasionally
            if (Math.random() < 0.015) {
                this.musicNotes.push({
                    x: this.x + (Math.random() - 0.5) * 20,
                    y: this.y - 25,
                    vx: (Math.random() - 0.5) * 0.5,
                    vy: -0.8,
                    life: 1
                });
            }
        }
        
        // Update music notes
        this.musicNotes = this.musicNotes.filter(note => {
            note.x += note.vx;
            note.y += note.vy;
            note.life -= 0.015;
            return note.life > 0;
        });
        
        // === BLINKING ===
        if (!this.isBlinking && now - this.lastBlink > this.nextBlinkIn) {
            this.isBlinking = true;
            this.lastBlink = now;
            setTimeout(() => {
                this.isBlinking = false;
                this.nextBlinkIn = random(BLINK_INTERVAL_MIN, BLINK_INTERVAL_MAX);
            }, 150);
        }
        
        // === WANDERING (slow, Wall-E style) ===
        if (now > this.idleUntil && !this.currentEvent) {
            if (!this.isMoving && now - this.lastWander > this.nextWanderIn) {
                // Pick new destination
                const margin = 30;
                this.targetX = random(margin, this.width - margin);
                this.isMoving = true;
                this.lastWander = now;
            }
            
            if (this.isMoving) {
                const dx = this.targetX - this.x;
                if (Math.abs(dx) > 2) {
                    // Move slowly
                    this.x += Math.sign(dx) * MOVE_SPEED;
                    this.facingRight = dx > 0;
                    this.walkCycle += deltaTime * 0.008;
                } else {
                    // Arrived, pause
                    this.isMoving = false;
                    this.idleUntil = now + random(IDLE_DURATION_MIN, IDLE_DURATION_MAX);
                    this.nextWanderIn = random(WANDER_INTERVAL_MIN, WANDER_INTERVAL_MAX);
                }
            }
        }
        
        // === RANDOM EVENTS ===
        // Adjust frequency based on Discord status
        let eventMultiplier = 1;
        if (this.discordStatus === 'online') eventMultiplier = 0.7;  // More active
        if (this.discordStatus === 'dnd') eventMultiplier = 2;       // Calmer
        if (this.discordStatus === 'offline') eventMultiplier = 1.5; // Bit slower
        
        const adjustedInterval = this.nextEventIn * eventMultiplier;
        if (!this.currentEvent && now - this.lastEvent > adjustedInterval) {
            this.currentEvent = this.events[randomInt(0, this.events.length - 1)];
            this.eventProgress = 0;
            this.lastEvent = now;
            this.nextEventIn = random(EVENT_INTERVAL_MIN, EVENT_INTERVAL_MAX);
        }
        
        if (this.currentEvent) {
            this.eventProgress += deltaTime / 1200;
            if (this.eventProgress >= 1) {
                this.currentEvent = null;
                this.eventProgress = 0;
            } else {
                this.processEvent();
            }
        }
        
        // === MOUSE ===
        if (!this.currentEvent) {
            if (isMouseOnPet) {
                this.mouthOpen = lerp(this.mouthOpen, 0.5, 0.1);
                this.showHeart = true;
            } else if (isMouseInside && mouseX !== null) {
                const dx = mouseX - this.x;
                const dy = mouseY - this.y;
                this.eyeLookX = lerp(this.eyeLookX, clamp(dx / 120, -0.4, 0.4), 0.04);
                this.eyeLookY = lerp(this.eyeLookY, clamp(dy / 100, -0.3, 0.3), 0.04);
                this.showHeart = false;
                this.mouthOpen = lerp(this.mouthOpen, 0.1, 0.08);
            } else {
                this.eyeLookX = lerp(this.eyeLookX, 0, 0.02);
                this.eyeLookY = lerp(this.eyeLookY, 0, 0.02);
                this.mouthOpen = lerp(this.mouthOpen, 0.08, 0.04);
                this.showHeart = false;
            }
        }
        
        // Clamp position
        this.x = clamp(this.x, 25, this.width - 25);
        
        // Reset visual states
        this.rotation = lerp(this.rotation, 0, 0.04);
        this.scale = lerp(this.scale, 1, 0.06);
    }

    processEvent() {
        const t = this.eventProgress;
        switch (this.currentEvent) {
            case 'giggle':
                this.rotation = Math.sin(t * Math.PI * 6) * 0.08 * (1 - t);
                this.mouthOpen = 0.7;
                break;
            case 'hop':
                this.scale = 1 + Math.sin(t * Math.PI) * 0.12;
                break;
            case 'lookAround':
                if (t < 0.5) this.eyeLookX = -0.6 * easeInOutCubic(t * 2);
                else this.eyeLookX = -0.6 + 1.2 * easeInOutCubic((t - 0.5) * 2);
                break;
            case 'spin':
                this.rotation = easeInOutCubic(t) * Math.PI * 2;
                break;
        }
    }

    draw(ctx) {
        ctx.save();
        
        // Vibing head bob when music is playing
        const vibeBob = this.isVibing ? Math.sin(this.vibePhase) * 3 : 0;
        const vibeRot = this.isVibing ? Math.sin(this.vibePhase * 0.5) * 0.05 : 0;
        
        const floatOffset = Math.sin(this.floatPhase) * 2;
        ctx.translate(this.x, this.y + floatOffset + vibeBob);
        ctx.rotate(this.rotation + vibeRot);
        ctx.scale(this.scale, this.scale);
        
        // === SLEEPING MODE ===
        if (this.isSleeping) {
            this.drawSleeping(ctx);
            ctx.restore();
            return;
        }
        
        // === SHADOW ===
        ctx.fillStyle = 'rgba(0,0,0,0.15)';
        ctx.beginPath();
        ctx.ellipse(0, 18, 16, 5, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // === FEET (animate when walking) ===
        const leftFootLift = this.isMoving ? Math.sin(this.walkCycle) * 3 : 0;
        const rightFootLift = this.isMoving ? Math.sin(this.walkCycle + Math.PI) * 3 : 0;
        
        ctx.fillStyle = '#7C3AED';
        // Left foot
        ctx.beginPath();
        ctx.ellipse(-8, 16 - leftFootLift, 6, 4, 0, 0, Math.PI * 2);
        ctx.fill();
        // Right foot
        ctx.beginPath();
        ctx.ellipse(8, 16 - rightFootLift, 6, 4, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // === BODY ===
        ctx.shadowBlur = 20;
        ctx.shadowColor = 'rgba(139, 92, 246, 0.35)';
        ctx.fillStyle = '#8B5CF6';
        ctx.beginPath();
        ctx.ellipse(0, 0, 22, 20, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // === EARS ===
        ctx.beginPath();
        ctx.moveTo(-14, -10);
        ctx.quadraticCurveTo(-20, -26, -10, -16);
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(14, -10);
        ctx.quadraticCurveTo(20, -26, 10, -16);
        ctx.fill();
        
        ctx.shadowBlur = 0;
        
        // === BODY HIGHLIGHT ===
        ctx.fillStyle = 'rgba(196, 181, 253, 0.35)';
        ctx.beginPath();
        ctx.ellipse(-5, -5, 7, 5, -0.4, 0, Math.PI * 2);
        ctx.fill();
        
        // === BLUSH ===
        ctx.fillStyle = 'rgba(244, 114, 182, 0.45)';
        ctx.beginPath();
        ctx.ellipse(-14, 3, 4, 2.5, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(14, 3, 4, 2.5, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // === EYES (almond/oval, less round) ===
        const ex = this.eyeLookX * 2;
        const ey = this.eyeLookY * 1.5;
        
        if (!this.isBlinking) {
            // Eye whites (oval/almond shape)
            ctx.fillStyle = '#FAFAFA';
            ctx.beginPath();
            ctx.ellipse(-7 + ex, -3 + ey, 6, 7, -0.1, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.ellipse(7 + ex, -3 + ey, 6, 7, 0.1, 0, Math.PI * 2);
            ctx.fill();
            
            // Iris
            ctx.fillStyle = '#6D28D9';
            ctx.beginPath();
            ctx.ellipse(-7 + ex * 1.2, -2 + ey, 4, 5, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.ellipse(7 + ex * 1.2, -2 + ey, 4, 5, 0, 0, Math.PI * 2);
            ctx.fill();
            
            // Pupil
            ctx.fillStyle = '#1E1B4B';
            ctx.beginPath();
            ctx.arc(-7 + ex * 1.4, -1 + ey, 2.5, 0, Math.PI * 2);
            ctx.arc(7 + ex * 1.4, -1 + ey, 2.5, 0, Math.PI * 2);
            ctx.fill();
            
            // Sparkles
            ctx.fillStyle = '#FFFFFF';
            ctx.beginPath();
            ctx.arc(-9 + ex, -5 + ey, 2, 0, Math.PI * 2);
            ctx.arc(5 + ex, -5 + ey, 2, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(-5 + ex, 0 + ey, 1, 0, Math.PI * 2);
            ctx.arc(9 + ex, 0 + ey, 1, 0, Math.PI * 2);
            ctx.fill();
        } else {
            // Closed eyes
            ctx.strokeStyle = '#6D28D9';
            ctx.lineWidth = 2;
            ctx.lineCap = 'round';
            ctx.beginPath();
            ctx.arc(-7, -3, 5, Math.PI * 0.15, Math.PI * 0.85);
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(7, -3, 5, Math.PI * 0.15, Math.PI * 0.85);
            ctx.stroke();
        }
        
        // === MOUTH ===
        const smileWidth = 5 + this.mouthOpen * 3;
        ctx.strokeStyle = '#4C1D95';
        ctx.lineWidth = 1.5;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.arc(0, 7, smileWidth, Math.PI * 0.1, Math.PI * 0.9);
        ctx.stroke();
        
        // === WEATHER ACCESSORIES ===
        this.drawAccessories(ctx);
        
        // === HEART ===
        if (this.showHeart) {
            ctx.fillStyle = '#F472B6';
            const hy = -32 + Math.sin(Date.now() * 0.004) * 2;
            ctx.save();
            ctx.translate(0, hy);
            ctx.scale(0.8, 0.8);
            ctx.beginPath();
            ctx.moveTo(0, 3);
            ctx.bezierCurveTo(-3, 0, -5, -3, -5, -5);
            ctx.bezierCurveTo(-5, -7, 0, -7, 0, -4);
            ctx.bezierCurveTo(0, -7, 5, -7, 5, -5);
            ctx.bezierCurveTo(5, -3, 3, 0, 0, 3);
            ctx.fill();
            ctx.restore();
        }
        
        ctx.restore();
        
        // === MUSIC NOTES (drawn outside transform) ===
        if (this.musicNotes.length > 0) {
            ctx.font = '12px sans-serif';
            this.musicNotes.forEach(note => {
                ctx.fillStyle = `rgba(167, 139, 250, ${note.life})`;
                ctx.fillText('♪', note.x, note.y);
            });
        }
    }

    drawAccessories(ctx) {
        switch (this.weatherState) {
            case 'sunny':
                // Sunglasses
                ctx.fillStyle = '#1E1B4B';
                ctx.beginPath();
                ctx.roundRect(-14, -7, 10, 6, 2);
                ctx.roundRect(4, -7, 10, 6, 2);
                ctx.fill();
                ctx.strokeStyle = '#1E1B4B';
                ctx.lineWidth = 1.5;
                ctx.beginPath();
                ctx.moveTo(-4, -4);
                ctx.lineTo(4, -4);
                ctx.stroke();
                break;
                
            case 'rainy':
                // Tiny umbrella
                ctx.fillStyle = '#EC4899';
                ctx.beginPath();
                ctx.arc(12, -28, 10, Math.PI, 0);
                ctx.fill();
                ctx.strokeStyle = '#9D174D';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(12, -28);
                ctx.lineTo(12, -10);
                ctx.stroke();
                break;
                
            case 'stormy':
                // Scared squiggles
                ctx.strokeStyle = '#FCD34D';
                ctx.lineWidth = 1.5;
                ctx.beginPath();
                ctx.moveTo(-18, -20);
                ctx.lineTo(-15, -24);
                ctx.lineTo(-18, -28);
                ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(18, -20);
                ctx.lineTo(15, -24);
                ctx.lineTo(18, -28);
                ctx.stroke();
                break;
                
            case 'cold':
                // Cozy scarf
                ctx.fillStyle = '#F472B6';
                ctx.beginPath();
                ctx.ellipse(0, 12, 16, 5, 0, 0, Math.PI * 2);
                ctx.fill();
                // Scarf end
                ctx.fillStyle = '#EC4899';
                ctx.beginPath();
                ctx.roundRect(8, 10, 6, 12, 2);
                ctx.fill();
                break;
        }
        
        // === HEADPHONES (when vibing) ===
        if (this.isVibing) {
            ctx.strokeStyle = '#1E1B4B';
            ctx.lineWidth = 3;
            ctx.lineCap = 'round';
            // Headband
            ctx.beginPath();
            ctx.arc(0, -8, 18, Math.PI * 1.1, Math.PI * 1.9);
            ctx.stroke();
            // Ear cups
            ctx.fillStyle = '#6D28D9';
            ctx.beginPath();
            ctx.ellipse(-17, -2, 5, 6, 0.2, 0, Math.PI * 2);
            ctx.ellipse(17, -2, 5, 6, -0.2, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = '#4C1D95';
            ctx.lineWidth = 1;
            ctx.stroke();
        }
    }

    drawSleeping(ctx) {
        // === BED ===
        // Mattress
        ctx.fillStyle = '#7C3AED';
        ctx.beginPath();
        ctx.roundRect(-30, 5, 60, 12, 4);
        ctx.fill();
        
        // Pillow
        ctx.fillStyle = '#DDD6FE';
        ctx.beginPath();
        ctx.ellipse(-15, 2, 12, 6, -0.1, 0, Math.PI * 2);
        ctx.fill();
        
        // Blanket
        ctx.fillStyle = '#A78BFA';
        ctx.beginPath();
        ctx.roundRect(-25, -5, 45, 14, 3);
        ctx.fill();
        
        // Sleeping Haunt (just head peeking)
        ctx.fillStyle = '#8B5CF6';
        ctx.beginPath();
        ctx.ellipse(-10, -8, 14, 12, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Ear
        ctx.beginPath();
        ctx.moveTo(-18, -14);
        ctx.quadraticCurveTo(-24, -26, -14, -18);
        ctx.fill();
        
        // Closed eyes
        ctx.strokeStyle = '#6D28D9';
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.arc(-14, -8, 4, Math.PI * 0.2, Math.PI * 0.8);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(-6, -8, 4, Math.PI * 0.2, Math.PI * 0.8);
        ctx.stroke();
        
        // Blush
        ctx.fillStyle = 'rgba(244, 114, 182, 0.4)';
        ctx.beginPath();
        ctx.ellipse(-20, -4, 3, 2, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Zzz
        ctx.font = '10px sans-serif';
        ctx.fillStyle = 'rgba(167, 139, 250, 0.8)';
        const zOffset = (Date.now() / 800) % 1;
        ctx.fillText('z', 8, -18 - zOffset * 10);
        ctx.fillText('z', 14, -25 - zOffset * 8);
    }
}

// ============================================
// REACT COMPONENT
// ============================================

export default function Fishtank() {
    const canvasRef = useRef(null);
    const containerRef = useRef(null);
    const hauntRef = useRef(null);
    const mouseRef = useRef({ x: null, y: null, inside: false, onPet: false });
    const lastTimeRef = useRef(Date.now());
    const [weatherLoaded, setWeatherLoaded] = useState(false);

    // Fetch weather on mount
    useEffect(() => {
        fetchWeather().then(weather => {
            const { state } = getWeatherState(weather);
            if (hauntRef.current) {
                hauntRef.current.setWeather(state);
            }
            setWeatherLoaded(true);
        });
    }, []);
    
    // Listen for bento state changes
    useEffect(() => {
        const handleSpotify = (e) => {
            if (hauntRef.current) {
                hauntRef.current.setSpotifyState(e.detail.isPlaying);
            }
        };
        const handleDiscord = (e) => {
            if (hauntRef.current) {
                hauntRef.current.setDiscordState(e.detail.status);
            }
        };
        
        window.addEventListener('spotify-state', handleSpotify);
        window.addEventListener('discord-state', handleDiscord);
        
        return () => {
            window.removeEventListener('spotify-state', handleSpotify);
            window.removeEventListener('discord-state', handleDiscord);
        };
    }, []);

    const render = useCallback(() => {
        const canvas = canvasRef.current;
        const container = containerRef.current;
        if (!canvas || !container || !hauntRef.current) return;

        const ctx = canvas.getContext('2d');
        const now = Date.now();
        const deltaTime = Math.min(now - lastTimeRef.current, 50); // Cap delta
        lastTimeRef.current = now;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const haunt = hauntRef.current;
        if (mouseRef.current.x !== null) {
            const dx = mouseRef.current.x - haunt.x;
            const dy = mouseRef.current.y - haunt.y;
            mouseRef.current.onPet = Math.sqrt(dx * dx + dy * dy) < 30;
        }

        haunt.update(
            deltaTime,
            mouseRef.current.x,
            mouseRef.current.y,
            mouseRef.current.inside,
            mouseRef.current.onPet
        );
        haunt.draw(ctx);

        requestAnimationFrame(render);
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        const container = containerRef.current;
        if (!canvas || !container) return;

        const setSize = () => {
            const width = container.clientWidth;
            const height = container.clientHeight;
            canvas.width = width;
            canvas.height = height;

            if (!hauntRef.current) {
                hauntRef.current = new Haunt(width, height);
            } else {
                hauntRef.current.width = width;
                hauntRef.current.height = height;
                hauntRef.current.homeY = height - 35;
            }
        };

        setSize();
        window.addEventListener('resize', setSize);
        const animationId = requestAnimationFrame(render);

        return () => {
            window.removeEventListener('resize', setSize);
            cancelAnimationFrame(animationId);
        };
    }, [render]);

    const handleMouseMove = (e) => {
        const rect = containerRef.current?.getBoundingClientRect();
        if (rect) {
            mouseRef.current.x = e.clientX - rect.left;
            mouseRef.current.y = e.clientY - rect.top;
            mouseRef.current.inside = true;
        }
    };

    const handleMouseLeave = () => {
        mouseRef.current.x = null;
        mouseRef.current.y = null;
        mouseRef.current.inside = false;
        mouseRef.current.onPet = false;
    };

    return (
        <div
            ref={containerRef}
            className="relative w-full h-full overflow-hidden bg-slate-950 rounded-3xl cursor-default"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >
            <div className="absolute inset-0 bg-gradient-to-br from-violet-950/20 via-transparent to-purple-950/10 pointer-events-none" />
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
        </div>
    );
}
