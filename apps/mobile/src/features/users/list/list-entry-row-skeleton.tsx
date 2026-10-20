import type { FC } from 'react';

import { View } from 'react-native';

import { DEFAULT_CONTAINER_RATIO } from '@hikka/core';

import { Skeleton, SkeletonText } from '@/components/ui/skeleton';

type Props = {
    // Under Усе every row carries its status badge.
    badge: boolean;
};

/** `ListEntryRow` while loading: poster, title, the progress line and the badge row. */
const ListEntryRowSkeleton: FC<Props> = ({ badge }) => (
    <View className="flex-row items-center gap-4 px-4 py-2">
        <Skeleton
            style={{ aspectRatio: DEFAULT_CONTAINER_RATIO }}
            className="w-12 rounded-lg"
        />
        <View className="min-w-0 flex-1 gap-1.5">
            <SkeletonText
                className="font-medium text-sm leading-tight"
                barClassName="w-3/4"
            />
            <SkeletonText className="text-xs" barClassName="w-1/2" />
            {badge ? <Skeleton className="h-5 w-24 rounded-sm" /> : null}
        </View>
    </View>
);

export default ListEntryRowSkeleton;
