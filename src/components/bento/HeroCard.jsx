import { cn } from '../../lib/utils';
import { Avatar, StatusIndicator } from '../ui/Card';
import { GitHubIcon, MailIcon, LinkedInIcon, DocumentIcon, ChevronRightIcon, SocialIcons } from '../ui/Icons';

/**
 * HeroCard - Main profile card for the Bento grid
 * Displays name, title, avatar, social links, and resume button
 */

const socialLinks = [
    { href: 'https://github.com/notschema', label: 'GitHub', icon: GitHubIcon },
    { href: 'mailto:hello@ashton.com.au', label: 'Email', icon: MailIcon },
    { href: 'https://linkedin.com/in/ashton', label: 'LinkedIn', icon: LinkedInIcon },
].filter(Boolean);

export default function HeroCard({
    name = 'Ashton',
    title = 'Sys Engineer & Whitehat Pentester',
    bio = null,
    avatar = null,
    status = 'available',
    resumeUrl = '/resume.pdf',
}) {
    return (
        <div
            className={cn(
                'glass-card h-full overflow-hidden p-6 md:p-8',
                'transition-colors duration-300 ease-in-out',
                'has-[a:hover]:bg-white/[0.08]'
            )}
        >
            {/* Background gradient accent */}
            <div
                className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 blur-3xl"
                aria-hidden="true"
            />

            <div className="relative z-10 flex h-full flex-col">
                {/* Profile Section */}
                <div className="flex flex-wrap gap-4 md:gap-6">
                    <Avatar
                        src={avatar}
                        alt={`Avatar of ${name}`}
                        fallback={name[0]}
                        className={cn(
                            'h-20 w-20 rounded-2xl md:h-24 md:w-24',
                            'ring-2 ring-transparent transition-all duration-300',
                            'hover:ring-blue-500/50 hover:cursor-pointer'
                        )}
                    />

                    <div className="flex grow flex-col justify-between gap-y-3">
                        <div>
                            <div className="flex flex-wrap items-center gap-x-3">
                                <h1 className="text-3xl font-bold tracking-tight text-white md:text-4xl">
                                    {name}
                                </h1>
                            </div>
                            <p className="mt-1 text-base text-gray-400 md:text-lg">
                                {title}
                            </p>
                            {bio && (
                                <p className="mt-2 text-sm text-gray-500">
                                    {bio}
                                </p>
                            )}
                        </div>
                        <SocialIcons links={socialLinks} />
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="mt-auto flex flex-wrap items-center justify-between gap-4 pt-6">
                    <StatusIndicator status={status} />

                    <a
                        href={resumeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={cn(
                            'group inline-flex items-center gap-2',
                            'rounded-xl border border-white/10 bg-white/10 px-5 py-2.5',
                            'text-sm font-medium text-white',
                            'transition-all duration-300',
                            'hover:border-white/20 hover:bg-white/15'
                        )}
                    >
                        <DocumentIcon className="h-4 w-4" />
                        Resume
                        <ChevronRightIcon className="h-4 w-4 opacity-50 transition-opacity group-hover:opacity-100" />
                    </a>
                </div>
            </div>
        </div>
    );
}
