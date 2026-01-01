import { cn } from '../../lib/utils';

function Skeleton({
    className,
    ...props
}) {
    return (
        <div className={cn('bg-border/50 animate-pulse', className)} {...props} />
    );
}

export { Skeleton };
