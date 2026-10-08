import type { FC } from 'react';

import { DEFAULT_CONTAINER_RATIO } from '@/components/content-card/image-presets';
import {
    HorizontalCard,
    HorizontalCardContainer,
} from '@/components/horizontal-card';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Skeleton } from '@/components/ui/skeleton';

const CollectionWidgetSkeleton: FC = () => (
    <HorizontalCard className="px-2 py-2">
        <div className="w-14 shrink-0">
            <AspectRatio ratio={DEFAULT_CONTAINER_RATIO}>
                <Skeleton className="size-full rounded-(--base-radius)" />
            </AspectRatio>
        </div>
        <HorizontalCardContainer>
            <div className="flex h-5 items-center gap-2">
                <Skeleton className="size-5 shrink-0 rounded-sm" />
                <Skeleton className="h-3 w-20" />
            </div>
            <div className="flex h-lh items-center text-sm leading-snug">
                <Skeleton className="h-3.5 w-3/4" />
            </div>
            <div className="flex h-4.5 items-center gap-3">
                <Skeleton className="h-3 w-8" />
                <Skeleton className="h-3 w-8" />
            </div>
        </HorizontalCardContainer>
    </HorizontalCard>
);

export default CollectionWidgetSkeleton;
