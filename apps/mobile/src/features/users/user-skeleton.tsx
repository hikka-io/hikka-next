import type { FC } from 'react';

import { View } from 'react-native';

import Card from '@/components/ui/card';
import { Skeleton, SkeletonText } from '@/components/ui/skeleton';

const UserSkeleton: FC = () => (
    <View>
        <Skeleton className="h-36 w-full rounded-none" />
        <View className="gap-4 px-4">
            <View className="-mt-10 flex-row items-end gap-4">
                <Skeleton className="size-24 rounded-full border-4 border-background" />
                <View className="flex-1 flex-row gap-6 pb-1">
                    <Skeleton className="h-10 w-16" />
                    <Skeleton className="h-10 w-20" />
                </View>
            </View>
            <SkeletonText className="text-2xl leading-8" barClassName="w-1/2" />
            <SkeletonText className="text-sm leading-5" lines={2} />
        </View>
        <View className="px-4 pt-6">
            <Card className="h-56">
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-8 w-full" />
            </Card>
        </View>
    </View>
);

export default UserSkeleton;
