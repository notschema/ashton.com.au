/**
 * SpotifyPresence - Last.fm music presence card
 * Shows currently/recently played music with theme support
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
  return <div className={cn('animate-pulse bg-muted', className)} />;
}

// Audio bars animation
function AudioBars() {
  return (
    <div className="flex items-end gap-0.5 h-4">
      {[1, 2, 3, 4].map(i => (
        <span
          key={i}
          className="w-1 bg-primary animate-pulse"
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
          
          // Broadcast to other components
          const isPlaying = json.track['@attr']?.nowplaying === 'true';
          window.dispatchEvent(new CustomEvent('spotify-state', { 
            detail: { isPlaying, track: json.track.name } 
          }));
        }
      } catch (e) {
        console.error('Last.fm fetch failed:', e);
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
      <div className="relative h-full overflow-hidden bg-transparent p-5">
        <FaSpotify className="absolute top-3 right-3 h-12 w-12 text-primary" />
        <Loader className="h-24 w-24 mb-4" />
        <Loader className="h-4 w-20 mb-2" />
        <Loader className="h-5 w-32 mb-2" />
        <Loader className="h-3 w-24" />
      </div>
    );
  }

  // Error state
  if (error || !track) {
    return (
      <div className="relative h-full overflow-hidden bg-transparent p-5 flex flex-col">
        <FaSpotify className="absolute top-3 right-3 h-12 w-12 text-primary" />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Music className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">No music data</p>
          </div>
        </div>
      </div>
    );
  }

  const { name, artist, album, image, url } = track;
  const isNowPlaying = track['@attr']?.nowplaying === 'true';
  const albumArt = image?.[3]?.['#text'] || image?.[2]?.['#text'];
  
  // Generate Spotify search URL for the track
  const spotifySearchUrl = `https://open.spotify.com/search/${encodeURIComponent(`${name} ${artist?.['#text'] || ''}`)}`;

  return (
    <a 
      href={spotifySearchUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "group relative h-full overflow-hidden bg-transparent transition-all duration-500 block cursor-pointer",
        !isNowPlaying && "grayscale opacity-60 hover:grayscale-0 hover:opacity-100"
      )}
    >
      {/* Background with less blur for cover art feel */}
      {albumArt && (
        <div
          className="absolute inset-0 z-0 transition-transform duration-700 group-hover:scale-110"
          style={{
            backgroundImage: `url(${albumArt})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute inset-0 bg-background/60 backdrop-blur-[2px] transition-all group-hover:bg-background/40 group-hover:backdrop-blur-none" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        </div>
      )}

      {/* Spotify icon */}
      <FaSpotify className="absolute top-3 right-3 h-8 w-8 text-primary z-20 opacity-80" />

      {/* Content */}
      <div className="relative z-10 flex h-full flex-col justify-end p-4">
         {/* No explicit img - we use background */}
        <div className="mt-auto">
          <div className="flex items-center gap-2 mb-1">
            {isNowPlaying ? <AudioBars /> : <Music className="h-3 w-3 text-primary" />}
            <span className="text-[10px] font-medium text-primary uppercase tracking-wide">
              {isNowPlaying ? 'Now Playing' : 'Last Played'}
            </span>
          </div>

          <p className="font-semibold text-foreground truncate leading-tight text-sm">{name}</p>
          <p className="text-xs text-muted-foreground truncate">
            {artist?.['#text']}
          </p>
        </div>
      </div>

      {/* Link indicator */}
      <div className="absolute bottom-3 right-3 p-1.5 bg-muted/50 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
        <MoveUpRight className="h-3 w-3" />
      </div>
    </a>
  );
}

