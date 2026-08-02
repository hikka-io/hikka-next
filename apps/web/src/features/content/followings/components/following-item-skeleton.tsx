import type { FC } from 'react';

import HorizontalCardSkeleton from '@/components/ui/horizontal-card-skeleton';
import { Skeleton } from '@/components/ui/skeleton';

const FollowingItemSkeleton: FC = () => (
    <HorizontalCardSkeleton
        imageClassName="w-10"
        imageRatio={1}
        action={<Skeleton className="h-6 w-12 shrink-0 rounded-md" />}
    />
);

export default FollowingItemSkeleton;
