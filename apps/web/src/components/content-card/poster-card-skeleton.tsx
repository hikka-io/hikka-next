import type { FC } from 'react';

import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Skeleton, SkeletonText } from '@/components/ui/skeleton';
import { cn } from '@/utils/cn';

import { DEFAULT_CONTAINER_RATIO } from './image-presets';

type Props = {
    hasTitle?: boolean;
    description?: boolean;
    subtitles?: boolean;
    titleLines?: 1 | 2;
    containerRatio?: number;
    className?: string;
};

const PosterCardSkeleton: FC<Props> = ({
    hasTitle = true,
    description = false,
    subtitles = true,
    titleLines = 1,
    containerRatio = DEFAULT_CONTAINER_RATIO,
    className,
}) => {
    return (
        <div className={cn('flex w-full flex-col gap-2', className)}>
            <AspectRatio ratio={containerRatio} className="w-full">
                <Skeleton className="size-full rounded-md" />
            </AspectRatio>
            {hasTitle && (
                <div className="mt-1">
                    {description && (
                        <SkeletonText
                            className="mb-1 text-xs"
                            barClassName="h-2 w-1/2 rounded-lg"
                        />
                    )}
                    <SkeletonText
                        className={cn(!subtitles && 'text-sm leading-5')}
                        lines={subtitles ? 1 : titleLines}
                        barClassName="h-2 rounded-lg"
                    />
                    {subtitles && (
                        <SkeletonText
                            className="mt-1 text-xs leading-tight"
                            barClassName="h-2 w-1/3 rounded-lg"
                        />
                    )}
                </div>
            )}
        </div>
    );
};

export default PosterCardSkeleton;
