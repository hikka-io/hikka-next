import type { FC, PropsWithChildren, ReactNode } from 'react';

import { DEFAULT_CONTAINER_RATIO } from '@/components/content-card/content-card';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import {
    HorizontalCard,
    HorizontalCardContainer,
} from '@/components/ui/horizontal-card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/utils/cn';

type Props = PropsWithChildren<{
    className?: string;
    imageClassName?: string;
    imageRatio?: number;
    action?: ReactNode;
}>;

const HorizontalCardSkeleton: FC<Props> = ({
    children,
    className,
    imageClassName,
    imageRatio = DEFAULT_CONTAINER_RATIO,
    action,
}) => (
    <HorizontalCard className={className}>
        <div className={cn('w-12 shrink-0', imageClassName)}>
            <AspectRatio ratio={imageRatio}>
                <Skeleton className="size-full rounded-md" />
            </AspectRatio>
        </div>
        <HorizontalCardContainer>
            <Skeleton className="h-4 w-1/3 rounded" />
            <Skeleton className="h-3 w-2/3 rounded" />
            {children}
        </HorizontalCardContainer>
        {action}
    </HorizontalCard>
);

export default HorizontalCardSkeleton;
