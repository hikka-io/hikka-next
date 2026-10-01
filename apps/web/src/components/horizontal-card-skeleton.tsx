import type { FC, PropsWithChildren, ReactNode } from 'react';

import { DEFAULT_CONTAINER_RATIO } from '@/components/content-card/image-presets';
import {
    HorizontalCard,
    HorizontalCardContainer,
} from '@/components/horizontal-card';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { labelVariants } from '@/components/ui/label';
import { Skeleton, SkeletonText } from '@/components/ui/skeleton';
import { cn } from '@/utils/cn';

type Props = PropsWithChildren<{
    className?: string;
    imageClassName?: string;
    imageRatio?: number;
    descriptionClassName?: string;
    action?: ReactNode;
}>;

const HorizontalCardSkeleton: FC<Props> = ({
    children,
    className,
    imageClassName,
    imageRatio = DEFAULT_CONTAINER_RATIO,
    descriptionClassName,
    action,
}) => (
    <HorizontalCard className={className}>
        <div className={cn('w-12 shrink-0', imageClassName)}>
            <AspectRatio ratio={imageRatio}>
                <Skeleton
                    className={cn(
                        'size-full',
                        imageRatio === 1
                            ? 'rounded-md'
                            : 'rounded-(--base-radius)',
                    )}
                />
            </AspectRatio>
        </div>
        <HorizontalCardContainer>
            <SkeletonText
                className={labelVariants()}
                barClassName="w-1/3 rounded"
            />
            <SkeletonText
                className={cn('text-xs', descriptionClassName)}
                barClassName="w-2/3 rounded"
            />
            {children}
        </HorizontalCardContainer>
        {action}
    </HorizontalCard>
);

export default HorizontalCardSkeleton;
