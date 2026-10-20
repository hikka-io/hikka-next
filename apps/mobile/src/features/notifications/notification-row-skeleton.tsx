import type { FC } from 'react';

import { View } from 'react-native';

import { Skeleton, SkeletonText } from '@/components/ui/skeleton';

const NotificationRowSkeleton: FC = () => (
    <View className="flex-row items-start gap-4 border-l-4 border-l-transparent px-4 py-3">
        <Skeleton className="size-10" />
        <View className="min-w-0 flex-1 gap-1">
            <SkeletonText
                className="text-sm leading-tight"
                barClassName="h-3 w-32 rounded-lg"
            />
            <SkeletonText
                className="text-sm leading-5"
                barClassName="h-3 w-full rounded-lg"
            />
            <SkeletonText
                className="text-xs"
                barClassName="h-2 w-20 rounded-lg"
            />
        </View>
    </View>
);

export default NotificationRowSkeleton;
