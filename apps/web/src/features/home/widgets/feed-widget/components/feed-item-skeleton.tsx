import type { FC } from 'react';

import { Skeleton } from '@/components/ui/skeleton';

const FeedItemSkeleton: FC = () => {
    return (
        <div className="flex items-start gap-4 p-4">
            <Skeleton className="size-12 shrink-0 rounded-md" />
            <div className="flex min-w-0 flex-1 flex-col gap-3">
                <div className="flex flex-col gap-2">
                    <Skeleton className="h-4 w-40" />
                    <div className="flex gap-2">
                        <Skeleton className="h-8 w-24 rounded-md" />
                        <Skeleton className="h-8 w-40 rounded-md" />
                    </div>
                </div>
                <div className="flex flex-col gap-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                </div>
                <div className="flex items-center gap-4">
                    <Skeleton className="h-7 w-12 rounded-md" />
                    <Skeleton className="h-7 w-12 rounded-md" />
                </div>
            </div>
        </div>
    );
};

export default FeedItemSkeleton;
