import type { ReactElement } from 'react';

import { ActivityIndicator, FlatList, View } from 'react-native';

import PosterCardSkeleton from '@/components/content-card/poster-card-skeleton';
import InlineError from '@/components/inline-error';

const SKELETON_COUNT = 4;
const CARD_WIDTH = 'w-28';

type Props<T> = {
    list: T[] | undefined;
    isPending: boolean;
    error: unknown;
    hasNextPage: boolean;
    isFetchingNextPage: boolean;
    fetchNextPage: () => void;
    refetch: () => void;
    keyExtractor: (item: T) => string;
    renderItem: (item: T) => ReactElement;
    skeletonDescription?: boolean;
};

// A horizontal strip of poster cards that pages in as it scrolls; the caller owns the section header.
function PosterRow<T>({
    list,
    isPending,
    error,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    refetch,
    keyExtractor,
    renderItem,
    skeletonDescription,
}: Props<T>) {
    if (isPending) {
        return (
            <View className="flex-row gap-3 px-4">
                {Array.from({ length: SKELETON_COUNT }, (_, index) => (
                    <View key={index} className={CARD_WIDTH}>
                        <PosterCardSkeleton
                            description={skeletonDescription}
                            subtitles={false}
                            titleLines={2}
                        />
                    </View>
                ))}
            </View>
        );
    }

    if (error && !list) {
        return <InlineError onRetry={refetch} className="px-4" />;
    }

    return (
        <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={list}
            keyExtractor={keyExtractor}
            contentContainerClassName="gap-3 px-4"
            onEndReachedThreshold={0.5}
            onEndReached={() => {
                if (hasNextPage && !isFetchingNextPage) {
                    fetchNextPage();
                }
            }}
            renderItem={({ item }) => (
                <View className={CARD_WIDTH}>{renderItem(item)}</View>
            )}
            ListFooterComponent={
                isFetchingNextPage ? (
                    <View className="h-40 justify-center">
                        <ActivityIndicator />
                    </View>
                ) : null
            }
        />
    );
}

export default PosterRow;
