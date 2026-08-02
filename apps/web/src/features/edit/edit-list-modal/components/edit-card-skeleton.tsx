import type { FC } from 'react';

import HorizontalCardSkeleton from '@/components/ui/horizontal-card-skeleton';
import { Skeleton } from '@/components/ui/skeleton';

const EditCardSkeleton: FC = () => (
    <div className="flex flex-col gap-4">
        <HorizontalCardSkeleton
            imageClassName="w-10"
            imageRatio={1}
            action={<Skeleton className="h-10 w-24 shrink-0 rounded-md" />}
        />
        <div className="flex flex-wrap gap-2 border-l-2 pl-4">
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-6 w-16 rounded-full" />
        </div>
    </div>
);

export default EditCardSkeleton;
