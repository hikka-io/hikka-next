import type { FC } from 'react';

import { View } from 'react-native';

import PosterCardSkeleton from '@/components/content-card/poster-card-skeleton';
import { Skeleton, SkeletonText } from '@/components/ui/skeleton';

const EntitySkeleton: FC = () => (
    <View className="gap-6 px-4 pt-4">
        <View className="flex-row gap-4">
            <View className="w-32">
                <PosterCardSkeleton hasTitle={false} />
            </View>
            <View className="flex-1 justify-end gap-2">
                <SkeletonText className="text-2xl leading-8" lines={2} />
                <SkeletonText className="text-sm" barClassName="w-1/2" />
            </View>
        </View>
        <Skeleton className="h-32 w-full rounded-lg" />
        <View className="gap-3">
            <Skeleton className="h-6 w-24" />
            <SkeletonText className="text-base leading-6" lines={4} />
        </View>
        <View className="gap-3">
            <Skeleton className="h-6 w-24" />
            <View className="flex-row gap-3">
                {Array.from({ length: 3 }, (_, index) => (
                    <View key={index} className="w-28">
                        <PosterCardSkeleton subtitles={false} titleLines={2} />
                    </View>
                ))}
            </View>
        </View>
    </View>
);

export default EntitySkeleton;
