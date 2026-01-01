import { cn } from '../../lib/utils';
import { GitHubIcon, MailIcon } from '../ui/Icons';

/**
 * Socials - Social links card for Bento grid
 */

const socials = [
    {
        name: 'GitHub',
        href: 'https://github.com/notschema',
        icon: GitHubIcon,
    },
    {
        name: 'Email',
        href: 'mailto:hello@ashton.com.au',
        icon: MailIcon,
    },
];

export default function Socials() {
    return (
        <div className="glass-card h-full p-6 flex items-center justify-center gap-4">
            {socials.map((social) => (
                <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                        'flex-1 flex items-center justify-center gap-3 py-4 px-6 rounded-xl',
                        'bg-white/5 border border-white/10',
                        'transition-all duration-300',
                        'hover:bg-white/10 hover:border-white/20 group'
                    )}
                >
                    <social.icon className="h-6 w-6 text-gray-400 group-hover:text-white transition-colors" />
                    <span className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors">
                        {social.name}
                    </span>
                </a>
            ))}
        </div>
    );
}
