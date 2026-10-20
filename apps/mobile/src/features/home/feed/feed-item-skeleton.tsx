import type { FC } from 'react';

import { View } from 'react-native';

import { Skeleton, SkeletonText } from '@/components/ui/skeleton';

const FeedItemSkeleton: FC = () => {
    return (
        <View className="flex-row items-start gap-4 px-4 py-4">
            <Skeleton className="size-10 rounded-md" />
            <View className="min-w-0 flex-1 gap-3">
                <View className="gap-3">
                    <SkeletonText
                        className="text-sm leading-5"
                        barClassName="h-3.5 w-40"
                    />
                    <Skeleton className="h-8 w-48 max-w-full rounded-md" />
                </View>
                <SkeletonText lines={2} className="text-sm leading-5" />
                <View className="flex-row items-center gap-1">
                    <Skeleton className="h-8 w-20 rounded-md" />
                    <Skeleton className="h-8 w-8 rounded-md" />
                </View>
            </View>
        </View>
    );
};

export default FeedItemSkeleton;
