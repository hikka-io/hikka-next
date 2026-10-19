import type { FC } from 'react';

import { View } from 'react-native';

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
        <View className={cn('w-full flex-col gap-2', className)}>
            <Skeleton
                style={{ aspectRatio: containerRatio }}
                className="w-full rounded-md"
            />
            {hasTitle && (
                <View className="mt-1">
                    {description && (
                        <SkeletonText
                            className="mb-1 text-xs"
                            barClassName="h-2 w-1/2 rounded-lg"
                        />
                    )}
                    <SkeletonText
                        className="text-sm leading-5"
                        lines={subtitles ? 1 : titleLines}
                        barClassName="h-2 rounded-lg"
                    />
                    {subtitles && (
                        <SkeletonText
                            className="mt-1 text-xs leading-tight"
                            barClassName="h-2 w-1/3 rounded-lg"
                        />
                    )}
                </View>
            )}
        </View>
    );
};

export default PosterCardSkeleton;
