import type { FC } from 'react';

import HorizontalCardSkeleton from '@/components/horizontal-card-skeleton';
import Card from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const FranchiseItemSkeleton: FC = () => (
    <Card>
        <HorizontalCardSkeleton />
        <Skeleton className="hidden h-10 w-full rounded-md md:block" />
    </Card>
);

export default FranchiseItemSkeleton;
