import { FC } from 'react';

import { Skeleton } from '@/components/ui/skeleton';

const FeedItemSkeleton: FC = () => {
    return (
        <div className="flex flex-col border-b p-4">
            <div className="flex items-center gap-3">
                <Skeleton className="size-8 rounded-full" />
                <div className="flex flex-col gap-1.5">
                    <Skeleton className="h-3.5 w-24" />
                    <Skeleton className="h-3 w-16" />
                </div>
            </div>

            <div className="mt-3 ml-14 flex flex-col gap-3">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-32 w-full rounded-lg" />

                <div className="mt-1 flex items-center gap-4">
                    <Skeleton className="h-4 w-12" />
                    <Skeleton className="h-4 w-12" />
                </div>
            </div>
        </div>
    );
};

export default FeedItemSkeleton;
