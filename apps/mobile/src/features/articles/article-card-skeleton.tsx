import type { FC } from 'react';

import { View } from 'react-native';

import Card from '@/components/ui/card';
import { Skeleton, SkeletonText } from '@/components/ui/skeleton';

// The backend preview holds about 300 characters: some five lines on a phone.
const PREVIEW_LINES = 5;

const ArticleCardSkeleton: FC = () => {
    return (
        <Card className="gap-4">
            <View className="min-h-11 flex-row items-center gap-4">
                <Skeleton className="size-10 rounded-lg" />
                <View className="flex-1 gap-1">
                    <SkeletonText
                        className="text-sm leading-tight"
                        barClassName="w-24"
                    />
                    <SkeletonText className="text-xs" barClassName="w-32" />
                </View>
            </View>
            <SkeletonText className="text-lg leading-7" barClassName="w-2/3" />
            <View className="flex-row gap-2">
                <Skeleton className="h-5.5 w-20 rounded-sm" />
                <Skeleton className="h-5.5 w-14 rounded-sm" />
            </View>
            <SkeletonText
                className="text-base leading-6"
                lines={PREVIEW_LINES}
            />
            <View className="flex-row gap-1">
                <Skeleton className="h-8 w-12 rounded-lg" />
                <Skeleton className="h-8 w-12 rounded-lg" />
                <Skeleton className="h-8 w-12 rounded-lg" />
            </View>
        </Card>
    );
};

export default ArticleCardSkeleton;
