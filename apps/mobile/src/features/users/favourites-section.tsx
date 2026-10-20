import { type FC, useState } from 'react';

import { useQuery } from '@tanstack/react-query';
import { ScrollView, View } from 'react-native';

import { ContentTypeEnum } from '@hikka/api';
import { CONTENT_TYPES, getMediaTypeLabel, getTitle } from '@hikka/core';

import PosterCard from '@/components/content-card/poster-card';
import PosterRow from '@/components/poster-row';
import { Chip } from '@/components/ui/chip';
import { Header, HeaderTitle } from '@/components/ui/header';
import { Skeleton } from '@/components/ui/skeleton';

import { serviceUserStatsOptions, useFavouritesList } from './queries';

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

const ROUTE = {
    anime: '/anime',
    manga: '/manga',
    novel: '/novel',
    character: '/characters',
    person: '/people',
} as const satisfies Record<Category, string>;

const FavouriteStrip: FC<{ username: string; type: Category }> = ({
    username,
    type,
}) => {
    const query = useFavouritesList<FavouriteItem>(username, type);

    return (
        <PosterRow
            {...query}
            keyExtractor={(item) => item.slug}
            renderItem={(item) => (
                <PosterCard
                    href={`${ROUTE[type]}/${item.slug}`}
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
    const { data: stats, isPending } = useQuery(
        serviceUserStatsOptions({ path: { username } }),
    );
    const [selected, setSelected] = useState<Category | null>(null);

    const counts = stats?.favourites_count;
    const available = CATEGORIES.filter((type) => (counts?.[type] ?? 0) > 0);
    const total = available.reduce(
        (sum, type) => sum + (counts?.[type] ?? 0),
        0,
    );
    const active =
        selected && available.includes(selected) ? selected : available[0];

    if (!isPending && !active) return null;

    return (
        <View className="mt-6 gap-3">
            <Header className="px-4">
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
            ) : (
                <View className="flex-row gap-2 px-4">
                    <Skeleton className="h-8 w-24" />
                    <Skeleton className="h-8 w-24" />
                </View>
            )}
        </View>
    );
};

export default FavouritesSection;
