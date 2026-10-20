import type { FC } from 'react';

import { View } from 'react-native';

import { Skeleton, SkeletonText } from '@/components/ui/skeleton';

/** `CommentItem` while loading: avatar, author row, two lines of body, the vote and reply controls. */
const CommentSkeleton: FC = () => {
    return (
        <View className="flex-row gap-3">
            <View className="-m-0.5 size-11 items-center">
                <Skeleton className="size-10 rounded-lg" />
            </View>
            <View className="min-w-0 flex-1 gap-2">
                <View className="min-h-10 justify-center">
                    <SkeletonText
                        className="text-sm leading-5"
                        barClassName="h-3.5 w-40"
                    />
                </View>
                <SkeletonText
                    lines={2}
                    className="text-[15px] leading-[22px]"
                />
                <View className="-ml-2 flex-row items-center gap-1">
                    <Skeleton className="h-8 w-24 rounded-lg" />
                    <Skeleton className="h-8 w-28 rounded-lg" />
                </View>
            </View>
        </View>
    );
};

export default CommentSkeleton;
