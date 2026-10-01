import { range } from '@antfu/utils';

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

type SkeletonTextProps = React.HTMLAttributes<HTMLDivElement> & {
    barClassName?: string;
    lines?: number;
};

// Each row is one line box (1lh): pass the real text's font and leading classes.
function SkeletonText({
    className,
    barClassName,
    lines = 1,
    ...props
}: SkeletonTextProps) {
    return (
        <div className={cn('flex flex-col', className)} {...props}>
            {range(0, lines).map((index) => (
                <div key={index} className="flex h-lh items-center">
                    <Skeleton
                        className={cn(
                            'h-[1em] w-full',
                            barClassName,
                            lines > 1 && index === lines - 1 && 'w-2/3',
                        )}
                    />
                </div>
            ))}
        </div>
    );
}

export { Skeleton, SkeletonText };
