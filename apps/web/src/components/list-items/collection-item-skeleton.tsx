import type { FC } from 'react';

import HorizontalCardSkeleton from '@/components/ui/horizontal-card-skeleton';
import { Skeleton } from '@/components/ui/skeleton';

const CollectionItemSkeleton: FC = () => (
    <HorizontalCardSkeleton>
        <div className="flex items-center gap-4">
            <Skeleton className="h-3 w-8 rounded" />
            <Skeleton className="h-3 w-8 rounded" />
            <Skeleton className="h-3 w-8 rounded" />
        </div>
    </HorizontalCardSkeleton>
);

export default CollectionItemSkeleton;
