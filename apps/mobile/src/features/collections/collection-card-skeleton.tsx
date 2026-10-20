import type { FC } from 'react';

import { View } from 'react-native';

import PosterCardSkeleton from '@/components/content-card/poster-card-skeleton';
import Card from '@/components/ui/card';
import { Skeleton, SkeletonText } from '@/components/ui/skeleton';

import { COLLECTION_PREVIEW_SIZE } from './queries';

const CollectionCardSkeleton: FC = () => {
    return (
        <Card className="gap-4">
            <View className="min-h-11 flex-row items-center gap-4">
                <Skeleton className="size-10 rounded-lg" />
                <View className="flex-1 gap-1">
                    <SkeletonText
                        className="text-sm leading-tight"
                        barClassName="w-24"
                    />
                    <SkeletonText className="text-xs" barClassName="w-16" />
                </View>
            </View>
            <View className="gap-3">
                <SkeletonText
                    className="text-lg leading-7"
                    barClassName="w-2/3"
                />
                <Skeleton className="h-5.5 w-20 rounded-sm" />
            </View>
            <View className="flex-row gap-3">
                {Array.from(
                    { length: COLLECTION_PREVIEW_SIZE + 1 },
                    (_, index) => (
                        // biome-ignore lint/suspicious/noArrayIndexKey: static placeholders
                        <View key={index} className="flex-1">
                            <PosterCardSkeleton
                                subtitles={false}
                                titleLines={2}
                            />
                        </View>
                    ),
                )}
            </View>
            <View className="flex-row gap-1">
                <Skeleton className="h-8 w-12 rounded-lg" />
                <Skeleton className="h-8 w-12 rounded-lg" />
            </View>
        </Card>
    );
};

export default CollectionCardSkeleton;
