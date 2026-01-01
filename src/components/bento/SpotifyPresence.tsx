/**
 * SpotifyPresence - Original Implementation
 * Shows currently/recently played music from Last.fm
 * Includes caching for resilience
 */

import { useState, useEffect } from 'react';
import { FaSpotify } from 'react-icons/fa';
import { MoveUpRight, Music } from 'lucide-react';
import { cn } from '../../lib/utils';

// Configuration
const LASTFM_USER = 'NotSchema';
const API_URL = `https://lastfm-last-played.biancarosa.com.br/${LASTFM_USER}/latest-song`;
const CACHE_KEY = 'ashton-spotify-cache';
const CACHE_TTL = 300000; // 5 minutes

// Skeleton loader
function Loader({ className }) {
  return <div className={cn('animate-pulse bg-white/10 rounded', className)} />;
}

// Audio bars animation
function AudioBars() {
  return (
    <div className="flex items-end gap-0.5 h-4">
      {[1, 2, 3, 4].map(i => (
        <span
          key={i}
          className="w-1 bg-green-500 rounded-full animate-pulse"
          style={{
            height: `${Math.random() * 12 + 4}px`,
            animationDuration: `${0.3 + Math.random() * 0.5}s`,
            animationDelay: `${i * 0.08}s`,
          }}
        />
      ))}
    </div>
  );
}

export default function SpotifyPresence() {
  const [track, setTrack] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let mounted = true;

    // Try to load from cache first
    function loadCache() {
      try {
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
          const { data, timestamp } = JSON.parse(cached);
          if (Date.now() - timestamp < CACHE_TTL) {
            return data;
          }
        }
      } catch { }
      return null;
    }

    // Save to cache
    function saveCache(data) {
      try {
        localStorage.setItem(CACHE_KEY, JSON.stringify({
          data,
          timestamp: Date.now(),
        }));
      } catch { }
    }

    // Fetch latest track
    async function fetchTrack() {
      try {
        const res = await fetch(API_URL, {
          signal: AbortSignal.timeout(8000),
        });

        if (!res.ok) throw new Error('API error');

        const json = await res.json();
        if (mounted && json.track) {
          setTrack(json.track);
          saveCache(json.track);
          setError(false);
          
          // Broadcast to other components (like Haunt)
          const isPlaying = json.track['@attr']?.nowplaying === 'true';
          window.dispatchEvent(new CustomEvent('spotify-state', { 
            detail: { isPlaying, track: json.track.name } 
          }));
        }
      } catch (e) {
        console.error('Last.fm fetch failed:', e);
        // Fall back to cache
        const cached = loadCache();
        if (mounted && cached) {
          setTrack(cached);
        } else if (mounted) {
          setError(true);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }

    // Initial load from cache, then fetch fresh
    const cached = loadCache();
    if (cached) {
      setTrack(cached);
      setLoading(false);
    }

    fetchTrack();
    return () => { mounted = false; };
  }, []);

  // Loading state
  if (loading && !track) {
    return (
      <div className="relative h-full overflow-hidden rounded-xl bg-zinc-900/50 backdrop-blur p-5">
        <FaSpotify className="absolute top-3 right-3 h-12 w-12 text-[#1DB954]" />
        <Loader className="h-24 w-24 rounded-lg mb-4" />
        <Loader className="h-4 w-20 mb-2" />
        <Loader className="h-5 w-32 mb-2" />
        <Loader className="h-3 w-24" />
      </div>
    );
  }

  // Error state
  if (error || !track) {
    return (
      <div className="relative h-full overflow-hidden rounded-xl bg-zinc-900/50 backdrop-blur p-5 flex flex-col">
        <FaSpotify className="absolute top-3 right-3 h-12 w-12 text-[#1DB954]" />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Music className="h-12 w-12 text-zinc-600 mx-auto mb-3" />
            <p className="text-sm text-zinc-400">No music data</p>
          </div>
        </div>
      </div>
    );
  }

  const { name, artist, album, image, url } = track;
  const isNowPlaying = track['@attr']?.nowplaying === 'true';
  const albumArt = image?.[3]?.['#text'] || image?.[2]?.['#text'];

  return (
    <div className={cn(
      "group relative h-full overflow-hidden rounded-xl bg-zinc-900/80 backdrop-blur border border-white/5 transition-all duration-500",
      !isNowPlaying && "grayscale opacity-60 hover:grayscale-0 hover:opacity-100"
    )}>
      {/* Background blur */}
      {albumArt && (
        <div
          className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity duration-500"
          style={{
            backgroundImage: `url(${albumArt})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'blur(50px)',
          }}
        />
      )}

      {/* Spotify icon */}
      <FaSpotify className="absolute top-3 right-3 h-12 w-12 text-[#1DB954] z-10" />

      {/* Content */}
      <div className="relative z-10 flex h-full flex-col p-5">
        {/* Album art */}
        {albumArt && (
          <div className="mb-4">
            <img
              src={albumArt}
              alt={album?.['#text'] || 'Album'}
              className="h-24 w-24 rounded-lg shadow-lg object-cover border border-white/10"
            />
          </div>
        )}

        {/* Track info */}
        <div className="mt-auto">
          <div className="flex items-center gap-2 mb-2">
            {isNowPlaying ? <AudioBars /> : <Music className="h-4 w-4 text-green-500" />}
            <span className="text-xs font-medium text-green-500 uppercase tracking-wide">
              {isNowPlaying ? 'Now Playing' : 'Last Played'}
            </span>
          </div>

          <p className="font-semibold text-white truncate leading-tight">{name}</p>
          <p className="text-sm text-zinc-400 truncate">
            <span className="text-zinc-500">by</span> {artist?.['#text']}
          </p>
          <p className="text-xs text-zinc-500 truncate">
            <span className="text-zinc-600">on</span> {album?.['#text']}
          </p>
        </div>
      </div>

      {/* Link button */}
      {url && (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute bottom-3 right-3 p-2.5 rounded-full bg-white/5 hover:bg-white/10 text-green-500 transition-colors"
          aria-label="Open on Last.fm"
        >
          <MoveUpRight className="h-4 w-4" />
        </a>
      )}
    </div>
  );
}
