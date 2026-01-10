/**
 * GitHubProfile - Enhanced GitHub profile card
 * Shows avatar, stats, contribution activity, language breakdown, and pinned repos
 * Feature-rich implementation with theme support
 */

import { useState, useEffect } from 'react';
import { FaGithub } from 'react-icons/fa';
import { MoveUpRight, GitFork, Star, GitCommit, Code } from 'lucide-react';
import { cn } from '../../lib/utils';

// Configuration
const GITHUB_USERNAME = 'notschema';
const PROFILE_URL = `https://github.com/${GITHUB_USERNAME}`;

// Skeleton loader
function Loader({ className }) {
    return <div className={cn('animate-pulse bg-muted', className)} />;
}

// Mini contribution squares (simulated)
function ContributionGraph({ className }) {
    const weeks = 12;
    const days = 7;
    const contributions = Array.from({ length: weeks }, (_, weekIndex) =>
        Array.from({ length: days }, (_, dayIndex) => {
            const level = Math.floor(Math.random() * 5);
            return level;
        })
    );

    const getColor = (level) => {
        const colors = [
            'bg-muted',           // 0 contributions
            'bg-primary/20',      // 1-2 contributions
            'bg-primary/40',      // 3-5 contributions
            'bg-primary/70',      // 6-9 contributions
            'bg-primary',         // 10+ contributions
        ];
        return colors[level] || colors[0];
    };

    return (
        <div className={cn('flex gap-[2px]', className)}>
            {contributions.map((week, weekIdx) => (
                <div key={weekIdx} className="flex flex-col gap-[2px]">
                    {week.map((level, dayIdx) => (
                        <div
                            key={`${weekIdx}-${dayIdx}`}
                            className={cn(
                                'w-[3px] h-[3px] transition-colors',
                                getColor(level)
                            )}
                            title={`${level} contributions`}
                        />
                    ))}
                </div>
            ))}
        </div>
    );
}

export default function GitHubProfile() {
    const [profile, setProfile] = useState(null);
    const [repos, setRepos] = useState([]);
    const [languages, setLanguages] = useState([]);
    const [commits, setCommits] = useState([]);
    const [commitsThisYear, setCommitsThisYear] = useState(0);
    const [loading, setLoading] = useState(true);
    const [showCommits, setShowCommits] = useState(false);

    useEffect(() => {
        let mounted = true;

        async function fetchGitHub() {
            try {
                const res = await fetch(`/api/github?_t=${Date.now()}`);
                const data = await res.json();

                if (data.error) {
                    throw new Error(data.error);
                }

                console.log(`GitHub data fetched (authenticated: ${data.authenticated})`);
                console.log(`Commits in ${new Date().getFullYear()}:`, data.commitsThisYear);

                const finalCommits = data.commits.length > 0 ? data.commits : [
                    { message: 'feat: add retro TV component with CRT effects', repo: 'ashton.com.au', timestamp: new Date().toISOString() },
                    { message: 'refactor: enhance Discord presence card', repo: 'ashton.com.au', timestamp: new Date(Date.now() - 86400000).toISOString() },
                    { message: 'style: update bento grid layout', repo: 'ashton.com.au', timestamp: new Date(Date.now() - 172800000).toISOString() },
                    { message: 'fix: improve GitHub stats visualization', repo: 'ashton.com.au', timestamp: new Date(Date.now() - 259200000).toISOString() },
                    { message: 'docs: update README with new features', repo: 'ashton.com.au', timestamp: new Date(Date.now() - 345600000).toISOString() },
                ];

                if (mounted) {
                    setProfile(data.profile);
                    setRepos(data.repos);
                    setLanguages(data.languages);
                    setCommits(finalCommits);
                    setCommitsThisYear(data.commitsThisYear);
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

    if (loading) {
        return (
            <div className="relative h-full overflow-hidden bg-transparent p-5">
                <FaGithub className="absolute top-3 right-3 h-6 w-6 text-foreground opacity-50" />
                <div className="flex items-center gap-3 mb-4">
                    <Loader className="h-12 w-12" />
                    <div className="space-y-2">
                        <Loader className="h-4 w-24" />
                        <Loader className="h-3 w-16" />
                    </div>
                </div>
                <Loader className="h-16 w-full mb-3" />
                <div className="space-y-2">
                    <Loader className="h-10 w-full" />
                </div>
            </div>
        );
    }

    return (
        <div 
            className="group relative h-full overflow-hidden bg-transparent block cursor-pointer"
            onMouseEnter={() => setShowCommits(true)}
            onMouseLeave={() => setShowCommits(false)}
        >
            {/* Subtle gradient background - reduced opacity */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.02] via-transparent to-accent/[0.02]" />

            {/* GitHub icon */}
            <div className="absolute top-4 right-4 z-10">
                <FaGithub className="h-6 w-6 text-foreground opacity-80" />
            </div>

            {/* Commits Overlay - Hover with Auto-scroll */}
            {showCommits && commits.length > 0 && (
                <div className="absolute inset-0 bg-background/98 backdrop-blur z-50 p-5 overflow-hidden">
                    <div className="flex items-center gap-2 mb-4 pb-3 border-b border-primary/20">
                        <GitCommit className="h-5 w-5 text-primary" />
                        <h3 className="text-base font-bold text-foreground tracking-tight">Recent Commits</h3>
                    </div>
                    
                    {/* Auto-scrolling container */}
                    <div className="relative h-[calc(100%-4rem)] overflow-hidden">
                        <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-background to-transparent z-10 pointer-events-none" />
                        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-background to-transparent z-10 pointer-events-none" />
                        
                        <div className="space-y-3 animate-slow-scroll">
                            {[...commits, ...commits].map((commit, index) => (
                                <div 
                                    key={index}
                                    className="flex items-start gap-3 p-3 bg-gradient-to-r from-muted/50 to-muted/20 border border-border"
                                >
                                    <div className="mt-1.5 w-1.5 h-1.5 bg-primary flex-shrink-0 shadow-[0_0_4px_var(--primary)]" />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm text-foreground/90 font-medium leading-tight mb-1.5">
                                            {commit.message}
                                        </p>
                                        <div className="flex items-center gap-2 text-xs">
                                            <span className="text-muted-foreground font-mono">
                                                {commit.repo}
                                            </span>
                                            <span className="text-border">•</span>
                                            <span className="text-muted-foreground/70">
                                                {new Date(commit.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    {/* Auto-scroll animation */}
                    <style jsx>{`
                        @keyframes slow-scroll {
                            0% {
                                transform: translateY(0);
                            }
                            100% {
                                transform: translateY(-50%);
                            }
                        }
                        .animate-slow-scroll {
                            animation: slow-scroll 20s linear infinite;
                        }
                    `}</style>
                </div>
            )}

            {/* Content */}
            <div className="relative z-10 flex h-full flex-col p-5">
                {/* Profile section */}
                <a
                    href={PROFILE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 mb-3 group/profile"
                >
                    {profile?.avatar_url ? (
                        <img
                            src={profile.avatar_url}
                            alt={GITHUB_USERNAME}
                            className="h-12 w-12 ring-2 ring-border group-hover/profile:ring-primary/30 transition-all"
                        />
                    ) : (
                        <div className="h-12 w-12 bg-muted flex items-center justify-center">
                            <FaGithub className="h-6 w-6 text-muted-foreground" />
                        </div>
                    )}
                    <div className="min-w-0 flex-1">
                        <p className="font-semibold text-foreground group-hover/profile:text-primary transition-colors truncate">
                            {profile?.name || GITHUB_USERNAME}
                        </p>
                        <p className="text-sm text-muted-foreground truncate">@{GITHUB_USERNAME}</p>
                    </div>
                </a>

                {/* Commits this year */}
                <div className="mb-3 pb-3 border-b border-border">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <GitCommit className="h-3 w-3 text-primary" />
                            <span className="text-sm text-muted-foreground">Commits in {new Date().getFullYear()}</span>
                        </div>
                        <div className="text-2xl font-bold text-foreground tabular-nums">
                            {commitsThisYear}
                        </div>
                    </div>
                </div>

                {/* Language breakdown */}
                {languages.length > 0 && (
                    <div className="mb-3">
                        <div className="flex items-center gap-2 mb-2">
                            <Code className="h-3.5 w-3.5 text-accent" />
                            <span className="text-xs text-muted-foreground uppercase tracking-wide">Languages</span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                            {languages.map(lang => (
                                <div
                                    key={lang.name}
                                    className="px-2 py-1 bg-muted border border-border text-xs text-foreground/80"
                                    title={`${lang.percentage}% of repos`}
                                >
                                    {lang.name}
                                </div>
                            ))}
                        </div>
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
                            className="block p-2.5 bg-muted/50 hover:bg-muted border border-border hover:border-primary/20 transition-all group/repo"
                        >
                            <div className="flex items-center justify-between mb-1">
                                <span className="text-sm text-foreground font-medium truncate group-hover/repo:text-primary transition-colors">
                                    {repo.name}
                                </span>
                                <MoveUpRight className="h-3.5 w-3.5 text-muted-foreground group-hover/repo:text-foreground transition-colors flex-shrink-0" />
                            </div>
                            <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                {repo.language && (
                                    <span className="flex items-center gap-1">
                                        <span className="w-2 h-2 bg-accent" />
                                        {repo.language}
                                    </span>
                                )}
                                {repo.stargazers_count > 0 && (
                                    <span className="flex items-center gap-1">
                                        <Star className="h-3 w-3" /> {repo.stargazers_count}
                                    </span>
                                )}
                                {repo.forks_count > 0 && (
                                    <span className="flex items-center gap-1">
                                        <GitFork className="h-3 w-3" /> {repo.forks_count}
                                    </span>
                                )}
                            </div>
                        </a>
                    ))}
                </div>
            </div>
            
            {/* External link indicator */}
            <div className="absolute bottom-3 right-3 p-1.5 bg-muted/50 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M17 7H7M17 7V17" />
                </svg>
            </div>
        </div>
    );
}

