import type { FC } from 'react';

import { Skeleton } from '@/components/ui/skeleton';

const FeedItemSkeleton: FC = () => {
    return (
        <div className="flex items-start gap-4 p-4">
            <Skeleton className="size-12 shrink-0 rounded-md" />
            <div className="flex min-w-0 flex-1 flex-col gap-3">
                <div className="flex flex-col gap-3 pr-9">
                    <div className="flex h-4.5 items-center">
                        <Skeleton className="h-3.5 w-40" />
                    </div>
                    <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center">
                        <Skeleton className="h-8 w-40 rounded-md" />
                        <Skeleton className="h-8 w-48 max-w-full rounded-md" />
                    </div>
                </div>
                <div className="flex flex-col">
                    <Skeleton className="my-1 h-4 w-3/4" />
                    <Skeleton className="my-1 h-4 w-1/2" />
                </div>
                <div className="flex items-center gap-1">
                    <Skeleton className="h-8 w-20 rounded-md" />
                    <Skeleton className="h-8 w-8 rounded-md" />
                </div>
            </div>
        </div>
    );
};

export default FeedItemSkeleton;
