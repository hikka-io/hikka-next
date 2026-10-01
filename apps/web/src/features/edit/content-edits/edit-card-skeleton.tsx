import type { FC } from 'react';

import {
    HorizontalCard,
    HorizontalCardContainer,
} from '@/components/horizontal-card';
import { Skeleton } from '@/components/ui/skeleton';

const EditCardSkeleton: FC = () => (
    <div className="flex flex-col gap-4">
        <HorizontalCard>
            <Skeleton className="size-10 shrink-0 rounded-md" />
            <HorizontalCardContainer>
                <div className="flex h-4.5 items-center">
                    <Skeleton className="h-3.5 w-24" />
                </div>
                <div className="flex h-5 items-center">
                    <Skeleton className="h-3 w-28" />
                </div>
            </HorizontalCardContainer>
            <Skeleton className="h-10 w-10 shrink-0 rounded-md md:w-28" />
        </HorizontalCard>
        <div className="flex flex-wrap gap-2 border-l-2 pl-4">
            <Skeleton className="h-5.5 w-20 rounded-sm" />
            <Skeleton className="h-5.5 w-16 rounded-sm" />
        </div>
    </div>
);

export default EditCardSkeleton;
