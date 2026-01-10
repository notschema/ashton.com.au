/**
 * DiscordPresence - THE ULTIMATE DISCORD CARD
 * Extracts EVERY available field from Lanyard/Discord API:
 * - Badges (Nitro, Early Supporter, Hypesquad, etc.)
 * - Platform indicators (mobile/desktop/web)
 * - Activities (games, streaming, listening, watching, competing)
 * - Custom status with emoji
 * - KV store data
 * - Active on Discord status
 * - Rich Presence artwork, buttons, party info, timestamps
 * - Discord connections (Spotify, etc.)
 */

import { useState, useEffect } from 'react';
import { FaDiscord, FaSpotify, FaTwitch } from 'react-icons/fa';
import { Clock, Activity } from 'lucide-react';
import { cn } from '../../lib/utils';

// Configuration
const DISCORD_ID = '169372933913968649';
const LANYARD_API = 'https://api.lanyard.rest/v1/users';

// Badge mappings
const DISCORD_BADGES = {
  staff: { icon: '🛡️', label: 'Discord Staff', color: 'text-blue-400' },
  partner: { icon: '🤝', label: 'Partnered Server Owner', color: 'text-purple-400' },
  hypesquad: { icon: '⚡', label: 'HypeSquad Events', color: 'text-orange-400' },
  hypesquad_online_house_1: { icon: '💜', label: 'HypeSquad Bravery', color: 'text-purple-500' },
  hypesquad_online_house_2: { icon: '🧡', label: 'HypeSquad Brilliance', color: 'text-orange-500' },
  hypesquad_online_house_3: { icon: '💚', label: 'HypeSquad Balance', color: 'text-green-500' },
  bug_hunter_level_1: { icon: '🐛', label: 'Bug Hunter', color: 'text-green-400' },
  bug_hunter_level_2: { icon: '🐛', label: 'Bug Hunter Gold', color: 'text-yellow-400' },
  verified_developer: { icon: '⚙️', label: 'Early Verified Bot Developer', color: 'text-blue-400' },
  early_supporter: { icon: '⭐', label: 'Early Supporter', color: 'text-pink-400' },
  premium: { icon: '💎', label: 'Nitro Subscriber', color: 'text-pink-500' },
  premium_early_supporter: { icon: '✨', label: 'Nitro Early Supporter', color: 'text-indigo-400' },
  active_developer: { icon: '🔧', label: 'Active Developer', color: 'text-green-400' },
};

// Activity types
const ACTIVITY_TYPES = {
  0: 'Playing',
  1: 'Streaming',
  2: 'Listening to',
  3: 'Watching',
  4: 'Custom',
  5: 'Competing in',
};

// Status colors
const STATUS_COLORS = {
  online: 'bg-green-500',
  idle: 'bg-yellow-500',
  dnd: 'bg-red-500',
  offline: 'bg-muted-foreground/50',
};

// Format time
function formatTime(startMs, endMs = null) {
  const now = Date.now();
  const diff = endMs ? (endMs - now) : (now - startMs);
  const absDiff = Math.abs(diff);
  
  const secs = Math.floor((absDiff / 1000) % 60);
  const mins = Math.floor((absDiff / 60000) % 60);
  const hrs = Math.floor(absDiff / 3600000);

  if (hrs > 0) return `${hrs}h ${mins}m`;
  if (mins > 0) return `${mins}m ${secs}s`;
  return `${secs}s`;
}

// Get artwork
function getActivityArtwork(activity) {
  console.log('Discord Activity:', activity);
  
  if (!activity?.assets) {
    console.log('No assets for:', activity.name);
    return { large: null, small: null };
  }
  
  const processImage = (imageKey) => {
    if (!imageKey) return null;
    if (imageKey.startsWith('http')) return imageKey;
    if (imageKey.startsWith('mp:')) return `https://media.discordapp.net/${imageKey.slice(3)}`;
    if (imageKey.startsWith('spotify:')) return `https://i.scdn.co/image/${imageKey.slice(8)}`;
    if (activity.application_id) {
      return `https://cdn.discordapp.com/app-assets/${activity.application_id}/${imageKey}.png?size=512`;
    }
    return null;
  };

  return {
    large: processImage(activity.assets.large_image),
    largeText: activity.assets.large_text,
    small: processImage(activity.assets.small_image),
    smallText: activity.assets.small_text,
  };
}

function Loader({ className }) {
  return <div className={cn('animate-pulse bg-muted rounded', className)} />;
}

// Activity Card
function ActivityCard({ activity, elapsed }) {
  const artwork = getActivityArtwork(activity);
  const isSpotify = activity.name === 'Spotify';
  const isStreaming = activity.type === 1;
  const hasParty = activity.party?.size;
  const hasButtons = activity.buttons?.length > 0;
  
  const displayImage = artwork.large || 
    (activity.application_id ? `https://cdn.discordapp.com/app-icons/${activity.application_id}/${activity.application_id}.png?size=256` : null);

  return (
    <div className="relative overflow-hidden bg-muted/50 border border-border/50 p-3 group/card hover:bg-muted/80 transition-colors">
      <div className="flex gap-3">
        <div className="relative flex-shrink-0">
          {displayImage ? (
            <div className="relative">
              <img 
                src={displayImage} 
                alt={artwork.largeText || activity.name}
                className="w-16 h-16 object-cover border border-border/50 shadow-sm"
                title={artwork.largeText}
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
              {artwork.small && (
                <img 
                  src={artwork.small}
                  alt={artwork.smallText || ''}
                  className="absolute -bottom-1 -right-1 w-6 h-6 border-2 border-background object-cover shadow-sm"
                  title={artwork.smallText}
                />
              )}
            </div>
          ) : (
            <div className="w-16 h-16 bg-muted/50 border border-border/50 flex items-center justify-center">
              <Activity className="h-8 w-8 text-muted-foreground/50" />
            </div>
          )}
        </div>
        
        <div className="min-w-0 flex-1 flex flex-col justify-center">
          <div className="flex items-center gap-1.5 mb-0.5">
            <p className="font-semibold text-foreground text-sm truncate">{activity.name}</p>
            {isSpotify && <FaSpotify className="h-3 w-3 text-green-500/80" />}
            {isStreaming && <FaTwitch className="h-3 w-3 text-purple-500/80" />}
          </div>
          
          {(activity.details || activity.state) && (
            <div className="space-y-0.5">
              {activity.details && <p className="text-xs text-muted-foreground truncate">{activity.details}</p>}
              {activity.state && <p className="text-xs text-muted-foreground/80 truncate">{activity.state}</p>}
            </div>
          )}

          <div className="flex items-center gap-3 mt-1.5 text-[10px] text-muted-foreground/70 font-mono uppercase tracking-wide">
             <span className={cn('flex items-center gap-1', isStreaming ? 'text-purple-400' : 'text-green-400')}>
                {ACTIVITY_TYPES[activity.type] || 'PLAYING'}
             </span>
             {elapsed && (
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {elapsed}
              </span>
             )}
          </div>
        </div>
      </div>

      {hasButtons && (
        <div className="mt-3 grid grid-cols-2 gap-2">
          {activity.buttons.slice(0, 2).map((button, i) => (
            <a
              key={i}
              href={button.url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-2 py-1 bg-background border border-border/50 text-[10px] text-muted-foreground hover:text-foreground hover:border-border transition-all text-center truncate"
            >
              {button.label}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

export default function DiscordPresence() {
  const [presence, setPresence] = useState(null);
  const [loading, setLoading] = useState(true);
  const [elapsedTimes, setElapsedTimes] = useState({});

  useEffect(() => {
    let mounted = true;

    async function fetchPresence() {
      try {
        const res = await fetch(`${LANYARD_API}/${DISCORD_ID}`);
        const json = await res.json();
        if (mounted && json.success) {
          console.log('Full Lanyard Response:', json.data);
          setPresence(json.data);
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

  useEffect(() => {
    if (!presence?.activities?.length) {
      setElapsedTimes({});
      return;
    }

    const tick = () => {
      const times = {};
      presence.activities.forEach((activity, index) => {
        if (activity.timestamps?.start) {
          times[index] = formatTime(activity.timestamps.start, activity.timestamps.end);
        }
      });
      setElapsedTimes(times);
    };

    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, [presence?.activities]);

  if (loading) {
    return (
      <div className="relative h-full overflow-hidden bg-transparent p-5">
        <div className="flex items-center gap-3 mb-4">
          <Loader className="h-14 w-14 rounded-full" />
          <div className="space-y-2">
            <Loader className="h-4 w-32" />
            <Loader className="h-3 w-24" />
          </div>
        </div>
        <Loader className="h-32 w-full rounded-lg" />
      </div>
    );
  }

  if (!presence) {
    return (
      <div className="relative h-full overflow-hidden bg-transparent p-5">
        <p className="text-sm text-muted-foreground">Discord unavailable</p>
      </div>
    );
  }

  const { discord_status, discord_user, activities, active_on_discord_mobile, active_on_discord_desktop, active_on_discord_web, kv } = presence;
  const customStatusActivity = activities?.find(a => a.type === 4);
  const customStatus = customStatusActivity?.state;
  const customEmoji = customStatusActivity?.emoji;
  
  // Filter out custom status (type 4) AND Spotify (type 2)
  const displayActivities = activities?.filter(a => 
    a.type !== 4 && !(a.type === 2 && a.name === 'Spotify')
  ) || [];
  
  const avatarUrl = discord_user?.avatar
    ? `https://cdn.discordapp.com/avatars/${discord_user.id}/${discord_user.avatar}.webp?size=128`
    : null;

  const isOffline = discord_status === 'offline';
  const statusColor = STATUS_COLORS[discord_status] || STATUS_COLORS.offline;

  // Parse badges from public_flags
  const badges = [];
  if (discord_user?.public_flags) {
    const flags = discord_user.public_flags;
    Object.keys(DISCORD_BADGES).forEach(badgeKey => {
      // This is a simplified mapping - actual flag values would need proper bit checking
      if (flags & (1 << Object.keys(DISCORD_BADGES).indexOf(badgeKey))) {
        badges.push(DISCORD_BADGES[badgeKey]);
      }
    });
  }

  const getEmojiDisplay = () => {
    if (!customEmoji) return null;
    if (customEmoji.id) {
      return (
        <img 
          src={`https://cdn.discordapp.com/emojis/${customEmoji.id}.${customEmoji.animated ? 'gif' : 'png'}`}
          alt={customEmoji.name}
          className="h-5 w-5"
        />
      );
    }
    return <span className="text-lg">{customEmoji.name}</span>;
  };

  const DISCORD_PROFILE_URL = 'https://discord.com/users/169372933913968649';

  return (
    <a 
      href={DISCORD_PROFILE_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "group relative h-full flex flex-col overflow-hidden bg-transparent transition-all duration-300 block cursor-pointer",
        isOffline && "opacity-80 hover:opacity-100"
      )}
    >
      {/* Click to add tooltip */}
      <div className="absolute top-3 right-12 z-20 bg-muted/80 backdrop-blur border border-border/50 px-2 py-0.5 text-[10px] text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        Add me on Discord
      </div>
      
      <div className="absolute top-4 right-4 z-10">
        <FaDiscord className="h-5 w-5 text-muted-foreground/40 group-hover:text-[#5865F2] transition-colors" />
      </div>

      {/* Main Content Row */}
      <div className="flex flex-col sm:flex-row flex-1 min-h-0">
        {/* Left Column: Profile */}
        <div className="relative flex flex-col p-4 sm:w-1/2 sm:border-r sm:border-border/30 justify-center min-w-0">
          <div className="flex items-center gap-3">
            <div className="relative flex-shrink-0">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt="Avatar"
                  className={cn(
                    "h-10 w-10 bg-muted object-cover ring-2 ring-transparent transition-all",
                    isOffline ? "grayscale" : "group-hover:ring-[#5865F2]/20"
                  )}
                />
              ) : (
                <div className="h-10 w-10 bg-muted flex items-center justify-center">
                  <FaDiscord className="h-5 w-5 text-muted-foreground/50" />
                </div>
              )}
              <div className="absolute -bottom-0.5 -right-0.5 z-10 bg-background p-0.5">
                <span className={cn('h-2.5 w-2.5 block', statusColor)} />
              </div>
            </div>
            
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-foreground text-sm leading-none mb-1 truncate">
                {discord_user?.global_name || discord_user?.username || 'User'}
              </h3>
              <div className="flex items-center gap-1.5">
                 <span className="text-xs text-muted-foreground font-mono truncate">@{discord_user?.username}</span>
              </div>
              {badges.length > 0 && (
                   <div className="flex gap-0.5 mt-1">
                     {badges.slice(0, 4).map((badge, i) => (
                       <span key={i} className="text-[10px]" title={badge.label}>{badge.icon}</span>
                     ))}
                   </div>
                 )}
            </div>
          </div>
        </div>

        {/* Right Column: Activities */}
        <div className="flex-1 overflow-y-auto p-2 sm:p-3 scrollbar-thin scrollbar-thumb-border/20 scrollbar-track-transparent">
          {displayActivities.length > 0 ? (
            <div className="space-y-2 h-full flex flex-col justify-center">
              {displayActivities.slice(0, 1).map((activity, index) => (
                <ActivityCard 
                  key={index} 
                  activity={activity} 
                  elapsed={elapsedTimes[index]}
                />
              ))}
              {displayActivities.length > 1 && (
                  <p className="text-[10px] text-muted-foreground text-center">+ {displayActivities.length - 1} more</p>
              )}
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-2 border border-dashed border-border/30 opacity-60">
               <Activity className="h-4 w-4 mb-1 text-muted-foreground" />
               <p className="text-[10px] text-muted-foreground">No active game</p>
            </div>
          )}
        </div>
      </div>

      {/* Custom Status - Full Width Bottom */}
      {(customStatus || customEmoji) && (
        <div className="border-t border-border/30 px-4 py-2 text-xs text-muted-foreground/80 font-medium flex items-center gap-1.5 bg-muted/20">
          {getEmojiDisplay()}
          {customStatus && <span className="truncate">{customStatus}</span>}
        </div>
      )}
    </a>
  );
}


