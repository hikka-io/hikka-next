import type { FC } from 'react';

import HorizontalCardSkeleton from '@/components/horizontal-card-skeleton';
import { Skeleton } from '@/components/ui/skeleton';

const CollectionItemSkeleton: FC = () => (
    <HorizontalCardSkeleton descriptionClassName="leading-relaxed">
        <div className="flex h-lh items-center gap-3 text-xs leading-normal">
            <Skeleton className="h-3 w-8 rounded" />
            <Skeleton className="h-3 w-8 rounded" />
            <Skeleton className="h-3 w-8 rounded" />
        </div>
    </HorizontalCardSkeleton>
);

export default CollectionItemSkeleton;
