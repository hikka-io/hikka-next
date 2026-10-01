import type { FC } from 'react';

import PosterCardSkeleton from '@/components/content-card/poster-card-skeleton';
import { Skeleton } from '@/components/ui/skeleton';

const StaffSkeleton: FC = () => (
    <div className="flex flex-col gap-2">
        <PosterCardSkeleton hasTitle={false} />
        <div className="mt-1 flex flex-col">
            <div className="mb-1 flex h-4 items-center">
                <Skeleton className="h-3 w-2/3 rounded" />
            </div>
            <div className="flex h-5 items-center">
                <Skeleton className="h-3.5 w-full rounded" />
            </div>
            <div className="flex h-5 items-center md:max-lg:hidden">
                <Skeleton className="h-3.5 w-1/2 rounded" />
            </div>
        </div>
    </div>
);

export default StaffSkeleton;
