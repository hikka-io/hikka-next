import { range } from '@antfu/utils';

import PosterCardSkeleton from '@/components/content-card/poster-card-skeleton';
import { Skeleton } from '@/components/ui/skeleton';
import Stack from '@/components/ui/stack';

const POSTER_COUNT = 4;

const ProgressTrackerSkeleton = () => {
    return (
        <div className="flex flex-col gap-4">
            <Stack
                visibleScrollbar
                className="grid-min-3 grid-max-3 grid gap-4 lg:gap-4"
            >
                {range(0, POSTER_COUNT).map((index) => (
                    <PosterCardSkeleton key={index} hasTitle={false} />
                ))}
            </Stack>
            <div className="flex flex-col">
                <div className="flex h-6 items-center">
                    <Skeleton className="h-4 w-2/3" />
                </div>
                <div className="mt-1 flex h-4 items-center">
                    <Skeleton className="h-3 w-24" />
                </div>
            </div>
            <div className="flex flex-col gap-2">
                <div className="flex h-5 items-center">
                    <Skeleton className="h-3.5 w-28" />
                </div>
                <Skeleton className="h-2 w-full rounded-full" />
            </div>
            <div className="flex gap-2">
                <Skeleton className="size-10 shrink-0 rounded-md" />
                <Skeleton className="h-10 flex-1 rounded-md" />
            </div>
        </div>
    );
};

export default ProgressTrackerSkeleton;
