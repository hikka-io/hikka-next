import type { FC } from 'react';

import { View } from 'react-native';

import PosterCardSkeleton from '@/components/content-card/poster-card-skeleton';
import Card from '@/components/ui/card';
import { Skeleton, SkeletonText } from '@/components/ui/skeleton';

import { COLLECTION_COLUMNS } from './collection-rows';

const SKELETON_ROWS = 2;

const CollectionSkeleton: FC = () => {
    return (
        <View className="gap-6 px-4 pt-4">
            <Card className="flex-row items-center gap-4">
                <Skeleton className="size-10 rounded-lg" />
                <View className="flex-1 gap-1">
                    <SkeletonText
                        className="text-sm leading-tight"
                        barClassName="w-24"
                    />
                    <SkeletonText className="text-xs" barClassName="w-16" />
                </View>
            </Card>
            <View className="gap-4">
                <SkeletonText
                    className="text-2xl leading-8"
                    barClassName="w-3/4"
                />
                <Skeleton className="h-5.5 w-20 rounded-sm" />
                <SkeletonText className="text-base leading-6" lines={3} />
                <Skeleton className="h-11 w-32 rounded-md" />
            </View>
            {Array.from({ length: SKELETON_ROWS }, (_, row) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: static placeholders
                <View key={row} className="-mx-1.5 flex-row">
                    {Array.from({ length: COLLECTION_COLUMNS }, (_, index) => (
                        // biome-ignore lint/suspicious/noArrayIndexKey: static placeholders
                        <View key={index} className="flex-1 px-1.5">
                            <PosterCardSkeleton
                                subtitles={false}
                                titleLines={2}
                            />
                        </View>
                    ))}
                </View>
            ))}
        </View>
    );
};

export default CollectionSkeleton;
