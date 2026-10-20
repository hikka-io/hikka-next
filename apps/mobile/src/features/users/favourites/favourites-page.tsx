import { type FC, type ReactElement, useState } from 'react';

import { FlashList } from '@shopify/flash-list';
import { Stack, useIsFocused } from 'expo-router';
import { Heart } from 'lucide-react-native';
import { ScrollView, View } from 'react-native';

import { ContentTypeEnum, type FavouriteContentTypeEnum } from '@hikka/api';

import PosterCardSkeleton from '@/components/content-card/poster-card-skeleton';
import EmptyState from '@/components/ui/empty-state';
import ErrorState from '@/components/ui/error-state';
import { Icon } from '@/components/ui/icon';
import { Skeleton } from '@/components/ui/skeleton';
import { Spinner } from '@/components/ui/spinner';
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
                isFetchingNextPage ? <Spinner className="py-4" /> : null
            }
            onEndReached={onEndReached}
            onEndReachedThreshold={0.5}
            refreshing={refreshing}
            onRefresh={onRefresh}
        />
    );
};

// The grid's shell while the category counts load: chip row and one page of cells.
const FavouritesSkeleton: FC<{ subtitles: boolean }> = ({ subtitles }) => (
    <ScrollView
        className="flex-1 bg-background"
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={GRID_CONTAINER}
        scrollEnabled={false}
    >
        <View className="flex-row gap-2 px-1.5 pt-2 pb-4">
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-8 w-24" />
        </View>
        <View className="flex-row flex-wrap">
            {SKELETON_ITEMS.map((_, index) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: static placeholders
                <View key={index} className="w-1/3 px-1.5 pb-4">
                    <PosterCardSkeleton
                        subtitles={subtitles}
                        titleLines={subtitles ? 1 : 2}
                    />
                </View>
            ))}
        </View>
    </ScrollView>
);

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
                <FavouritesSkeleton
                    subtitles={favouriteHasSubtitles(
                        initialType ?? ContentTypeEnum.ANIME,
                    )}
                />
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
