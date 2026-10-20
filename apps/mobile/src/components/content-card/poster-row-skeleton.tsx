import type { FC } from 'react';

import { View } from 'react-native';

import { cn } from '@/utils/cn';

import PosterCardSkeleton from './poster-card-skeleton';

// More cells than this never fit on a phone screen.
const VISIBLE_CELLS = 4;

export type PosterRowSkeletonProps = {
    count?: number;
    // Match the loaded card: `description` above the title, `subtitles` under it (one title line instead of two).
    description?: boolean;
    subtitles?: boolean;
    itemClassName?: string;
};

const PosterRowSkeleton: FC<PosterRowSkeletonProps> = ({
    count = VISIBLE_CELLS,
    description = false,
    subtitles = false,
    itemClassName = 'w-28',
}) => (
    <View className="-mx-4 flex-row gap-3 overflow-hidden px-4">
        {Array.from({ length: Math.min(count, VISIBLE_CELLS) }, (_, index) => (
            <PosterCardSkeleton
                // biome-ignore lint/suspicious/noArrayIndexKey: static placeholders
                key={index}
                description={description}
                subtitles={subtitles}
                titleLines={subtitles ? 1 : 2}
                className={cn('shrink-0', itemClassName)}
            />
        ))}
    </View>
);

export default PosterRowSkeleton;
