import { type FC, useState } from 'react';

import { FlashList } from '@shopify/flash-list';
import { useInfiniteQuery } from '@tanstack/react-query';
import * as Haptics from 'expo-haptics';
import { Stack } from 'expo-router';
import { Layers } from 'lucide-react-native';
import { Platform, View } from 'react-native';

import type { CollectionResponse } from '@hikka/api';
import {
    COLLECTION_SORT_OPTIONS,
    type CollectionSort,
    DEFAULT_COLLECTION_SORT,
} from '@hikka/core';

import EmptyState from '@/components/ui/empty-state';
import ErrorState from '@/components/ui/error-state';
import { Icon } from '@/components/ui/icon';
import { Spinner } from '@/components/ui/spinner';

import CollectionCard from './collection-card';
import CollectionCardSkeleton from './collection-card-skeleton';
import { authorCollectionsOptions, collectionListOptions } from './queries';

// Compose toolbar items take image sources only; SF Symbols are iOS-only.
const SORT_ICON =
    Platform.OS === 'android'
        ? require('../../../assets/icons/swap-vert.xml')
        : 'arrow.up.arrow.down';
const SKELETON_COUNT = 3;
const SKELETONS: null[] = Array.from({ length: SKELETON_COUNT }, () => null);

type Props = {
    /** One user's collections, newest first, as the web's profile list; the sort menu is hidden. */
    author?: string;
    /** A fixed list (a title's collections, the web's `CollectionListModal`); the sort menu is hidden. */
    options?: ReturnType<typeof collectionListOptions>;
    emptyTitle?: string;
    emptyDescription?: string;
};

/** The web's collections page: one infinite list, the Популярні / Нові toggle in a header menu. */
const CollectionList: FC<Props> = ({
    author,
    options,
    emptyTitle = 'Немає колекцій',
    emptyDescription,
}) => {
    const [sort, setSort] = useState<CollectionSort>(DEFAULT_COLLECTION_SORT);
    const {
        data,
        error,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isFetchNextPageError,
        isPending,
        isRefetching,
        refetch,
    } = useInfiniteQuery(
        options ??
            (author
                ? authorCollectionsOptions(author)
                : collectionListOptions(sort)),
    );

    const list: (CollectionResponse | null)[] = isPending
        ? SKELETONS
        : (data?.pages.flatMap((page) => page.list) ?? []);

    return (
        <>
            {author || options ? null : (
                <Stack.Toolbar placement="right">
                    <Stack.Toolbar.Menu
                        icon={SORT_ICON}
                        accessibilityLabel="Сортування"
                    >
                        {COLLECTION_SORT_OPTIONS.map((option) => (
                            <Stack.Toolbar.MenuAction
                                key={option.value}
                                isOn={sort === option.value}
                                onPress={() => {
                                    Haptics.selectionAsync();
                                    setSort(option.value);
                                }}
                            >
                                {option.label}
                            </Stack.Toolbar.MenuAction>
                        ))}
                    </Stack.Toolbar.Menu>
                </Stack.Toolbar>
            )}
            <FlashList
                className="bg-background"
                contentInsetAdjustmentBehavior="automatic"
                contentContainerClassName="px-4 pt-2 pb-8"
                data={list}
                keyExtractor={(item, index) =>
                    item ? `${item.reference}:${index}` : `skeleton-${index}`
                }
                getItemType={(item) => (item ? 'card' : 'skeleton')}
                renderItem={({ item }) => (
                    <View className="pb-4">
                        {item ? (
                            <CollectionCard collection={item} />
                        ) : (
                            <CollectionCardSkeleton />
                        )}
                    </View>
                )}
                ListEmptyComponent={
                    error ? (
                        <ErrorState
                            error={error}
                            onRetry={refetch}
                            title="Не вдалося завантажити колекції"
                            className="mt-8"
                        />
                    ) : (
                        <EmptyState
                            className="mt-8"
                            icon={<Icon as={Layers} />}
                            title={emptyTitle}
                            description={emptyDescription}
                        />
                    )
                }
                ListFooterComponent={
                    isFetchingNextPage ? (
                        <Spinner className="py-4" />
                    ) : isFetchNextPageError ? (
                        <ErrorState
                            variant="inline"
                            onRetry={() => void fetchNextPage()}
                        />
                    ) : null
                }
                onEndReached={() => {
                    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
                }}
                onEndReachedThreshold={0.5}
                refreshing={isRefetching && !isFetchingNextPage}
                onRefresh={refetch}
            />
        </>
    );
};

export default CollectionList;
