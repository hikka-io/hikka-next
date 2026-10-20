import type { FC } from 'react';

import { View } from 'react-native';

import { DEFAULT_CONTAINER_RATIO } from '@hikka/core';

import { Skeleton, SkeletonText } from '@/components/ui/skeleton';

const CatalogListItemSkeleton: FC = () => {
    return (
        <View className="flex-row items-center gap-4 px-4 py-2">
            <Skeleton
                style={{ aspectRatio: DEFAULT_CONTAINER_RATIO }}
                className="w-16 rounded-lg"
            />
            <View className="min-w-0 flex-1 gap-1.5">
                <SkeletonText
                    className="text-xs"
                    barClassName="h-2 w-1/4 rounded-lg"
                />
                <SkeletonText
                    className="text-base leading-tight"
                    barClassName="h-3 w-3/4 rounded-lg"
                />
                <SkeletonText
                    className="text-xs"
                    barClassName="h-2 w-1/2 rounded-lg"
                />
                <SkeletonText
                    className="text-xs"
                    barClassName="h-2 w-1/3 rounded-lg"
                />
                <SkeletonText
                    className="text-sm"
                    barClassName="h-2 w-2/5 rounded-lg"
                />
            </View>
        </View>
    );
};

export default CatalogListItemSkeleton;
