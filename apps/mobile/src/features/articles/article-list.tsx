import { type FC, useState } from 'react';

import { FlashList } from '@shopify/flash-list';
import { useInfiniteQuery } from '@tanstack/react-query';
import * as Haptics from 'expo-haptics';
import { Stack } from 'expo-router';
import { Newspaper } from 'lucide-react-native';
import { ActivityIndicator, Platform, ScrollView, View } from 'react-native';

import type { ArticleCategoryEnum, ArticlePreviewResponse } from '@hikka/api';
import {
    ARTICLE_CATEGORY,
    getSort,
    PUBLIC_ARTICLE_CATEGORIES,
    type SortOrder,
} from '@hikka/core';

import { Chip } from '@/components/ui/chip';
import EmptyState from '@/components/ui/empty-state';
import ErrorState from '@/components/ui/error-state';
import { Icon } from '@/components/ui/icon';

import ArticleCard from './article-card';
import ArticleCardSkeleton from './article-card-skeleton';
import { articleListOptions } from './queries';

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

type CategoryChipsProps = {
    category?: ArticleCategoryEnum;
    onChange: (category?: ArticleCategoryEnum) => void;
};

/** The web's category filter as a chip row (`ChipTabs`), one category at a time. */
const CategoryChips: FC<CategoryChipsProps> = ({ category, onChange }) => {
    const options: { value?: ArticleCategoryEnum; label: string }[] = [
        { label: 'Усі' },
        ...PUBLIC_ARTICLE_CATEGORIES.map((value) => ({
            value,
            label: ARTICLE_CATEGORY[value].title_ua,
        })),
    ];

    return (
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="-mx-4"
            contentContainerClassName="gap-2 px-4 pb-2"
        >
            {options.map((option) => {
                const selected = option.value === category;
                return (
                    <Chip
                        key={option.value ?? 'all'}
                        selected={selected}
                        className={selected ? undefined : 'bg-secondary'}
                        onPress={() => {
                            if (selected) return;
                            Haptics.selectionAsync();
                            onChange(option.value);
                        }}
                    >
                        {option.label}
                    </Chip>
                );
            })}
        </ScrollView>
    );
};

type Props = {
    initialCategory?: ArticleCategoryEnum;
};

/** The web's articles page: category chips, sort and order in a header menu, an infinite list of previews. */
const ArticleList: FC<Props> = ({ initialCategory }) => {
    const [category, setCategory] = useState(initialCategory);
    const [sort, setSort] = useState(SORT_OPTIONS[0].value);
    const [order, setOrder] = useState<SortOrder>('desc');
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
    } = useInfiniteQuery(articleListOptions({ category, sort, order }));

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
                {category ? ARTICLE_CATEGORY[category].title_ua : 'Статті'}
            </Stack.Title>
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
                                    select(() => setSort(option.value))
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
                                    select(() => setOrder(option.value))
                                }
                            >
                                {option.label}
                            </Stack.Toolbar.MenuAction>
                        ))}
                    </Stack.Toolbar.Menu>
                </Stack.Toolbar.Menu>
            </Stack.Toolbar>
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
                    <CategoryChips category={category} onChange={setCategory} />
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
                            title="Не знайдено результатів за Вашим запитом"
                        />
                    )
                }
                ListFooterComponent={
                    isFetchingNextPage ? (
                        <ActivityIndicator className="py-4" />
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

export default ArticleList;
