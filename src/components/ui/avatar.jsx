import { cn } from '../../lib/utils';

function Avatar({ className, children, ...props }) {
    return (
        <div
            data-slot="avatar"
            className={cn(
                'relative flex size-8 shrink-0 overflow-hidden rounded-full',
                className,
            )}
            {...props}
        >
            {children}
        </div>
    );
}

function AvatarImage({ className, src, alt, ...props }) {
    return (
        <img
            data-slot="avatar-image"
            src={src}
            alt={alt}
            className={cn('aspect-square size-full object-cover', className)}
            {...props}
        />
    );
}

function AvatarFallback({ className, children, ...props }) {
    return (
        <div
            data-slot="avatar-fallback"
            className={cn(
                'bg-muted flex size-full items-center justify-center rounded-full',
                className,
            )}
            {...props}
        >
            {children}
        </div>
    );
}

function AvatarComponent({ src, alt, fallback, className }) {
    return (
        <Avatar className={className}>
            {src ? (
                <AvatarImage src={src} alt={alt} />
            ) : (
                <AvatarFallback>{fallback}</AvatarFallback>
            )}
        </Avatar>
    );
}

export default AvatarComponent;
export { Avatar, AvatarImage, AvatarFallback };
