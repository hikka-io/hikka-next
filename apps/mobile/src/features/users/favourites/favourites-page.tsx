import { type FC, type ReactElement, useState } from 'react';

import { FlashList } from '@shopify/flash-list';
import { Stack, useIsFocused } from 'expo-router';
import { Heart } from 'lucide-react-native';
import { ActivityIndicator, View } from 'react-native';

import type { FavouriteContentTypeEnum } from '@hikka/api';

import PosterCardSkeleton from '@/components/content-card/poster-card-skeleton';
import EmptyState from '@/components/ui/empty-state';
import ErrorState from '@/components/ui/error-state';
import { Icon } from '@/components/ui/icon';
import { Skeleton } from '@/components/ui/skeleton';
import { useInfiniteList } from '@/utils/api/use-infinite-list';
import { byUsername, usePullToRefresh } from '@/utils/api/use-pull-to-refresh';

import { FAVOURITES_PAGE_SIZE, userFavouritesOptions } from '../queries';
import FavouriteCard, {
    type FavouriteItem,
    favouriteKey,
} from './favourite-card';
import FavouriteChips from './favourite-chips';
import { favouriteEmptyCopy, favouriteHasSubtitles } from './favourite-empty';
import { useFavouriteCategories } from './use-favourite-categories';

const GRID_COLUMNS = 3;
/** With the cells' `px-1.5`, the grid keeps the screen's 16 pt gutter. */
const GRID_CONTAINER = { paddingHorizontal: 10, paddingBottom: 16 };
const SKELETON_ITEMS: null[] = Array.from(
    { length: FAVOURITES_PAGE_SIZE },
    () => null,
);

type GridProps = {
    username: string;
    type: FavouriteContentTypeEnum;
    header: ReactElement;
};

const FavouriteGrid: FC<GridProps> = ({ username, type, header }) => {
    const { items, error, isFetchingNextPage, onEndReached, onRetry } =
        useInfiniteList<FavouriteItem>({
            ...userFavouritesOptions(username, type),
            subscribed: useIsFocused(),
        });
    const { refreshing, onRefresh } = usePullToRefresh(byUsername([username]));
    const data: (FavouriteItem | null)[] =
        items ?? (error ? [] : SKELETON_ITEMS);
    const copy = favouriteEmptyCopy(type);

    return (
        <FlashList
            className="bg-background"
            contentInsetAdjustmentBehavior="automatic"
            contentContainerStyle={GRID_CONTAINER}
            data={data}
            numColumns={GRID_COLUMNS}
            keyExtractor={(item, index) =>
                item ? favouriteKey(item) : `skeleton-${index}`
            }
            renderItem={({ item }) => (
                <View className="px-1.5 pb-4">
                    {item ? (
                        <FavouriteCard type={type} item={item} />
                    ) : (
                        <PosterCardSkeleton
                            subtitles={favouriteHasSubtitles(type)}
                            titleLines={favouriteHasSubtitles(type) ? 1 : 2}
                        />
                    )}
                </View>
            )}
            ListHeaderComponent={header}
            ListEmptyComponent={
                error ? (
                    <ErrorState
                        error={error}
                        onRetry={onRetry}
                        className="mt-8"
                    />
                ) : (
                    <EmptyState
                        className="mx-1.5 mt-2"
                        bordered
                        icon={<Icon as={Heart} />}
                        title={copy.title}
                        description={copy.description}
                    />
                )
            }
            ListFooterComponent={
                isFetchingNextPage ? (
                    <ActivityIndicator className="py-4" />
                ) : null
            }
            onEndReached={onEndReached}
            onEndReachedThreshold={0.5}
            refreshing={refreshing}
            onRefresh={onRefresh}
        />
    );
};

type Props = {
    username: string;
    initialType?: FavouriteContentTypeEnum;
};

/** The web's `/u/<name>/favorites`: category chips over an infinite grid. */
const FavouritesPage: FC<Props> = ({ username, initialType }) => {
    const { categories, count, isPending, error, refetch } =
        useFavouriteCategories(username);
    const [selected, setSelected] = useState(initialType);
    const active =
        selected && categories.includes(selected) ? selected : categories[0];

    return (
        <>
            <Stack.Title>Улюблені</Stack.Title>
            {active ? (
                <FavouriteGrid
                    key={active}
                    username={username}
                    type={active}
                    header={
                        <View className="px-1.5 pt-2 pb-4">
                            <FavouriteChips
                                categories={categories}
                                count={count}
                                value={active}
                                onValueChange={setSelected}
                            />
                        </View>
                    }
                />
            ) : error ? (
                <ErrorState error={error} onRetry={() => void refetch()} />
            ) : isPending ? (
                <View className="flex-1 bg-background px-4 pt-4">
                    <View className="flex-row gap-2">
                        <Skeleton className="h-8 w-24" />
                        <Skeleton className="h-8 w-24" />
                    </View>
                </View>
            ) : (
                <EmptyState
                    className="flex-1 bg-background"
                    icon={<Icon as={Heart} />}
                    title="У списку пусто"
                    description="Цей список оновиться після того, як сюди буде щось додано"
                />
            )}
        </>
    );
};

export default FavouritesPage;
