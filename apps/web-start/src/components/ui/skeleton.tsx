import { cn } from '@/utils/cn';

function Skeleton({
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            className={cn(
                'animate-pulse rounded-md bg-secondary/20',
                className,
            )}
            {...props}
        />
    );
}

export { Skeleton };
