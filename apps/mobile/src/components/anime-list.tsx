import type { FC } from 'react';

import { FlashList } from '@shopify/flash-list';
import { useInfiniteQuery } from '@tanstack/react-query';
import { ActivityIndicator, Text, View } from 'react-native';

import {
    type AnimeSearchArgs,
    paginatedInfiniteOptions,
    searchAnimeInfiniteOptions,
} from '@hikka/api';

import AnimeRow from './anime-row';

const PAGE_SIZE = 30;

type Props = {
    args: AnimeSearchArgs;
};

const AnimeList: FC<Props> = ({ args }) => {
    const {
        data,
        error,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isPending,
        refetch,
        isRefetching,
    } = useInfiniteQuery(
        paginatedInfiniteOptions(
            searchAnimeInfiniteOptions({
                body: args,
                query: { size: PAGE_SIZE },
            }),
        ),
    );

    const list = data?.pages.flatMap((page) => page.list) ?? [];

    if (isPending) {
        return (
            <View className="flex-1 items-center justify-center bg-background">
                <ActivityIndicator />
            </View>
        );
    }

    if (error) {
        return (
            <View className="flex-1 items-center justify-center bg-background p-6">
                <Text className="text-center text-destructive-foreground">
                    {error.message}
                </Text>
            </View>
        );
    }

    return (
        <FlashList
            className="bg-background"
            contentInsetAdjustmentBehavior="automatic"
            data={list}
            keyExtractor={(anime) => anime.slug}
            renderItem={({ item }) => <AnimeRow anime={item} />}
            onEndReached={() => {
                if (hasNextPage && !isFetchingNextPage) fetchNextPage();
            }}
            onEndReachedThreshold={0.5}
            refreshing={isRefetching}
            onRefresh={refetch}
            ListEmptyComponent={
                <Text className="p-6 text-center text-muted-foreground">
                    Нічого не знайдено
                </Text>
            }
            ListFooterComponent={
                isFetchingNextPage ? (
                    <ActivityIndicator className="py-4" />
                ) : null
            }
        />
    );
};

export default AnimeList;
