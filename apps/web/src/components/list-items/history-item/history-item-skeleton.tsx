import type { FC } from 'react';

import HorizontalCardSkeleton from '@/components/horizontal-card-skeleton';
import { Skeleton, SkeletonText } from '@/components/ui/skeleton';

type Props = {
    withUser?: boolean;
};

const HistoryItemSkeleton: FC<Props> = ({ withUser }) => (
    <HorizontalCardSkeleton
        descriptionClassName="leading-relaxed"
        action={
            withUser && <Skeleton className="size-10 shrink-0 rounded-md" />
        }
    >
        <SkeletonText
            className="text-xs opacity-60"
            barClassName="h-3 w-20 rounded"
        />
    </HorizontalCardSkeleton>
);

export default HistoryItemSkeleton;
