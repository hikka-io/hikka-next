import type { FC } from 'react';

import HorizontalCardSkeleton from '@/components/horizontal-card-skeleton';
import { Skeleton } from '@/components/ui/skeleton';

const FollowingItemSkeleton: FC = () => (
    <HorizontalCardSkeleton
        imageClassName="w-10"
        imageRatio={1}
        action={<Skeleton className="h-5.5 w-11 shrink-0 rounded-sm" />}
    />
);

export default FollowingItemSkeleton;
