/**
 * DiscordPresence - Original Implementation
 * Shows live Discord status, avatar, and current activity
 * Uses Lanyard API for real-time presence data
 */

import { useState, useEffect } from 'react';
import { FaDiscord } from 'react-icons/fa';
import { cn } from '../../lib/utils';

// Configuration
const DISCORD_ID = '169372933913968649';
const LANYARD_API = 'https://api.lanyard.rest/v1/users';

// Status styling map
const STATUS_STYLES = {
  online: { bg: 'bg-green-500', glow: 'shadow-[0_0_8px_rgba(34,197,94,0.6)]' },
  idle: { bg: 'bg-yellow-500', glow: 'shadow-[0_0_8px_rgba(234,179,8,0.6)]' },
  dnd: { bg: 'bg-red-500', glow: 'shadow-[0_0_8px_rgba(239,68,68,0.6)]' },
  offline: { bg: 'bg-zinc-500', glow: '' },
};

// Format elapsed time as HH:MM:SS or MM:SS
function formatElapsed(startMs) {
  const diff = Date.now() - startMs;
  const secs = Math.floor((diff / 1000) % 60);
  const mins = Math.floor((diff / 60000) % 60);
  const hrs = Math.floor(diff / 3600000);

  return hrs > 0
    ? `${hrs}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
    : `${mins}:${String(secs).padStart(2, '0')}`;
}

// Skeleton loader component
function Loader({ className }) {
  return <div className={cn('animate-pulse bg-white/10 rounded', className)} />;
}

// Status dot indicator
function StatusDot({ status }) {
  const style = STATUS_STYLES[status] || STATUS_STYLES.offline;
  return (
    <span className={cn(
      'absolute -bottom-0.5 -right-0.5 h-4 w-4 rounded-full border-2 border-zinc-900',
      style.bg, style.glow
    )} />
  );
}

export default function DiscordPresence() {
  const [presence, setPresence] = useState(null);
  const [loading, setLoading] = useState(true);
  const [elapsed, setElapsed] = useState('');

  // Fetch presence data
  useEffect(() => {
    let mounted = true;

    async function fetchPresence() {
      try {
        const res = await fetch(`${LANYARD_API}/${DISCORD_ID}`);
        const json = await res.json();
        if (mounted && json.success) {
          setPresence(json.data);
          
          // Broadcast to other components (like Haunt)
          const activity = json.data.activities?.find(a => a.type === 0);
          window.dispatchEvent(new CustomEvent('discord-state', { 
            detail: { 
              status: json.data.discord_status,
              isPlaying: !!activity,
              activity: activity?.name || null
            } 
          }));
        }
      } catch (e) {
        console.error('Lanyard fetch failed:', e);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchPresence();
    const interval = setInterval(fetchPresence, 30000);
    return () => { mounted = false; clearInterval(interval); };
  }, []);

  // Update elapsed timer
  useEffect(() => {
    const activity = presence?.activities?.find(a => a.type === 0 && a.timestamps?.start);
    if (!activity) { setElapsed(''); return; }

    const tick = () => setElapsed(formatElapsed(activity.timestamps.start));
    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, [presence?.activities]);

  // Loading state
  if (loading) {
    return (
      <div className="relative h-full overflow-hidden rounded-xl bg-zinc-900/50 backdrop-blur">
        <div className="absolute top-3 right-3">
          <FaDiscord className="h-10 w-10 text-[#5865F2]" />
        </div>
        <div className="flex h-full flex-col p-5">
          <Loader className="h-4 w-20 mb-3" />
          <div className="flex items-center gap-3 mb-4">
            <Loader className="h-14 w-14 rounded-full" />
            <div className="space-y-2">
              <Loader className="h-4 w-24" />
              <Loader className="h-3 w-16" />
            </div>
          </div>
          <div className="mt-auto">
            <Loader className="h-16 w-full rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  // Error/offline state
  if (!presence) {
    return (
      <div className="relative h-full overflow-hidden rounded-xl bg-zinc-900/50 backdrop-blur p-5">
        <div className="absolute top-3 right-3">
          <FaDiscord className="h-10 w-10 text-[#5865F2]" />
        </div>
        <p className="text-sm text-zinc-400">Discord status unavailable</p>
        <p className="text-xs text-zinc-500 mt-1">Check DISCORD_ID in component</p>
      </div>
    );
  }

  const { discord_status, discord_user, activities } = presence;
  const gameActivity = activities?.find(a => a.type === 0);
  const customStatus = activities?.find(a => a.type === 4)?.state;
  const avatarUrl = discord_user?.avatar
    ? `https://cdn.discordapp.com/avatars/${discord_user.id}/${discord_user.avatar}.webp?size=128`
    : null;

  const isOffline = discord_status === 'offline';

  return (
    <div className={cn(
      "group relative h-full overflow-hidden rounded-xl bg-zinc-900/80 backdrop-blur border border-white/5 transition-all duration-500",
      isOffline && "grayscale opacity-60 hover:grayscale-0 hover:opacity-100"
    )}>
      {/* Discord icon */}
      <div className="absolute top-3 right-3 z-10">
        <FaDiscord className="h-10 w-10 text-[#5865F2]" />
      </div>

      {/* Banner area */}
      <div className="h-16 bg-gradient-to-br from-[#5865F2]/30 to-transparent" />

      {/* Content */}
      <div className="px-5 pb-5">
        {/* Avatar + Status */}
        <div className="flex items-end gap-3 -mt-8 mb-4">
          <div className="relative">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt="Avatar"
                className="h-16 w-16 rounded-full border-4 border-zinc-900 object-cover"
              />
            ) : (
              <div className="h-16 w-16 rounded-full border-4 border-zinc-900 bg-zinc-800 flex items-center justify-center">
                <FaDiscord className="h-8 w-8 text-zinc-600" />
              </div>
            )}
            <StatusDot status={discord_status} />
          </div>
          <div className="pb-1">
            <p className="font-semibold text-white leading-tight">
              {discord_user?.global_name || discord_user?.username || 'Unknown'}
            </p>
            <p className="text-xs text-zinc-400">@{discord_user?.username}</p>
          </div>
        </div>

        {/* Custom status */}
        {customStatus && (
          <p className="text-sm text-zinc-300 mb-3 truncate">{customStatus}</p>
        )}

        {/* Game activity */}
        {gameActivity ? (
          <div className="rounded-lg bg-zinc-800/50 p-3">
            <p className="text-xs text-zinc-400 uppercase tracking-wide mb-1">Playing</p>
            <p className="font-medium text-white truncate">{gameActivity.name}</p>
            {gameActivity.details && (
              <p className="text-xs text-zinc-400 truncate">{gameActivity.details}</p>
            )}
            {gameActivity.state && (
              <p className="text-xs text-zinc-500 truncate">{gameActivity.state}</p>
            )}
            {elapsed && (
              <p className="text-xs text-zinc-500 mt-1">{elapsed} elapsed</p>
            )}
          </div>
        ) : (
          <p className="text-sm text-zinc-500">
            {discord_status === 'offline' ? 'Currently offline' : 'No activity'}
          </p>
        )}
      </div>
    </div>
  );
}
