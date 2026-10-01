import type { FC } from 'react';

import HorizontalCardSkeleton from '@/components/horizontal-card-skeleton';
import { Skeleton } from '@/components/ui/skeleton';

const FollowUserItemSkeleton: FC = () => (
    <HorizontalCardSkeleton
        imageRatio={1}
        descriptionClassName="leading-relaxed"
        action={<Skeleton className="h-10 w-36 shrink-0 rounded-md" />}
    />
);

export default FollowUserItemSkeleton;
