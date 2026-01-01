/**
 * GitHubProfile - Clean GitHub profile card
 * Shows avatar, username, and pinned repos
 * Original implementation - no contribution graph (most activity is private)
 */

import { useState, useEffect } from 'react';
import { FaGithub } from 'react-icons/fa';
import { MoveUpRight, GitFork, Star } from 'lucide-react';
import { cn } from '../../lib/utils';

// Configuration
const GITHUB_USERNAME = 'notschema';
const PROFILE_URL = `https://github.com/${GITHUB_USERNAME}`;

// Skeleton loader
function Loader({ className }) {
    return <div className={cn('animate-pulse bg-white/10 rounded', className)} />;
}

export default function GitHubProfile() {
    const [profile, setProfile] = useState(null);
    const [repos, setRepos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let mounted = true;

        async function fetchGitHub() {
            try {
                // Fetch profile
                const profileRes = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}`);
                const profileData = await profileRes.json();

                // Fetch repos (sorted by stars/updated)
                const reposRes = await fetch(
                    `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=3`
                );
                const reposData = await reposRes.json();

                if (mounted) {
                    setProfile(profileData);
                    setRepos(reposData.slice(0, 3));
                }
            } catch (e) {
                console.error('GitHub fetch failed:', e);
            } finally {
                if (mounted) setLoading(false);
            }
        }

        fetchGitHub();
        return () => { mounted = false; };
    }, []);

    // Loading state
    if (loading) {
        return (
            <div className="relative h-full overflow-hidden rounded-xl bg-zinc-900/50 backdrop-blur p-5">
                <FaGithub className="absolute top-3 right-3 h-8 w-8 text-white" />
                <div className="flex items-center gap-3 mb-4">
                    <Loader className="h-12 w-12 rounded-full" />
                    <div className="space-y-2">
                        <Loader className="h-4 w-24" />
                        <Loader className="h-3 w-16" />
                    </div>
                </div>
                <div className="space-y-2">
                    <Loader className="h-10 w-full rounded-lg" />
                    <Loader className="h-10 w-full rounded-lg" />
                </div>
            </div>
        );
    }

    return (
        <div className="group relative h-full overflow-hidden rounded-xl bg-zinc-900/80 backdrop-blur border border-white/5">
            {/* GitHub icon */}
            <FaGithub className="absolute top-3 right-3 h-8 w-8 text-white z-10" />

            {/* Content */}
            <div className="relative z-10 flex h-full flex-col p-5">
                {/* Profile section */}
                <a
                    href={PROFILE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 mb-4 group/profile"
                >
                    {profile?.avatar_url ? (
                        <img
                            src={profile.avatar_url}
                            alt={GITHUB_USERNAME}
                            className="h-12 w-12 rounded-full ring-2 ring-white/10 group-hover/profile:ring-white/30 transition-all"
                        />
                    ) : (
                        <div className="h-12 w-12 rounded-full bg-zinc-700 flex items-center justify-center">
                            <FaGithub className="h-6 w-6 text-zinc-400" />
                        </div>
                    )}
                    <div>
                        <p className="font-semibold text-white group-hover/profile:text-blue-400 transition-colors">
                            {profile?.name || GITHUB_USERNAME}
                        </p>
                        <p className="text-sm text-zinc-400">@{GITHUB_USERNAME}</p>
                    </div>
                </a>

                {/* Stats */}
                {profile && (
                    <div className="flex gap-4 text-xs text-zinc-400 mb-4">
                        <span>{profile.public_repos} repos</span>
                        <span>{profile.followers} followers</span>
                    </div>
                )}

                {/* Recent repos */}
                <div className="mt-auto space-y-2">
                    {repos.slice(0, 2).map(repo => (
                        <a
                            key={repo.id}
                            href={repo.html_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block p-2.5 rounded-lg bg-zinc-800/50 hover:bg-zinc-800 transition-colors group/repo"
                        >
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-white font-medium truncate group-hover/repo:text-blue-400 transition-colors">
                                    {repo.name}
                                </span>
                                <MoveUpRight className="h-3.5 w-3.5 text-zinc-500 group-hover/repo:text-white transition-colors" />
                            </div>
                            <div className="flex items-center gap-3 mt-1 text-xs text-zinc-500">
                                {repo.language && <span>{repo.language}</span>}
                                {repo.stargazers_count > 0 && (
                                    <span className="flex items-center gap-1">
                                        <Star className="h-3 w-3" /> {repo.stargazers_count}
                                    </span>
                                )}
                            </div>
                        </a>
                    ))}
                </div>
            </div>
        </div>
    );
}
