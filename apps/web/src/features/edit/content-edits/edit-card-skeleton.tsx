import type { FC } from 'react';

import HorizontalCardSkeleton from '@/components/horizontal-card-skeleton';
import { Skeleton } from '@/components/ui/skeleton';

const EditCardSkeleton: FC = () => (
    <div className="flex flex-col gap-4">
        <HorizontalCardSkeleton
            imageClassName="w-10"
            imageRatio={1}
            descriptionClassName="leading-relaxed"
            action={
                <Skeleton className="h-10 w-10 shrink-0 rounded-md md:w-28" />
            }
        />
        <div className="flex flex-wrap gap-2 border-l-2 pl-4">
            <Skeleton className="h-5.5 w-20 rounded-sm" />
            <Skeleton className="h-5.5 w-16 rounded-sm" />
        </div>
    </div>
);

export default EditCardSkeleton;
