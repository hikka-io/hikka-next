import type { FC } from 'react';

import { FlashList } from '@shopify/flash-list';
import { useInfiniteQuery } from '@tanstack/react-query';
import { CircleAlert } from 'lucide-react-native';
import { ActivityIndicator, View } from 'react-native';

import { apiErrorMessage } from '@hikka/core';

import PosterCardSkeleton from '@/components/content-card/poster-card-skeleton';
import { Button } from '@/components/ui/button';
import EmptyState from '@/components/ui/empty-state';
import { Icon } from '@/components/ui/icon';
import { useSession } from '@/features/auth';
import {
    ActiveFilters,
    clearFilters,
    getActiveFilters,
    useCatalogSearch,
    useUpdateCatalogSearch,
} from '@/features/filters';

import CatalogGridItem from './catalog-grid-item';
import CatalogListItem from './catalog-list-item';
import CatalogListItemSkeleton from './catalog-list-item-skeleton';
import { useCatalogPrefs } from './catalog-prefs-store';
import CatalogTypeControl from './catalog-type-control';
import {
    CATALOG_PAGE_SIZE,
    type CatalogItem,
    catalogSearchOptions,
} from './queries';

const ERROR_FALLBACK = 'Перевірте з’єднання та спробуйте ще раз';

const GRID_COLUMNS = 3;
/** With the cells' `px-1.5`, the grid keeps the screen's 16 pt gutter. */
const GRID_CONTAINER = { paddingHorizontal: 10, paddingBottom: 16 };
const LIST_CONTAINER = { paddingBottom: 16 };
const SKELETON_ITEMS: null[] = Array.from(
    { length: CATALOG_PAGE_SIZE },
    () => null,
);

const CatalogList: FC = () => {
    const { type, view } = useCatalogPrefs();
    const search = useCatalogSearch(type);
    const update = useUpdateCatalogSearch(type);
    const { hasToken } = useSession();
    const grid = view === 'grid';

    const {
        data,
        error,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isPending,
        isRefetching,
        refetch,
    } = useInfiniteQuery(catalogSearchOptions(type, search, hasToken));

    const list: (CatalogItem | null)[] = isPending
        ? SKELETON_ITEMS
        : (data?.pages.flatMap((page) => page.list) ?? []);
    const filtered =
        getActiveFilters(search, { signedIn: hasToken }).length > 0;

    const empty = error ? (
        <EmptyState
            className="mt-8"
            icon={<Icon as={CircleAlert} />}
            title="Не вдалося завантажити каталог"
            description={apiErrorMessage(error, ERROR_FALLBACK)}
            action={
                <Button variant="secondary" onPress={() => refetch()}>
                    Спробувати ще
                </Button>
            }
        />
    ) : (
        <EmptyState
            className="mt-8"
            title="Не знайдено результатів за Вашим запитом"
            description="Очистіть або змініть фільтри, щоб отримати інший результат"
            action={
                filtered ? (
                    <Button
                        variant="secondary"
                        onPress={() => update(clearFilters)}
                    >
                        Очистити
                    </Button>
                ) : undefined
            }
        />
    );

    return (
        <FlashList
            key={view}
            className="bg-background"
            contentInsetAdjustmentBehavior="automatic"
            contentContainerStyle={grid ? GRID_CONTAINER : LIST_CONTAINER}
            data={list}
            numColumns={grid ? GRID_COLUMNS : 1}
            keyExtractor={(item, index) => item?.slug ?? `skeleton-${index}`}
            renderItem={({ item }) => {
                if (grid) {
                    return (
                        <View className="px-1.5 pb-4">
                            {item ? (
                                <CatalogGridItem item={item} />
                            ) : (
                                <PosterCardSkeleton />
                            )}
                        </View>
                    );
                }

                return item ? (
                    <CatalogListItem item={item} />
                ) : (
                    <CatalogListItemSkeleton />
                );
            }}
            ListHeaderComponent={
                <View className={grid ? '-mx-2.5 pb-2' : 'pb-2'}>
                    <CatalogTypeControl />
                    <ActiveFilters type={type} />
                </View>
            }
            ListEmptyComponent={empty}
            ListFooterComponent={
                isFetchingNextPage ? (
                    <ActivityIndicator className="py-4" />
                ) : null
            }
            onEndReached={() => {
                if (hasNextPage && !isFetchingNextPage) fetchNextPage();
            }}
            onEndReachedThreshold={0.5}
            refreshing={isRefetching && !isFetchingNextPage}
            onRefresh={refetch}
        />
    );
};

export default CatalogList;
