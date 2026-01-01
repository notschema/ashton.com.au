import { cn } from '../../lib/utils';

/**
 * Avatar - Reusable avatar component with gradient border
 */
export function Avatar({ src, alt, fallback, className }) {
    const initials = fallback || alt?.charAt(0) || 'A';

    return (
        <div
            className={cn(
                'relative overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600 p-0.5',
                className
            )}
        >
            <div className="h-full w-full bg-[#0a0a0a] flex items-center justify-center overflow-hidden">
                {src ? (
                    <img
                        src={src}
                        alt={alt}
                        className="h-full w-full object-cover"
                    />
                ) : (
                    <span className="text-2xl font-medium text-gray-400">
                        {initials}
                    </span>
                )}
            </div>
        </div>
    );
}

/**
 * StatusIndicator - Shows availability status
 */
export function StatusIndicator({ status = 'available' }) {
    const statusConfig = {
        available: { color: 'bg-green-500', label: 'Available for projects' },
        busy: { color: 'bg-yellow-500', label: 'Currently busy' },
        offline: { color: 'bg-gray-500', label: 'Away' },
    };

    const { color, label } = statusConfig[status] || statusConfig.available;

    return (
        <span className="inline-flex items-center gap-2 text-sm text-gray-500">
            <span className={cn('h-2 w-2 rounded-full animate-pulse', color)} />
            {label}
        </span>
    );
}

/**
 * GlassCard - Base glass morphism card
 */
export function GlassCard({ children, className, ...props }) {
    return (
        <div
            className={cn('glass-card', className)}
            {...props}
        >
            {children}
        </div>
    );
}
