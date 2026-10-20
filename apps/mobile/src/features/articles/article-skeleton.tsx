import type { FC } from 'react';

import { View } from 'react-native';

import Card from '@/components/ui/card';
import { Skeleton, SkeletonText } from '@/components/ui/skeleton';

const PARAGRAPHS = 3;

const ArticleSkeleton: FC = () => {
    return (
        <View className="gap-6 px-4 pt-4">
            <Card className="flex-row items-center gap-4">
                <Skeleton className="size-10 rounded-lg" />
                <View className="flex-1 gap-1">
                    <SkeletonText
                        className="text-sm leading-tight"
                        barClassName="w-24"
                    />
                    <SkeletonText className="text-xs" barClassName="w-32" />
                </View>
            </Card>
            <SkeletonText className="text-2xl leading-8" lines={2} />
            <View className="gap-4">
                {Array.from({ length: PARAGRAPHS }, (_, index) => (
                    <SkeletonText
                        key={index}
                        className="text-base leading-6"
                        lines={4}
                    />
                ))}
            </View>
        </View>
    );
};

export default ArticleSkeleton;
