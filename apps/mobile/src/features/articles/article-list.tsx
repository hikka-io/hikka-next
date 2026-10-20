import { type FC, useState } from 'react';

import { FlashList } from '@shopify/flash-list';
import { useInfiniteQuery } from '@tanstack/react-query';
import * as Haptics from 'expo-haptics';
import { Stack } from 'expo-router';
import { Newspaper } from 'lucide-react-native';
import { Platform, View } from 'react-native';

import type { ArticlePreviewResponse } from '@hikka/api';
import {
    ARTICLE_CATEGORY,
    type ArticlesSearch,
    getSort,
    type SortOrder,
} from '@hikka/core';

import ListFooter from '@/components/list-footer';
import EmptyState from '@/components/ui/empty-state';
import ErrorState from '@/components/ui/error-state';
import { Icon } from '@/components/ui/icon';
import { useSession } from '@/features/auth';

import ArticleCard from './article-card';
import ArticleCardSkeleton from './article-card-skeleton';
import ArticleFilters from './article-filters';
import { articleListOptions, singleCategory } from './queries';

// Compose toolbar items take image sources only; SF Symbols are iOS-only.
const SORT_ICON =
    Platform.OS === 'android'
        ? require('../../../assets/icons/swap-vert.xml')
        : 'arrow.up.arrow.down';
const SORT_OPTIONS = getSort('article');
const ORDERS: { value: SortOrder; label: string }[] = [
    { value: 'desc', label: 'За спаданням' },
    { value: 'asc', label: 'За зростанням' },
];
const SKELETON_COUNT = 3;
const SKELETONS: null[] = Array.from({ length: SKELETON_COUNT }, () => null);

type Props = {
    // The filters a hikka.io link carried (`/articles?categories=…&author=…&tags=…`).
    initialSearch: ArticlesSearch;
    /** A fixed list (a title's articles, the web's `ContentArticlesModal`): no filters and no sort menu. */
    options?: ReturnType<typeof articleListOptions>;
    emptyTitle?: string;
    emptyDescription?: string;
};

/** The web's articles page: category chips and link filters, sort and order in a header menu, an infinite list of previews. */
const ArticleList: FC<Props> = ({
    initialSearch,
    options,
    emptyTitle = 'Не знайдено результатів за Вашим запитом',
    emptyDescription,
}) => {
    const { hasToken } = useSession();
    const [search, setSearch] = useState(initialSearch);
    const sort = search.sort ?? SORT_OPTIONS[0].value;
    const order = search.order ?? 'desc';
    const category = singleCategory(search);
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
            articleListOptions({
                ...search,
                draft: hasToken ? search.draft : undefined,
            }),
    );

    const list: (ArticlePreviewResponse | null)[] = isPending
        ? SKELETONS
        : (data?.pages.flatMap((page) => page.list) ?? []);

    const select = (apply: () => void) => {
        Haptics.selectionAsync();
        apply();
    };

    return (
        <>
            <Stack.Title>
                {category && !options
                    ? ARTICLE_CATEGORY[category].title_ua
                    : 'Статті'}
            </Stack.Title>
            {options ? null : (
                <Stack.Toolbar placement="right">
                    <Stack.Toolbar.Menu
                        icon={SORT_ICON}
                        accessibilityLabel="Сортування"
                    >
                        <Stack.Toolbar.Menu inline title="Сортування">
                            {SORT_OPTIONS.map((option) => (
                                <Stack.Toolbar.MenuAction
                                    key={option.value}
                                    isOn={sort === option.value}
                                    onPress={() =>
                                        select(() =>
                                            setSearch((prev) => ({
                                                ...prev,
                                                sort: option.value,
                                            })),
                                        )
                                    }
                                >
                                    {option.label}
                                </Stack.Toolbar.MenuAction>
                            ))}
                        </Stack.Toolbar.Menu>
                        <Stack.Toolbar.Menu inline title="Порядок">
                            {ORDERS.map((option) => (
                                <Stack.Toolbar.MenuAction
                                    key={option.value}
                                    isOn={order === option.value}
                                    onPress={() =>
                                        select(() =>
                                            setSearch((prev) => ({
                                                ...prev,
                                                order: option.value,
                                            })),
                                        )
                                    }
                                >
                                    {option.label}
                                </Stack.Toolbar.MenuAction>
                            ))}
                        </Stack.Toolbar.Menu>
                    </Stack.Toolbar.Menu>
                </Stack.Toolbar>
            )}
            <FlashList
                className="bg-background"
                contentInsetAdjustmentBehavior="automatic"
                contentContainerClassName="px-4 pt-2 pb-8"
                data={list}
                keyExtractor={(item, index) =>
                    item ? `${item.slug}:${index}` : `skeleton-${index}`
                }
                getItemType={(item) => (item ? 'card' : 'skeleton')}
                renderItem={({ item }) => (
                    <View className="pb-4">
                        {item ? (
                            <ArticleCard article={item} />
                        ) : (
                            <ArticleCardSkeleton />
                        )}
                    </View>
                )}
                ListHeaderComponent={
                    options ? null : (
                        <ArticleFilters
                            search={search}
                            showDraft={hasToken}
                            onChange={setSearch}
                        />
                    )
                }
                ListEmptyComponent={
                    error ? (
                        <ErrorState
                            error={error}
                            onRetry={refetch}
                            title="Не вдалося завантажити статті"
                            className="mt-8"
                        />
                    ) : (
                        <EmptyState
                            className="mt-8"
                            icon={<Icon as={Newspaper} />}
                            title={emptyTitle}
                            description={emptyDescription}
                        />
                    )
                }
                ListFooterComponent={
                    <ListFooter
                        fetching={isFetchingNextPage}
                        error={isFetchNextPageError}
                        onRetry={() => void fetchNextPage()}
                    />
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

export default ArticleList;
