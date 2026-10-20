import type { FC } from 'react';

import { View } from 'react-native';

import { Skeleton } from '@/components/ui/skeleton';

type Props = {
    compact?: boolean;
};

/** Matches `CollectionRow`: cover, then the author line (not compact), title and stats. */
const CollectionRowSkeleton: FC<Props> = ({ compact }) => {
    return (
        <View className="flex-row items-center gap-4 px-4 py-3">
            <Skeleton className="aspect-[0.7] w-14 rounded-lg" />
            <View className="flex-1 gap-2">
                {compact ? null : <Skeleton className="h-3 w-1/3" />}
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/4" />
            </View>
        </View>
    );
};

export default CollectionRowSkeleton;
