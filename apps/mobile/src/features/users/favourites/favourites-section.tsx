import { type FC, useState } from 'react';

import { useQuery } from '@tanstack/react-query';
import { ScrollView, View } from 'react-native';

import { ContentTypeEnum } from '@hikka/api';
import { CONTENT_TYPES, getMediaTypeLabel, getTitle } from '@hikka/core';

import PosterCard from '@/components/content-card/poster-card';
import PosterRow from '@/components/content-card/poster-row';
import { Chip } from '@/components/ui/chip';
import ErrorState from '@/components/ui/error-state';
import { Header, HeaderTitle } from '@/components/ui/header';
import { Skeleton } from '@/components/ui/skeleton';
import { useInfiniteList } from '@/utils/api/use-infinite-list';
import { contentHref } from '@/utils/content-href';

import { serviceUserStatsOptions, userFavouritesOptions } from './queries';

// Collections are left out until the collection screens exist.
const CATEGORIES = [
    ContentTypeEnum.ANIME,
    ContentTypeEnum.MANGA,
    ContentTypeEnum.NOVEL,
    ContentTypeEnum.CHARACTER,
    ContentTypeEnum.PERSON,
] as const;

type Category = (typeof CATEGORIES)[number];

type FavouriteItem = {
    slug: string;
    image: string | null;
    media_type?: string | null;
};

const FavouriteStrip: FC<{ username: string; type: Category }> = ({
    username,
    type,
}) => {
    const query = useInfiniteList<FavouriteItem>(
        userFavouritesOptions(username, type),
    );

    return (
        <PosterRow
            {...query}
            keyExtractor={(item) => item.slug}
            renderItem={(item) => (
                <PosterCard
                    href={contentHref(type, item.slug)}
                    title={getTitle(item)}
                    image={item.image ?? undefined}
                    leftSubtitle={getMediaTypeLabel(item.media_type)}
                />
            )}
        />
    );
};

type Props = {
    username: string;
};

const FavouritesSection: FC<Props> = ({ username }) => {
    const {
        data: stats,
        isPending,
        error,
        refetch,
    } = useQuery(serviceUserStatsOptions({ path: { username } }));
    const [selected, setSelected] = useState<Category | null>(null);

    const counts = stats?.favourites_count;
    const available = CATEGORIES.filter((type) => (counts?.[type] ?? 0) > 0);
    const total = available.reduce(
        (sum, type) => sum + (counts?.[type] ?? 0),
        0,
    );
    const active =
        selected && available.includes(selected) ? selected : available[0];

    if (!isPending && !error && !active) return null;

    return (
        <View className="mt-6 gap-3 px-4">
            <Header>
                <HeaderTitle
                    count={counts ? total : undefined}
                    countPending={isPending}
                >
                    Улюблені
                </HeaderTitle>
            </Header>
            {active ? (
                <>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        className="-mx-4"
                        contentContainerClassName="gap-2 px-4"
                    >
                        {available.map((type) => (
                            <Chip
                                key={type}
                                selected={type === active}
                                onPress={() => setSelected(type)}
                            >
                                {`${CONTENT_TYPES[type].plural} ${counts?.[type] ?? 0}`}
                            </Chip>
                        ))}
                    </ScrollView>
                    <FavouriteStrip
                        key={active}
                        username={username}
                        type={active}
                    />
                </>
            ) : error ? (
                <ErrorState variant="inline" onRetry={() => void refetch()} />
            ) : (
                <View className="flex-row gap-2">
                    <Skeleton className="h-8 w-24" />
                    <Skeleton className="h-8 w-24" />
                </View>
            )}
        </View>
    );
};

export default FavouritesSection;
