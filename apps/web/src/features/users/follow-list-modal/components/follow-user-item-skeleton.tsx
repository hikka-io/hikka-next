import type { FC } from 'react';

import HorizontalCardSkeleton from '@/components/ui/horizontal-card-skeleton';
import { Skeleton } from '@/components/ui/skeleton';

const FollowUserItemSkeleton: FC = () => (
    <HorizontalCardSkeleton
        imageRatio={1}
        action={<Skeleton className="h-10 w-28 shrink-0 rounded-md" />}
    />
);

export default FollowUserItemSkeleton;
