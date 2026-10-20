import type { FC } from 'react';

import { FlashList } from '@shopify/flash-list';
import { useInfiniteQuery } from '@tanstack/react-query';
import { View } from 'react-native';

import PosterCardSkeleton from '@/components/content-card/poster-card-skeleton';
import { Button } from '@/components/ui/button';
import EmptyState from '@/components/ui/empty-state';
import ErrorState from '@/components/ui/error-state';
import { Spinner } from '@/components/ui/spinner';
import { useSession } from '@/features/auth';
import {
    ActiveFilters,
    clearFilters,
    useCatalogSearch,
    useHasActiveFilters,
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

const GRID_COLUMNS = 3;
/** With the cells' `px-1.5`, the grid keeps the screen's 16 pt gutter. */
const GRID_CONTAINER = { paddingHorizontal: 10, paddingBottom: 16 };
const LIST_CONTAINER = { paddingBottom: 16 };
const SKELETON_ITEMS: null[] = Array.from(
    { length: CATALOG_PAGE_SIZE },
    () => null,
);

const CatalogList: FC = () => {
    const type = useCatalogPrefs((state) => state.type);
    const view = useCatalogPrefs((state) => state.view);
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
    const filtered = useHasActiveFilters(type);

    const empty = error ? (
        <ErrorState
            error={error}
            onRetry={refetch}
            title="Не вдалося завантажити каталог"
            className="mt-8"
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
            // A title can move between pages while paging, so the index keeps keys unique.
            keyExtractor={(item, index) =>
                item ? `${item.slug}:${index}` : `skeleton-${index}`
            }
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
                isFetchingNextPage ? <Spinner className="py-4" /> : null
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
