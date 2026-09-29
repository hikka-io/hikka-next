import type { FC } from 'react';

import HorizontalCardSkeleton from '@/components/ui/horizontal-card-skeleton';
import { Skeleton } from '@/components/ui/skeleton';

const HistoryItemSkeleton: FC = () => (
    <HorizontalCardSkeleton>
        <Skeleton className="h-3 w-20 rounded opacity-60" />
    </HorizontalCardSkeleton>
);

export default HistoryItemSkeleton;
