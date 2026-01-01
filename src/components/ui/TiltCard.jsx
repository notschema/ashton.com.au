/**
 * TiltCard - Simple card wrapper with subtle hover
 * No 3D transforms that break links - just a gentle border glow
 */

import { cn } from '../../lib/utils';

export default function TiltCard({ children, className }) {
    return (
        <div
            className={cn(
                'relative overflow-hidden rounded-xl',
                'bg-zinc-900/50 border border-white/5',
                'transition-all duration-300 ease-out',
                'hover:border-white/10 hover:bg-zinc-900/70',
                className
            )}
        >
            {children}
        </div>
    );
}
