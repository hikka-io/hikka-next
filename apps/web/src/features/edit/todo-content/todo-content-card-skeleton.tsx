import type { FC } from 'react';

import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Skeleton } from '@/components/ui/skeleton';

const TodoContentCardSkeleton: FC = () => {
    return (
        <div className="surface -mx-4 flex flex-col gap-4 rounded-none border border-border border-x-0 p-4 md:mx-0 md:rounded-(--base-radius) md:border-x">
            <div className="flex gap-4">
                <div className="w-24 shrink-0">
                    <AspectRatio ratio={0.7}>
                        <Skeleton className="size-full rounded-(--base-radius)" />
                    </AspectRatio>
                </div>
                <div className="flex min-w-0 flex-1 flex-col gap-3">
                    <Skeleton className="h-4 w-2/3 rounded-lg" />
                    <Skeleton className="h-3 w-1/2 rounded-lg" />
                    <div className="flex gap-1.5">
                        <Skeleton className="h-6 w-20 rounded-md" />
                        <Skeleton className="h-6 w-20 rounded-md" />
                    </div>
                </div>
            </div>
            <Skeleton className="h-10 w-full rounded-md" />
        </div>
    );
};

export default TodoContentCardSkeleton;
