import type { FC } from 'react';

import { Skeleton } from '@/components/ui/skeleton';

const CollectionWidgetSkeleton: FC = () => (
    <div className="flex items-center gap-3 px-2 py-2">
        <Skeleton className="aspect-[2/3] w-14 shrink-0 rounded-md" />
        <div className="flex flex-1 flex-col gap-2">
            <Skeleton className="h-3 w-1/3 rounded" />
            <Skeleton className="h-4 w-3/4 rounded" />
            <Skeleton className="h-3 w-1/2 rounded" />
        </div>
    </div>
);

export default CollectionWidgetSkeleton;
