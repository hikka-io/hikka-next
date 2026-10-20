import type { FC } from 'react';

import { View } from 'react-native';

import { Skeleton } from '@/components/ui/skeleton';

type Props = {
    compact?: boolean;
};

/** Matches `ArticleRow`: the badge or author line, the title, the excerpt (not compact), then time and stats. */
const ArticleRowSkeleton: FC<Props> = ({ compact }) => {
    return (
        <View className="gap-2 px-4 py-3">
            <View className="flex-row items-center gap-2">
                {compact ? (
                    <Skeleton className="ml-auto h-5 w-16 rounded-sm" />
                ) : (
                    <>
                        <Skeleton className="size-5 rounded-sm" />
                        <Skeleton className="h-3 w-24" />
                    </>
                )}
            </View>
            <Skeleton className="h-5 w-4/5" />
            {compact ? null : <Skeleton className="h-3 w-full" />}
            <View className="flex-row items-center justify-between">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-3 w-24" />
            </View>
        </View>
    );
};

export default ArticleRowSkeleton;
