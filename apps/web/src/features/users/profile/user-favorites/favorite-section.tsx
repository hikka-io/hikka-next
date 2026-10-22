import type { ComponentType, FC, ReactNode, SVGProps } from 'react';

import {
    ContentTypeEnum,
    type FavouriteAnimeResponse,
    type FavouriteCharacterResponse,
    type FavouriteCollectionResponse,
    type FavouriteContentTypeEnum,
    type FavouriteMangaResponse,
    type FavouriteNovelResponse,
    type FavouritePersonResponse,
} from '@hikka/api';
import { getTitle } from '@hikka/core';

import AnimeCard from '@/components/content-card/anime-card';
import type { CardEntity } from '@/components/content-card/entity';
import EntityCard from '@/components/content-card/entity-card';
import MangaCard from '@/components/content-card/manga-card';
import MorePosterCard from '@/components/content-card/more-poster-card';
import NovelCard from '@/components/content-card/novel-card';
import PosterCard from '@/components/content-card/poster-card';
import MaterialSymbolsGridViewRounded from '@/components/icons/material-symbols/MaterialSymbolsGridViewRounded';
import MaterialSymbolsLiveTvRounded from '@/components/icons/material-symbols/MaterialSymbolsLiveTvRounded';
import MaterialSymbolsMenuBookRounded from '@/components/icons/material-symbols/MaterialSymbolsMenuBookRounded';
import MaterialSymbolsPerson from '@/components/icons/material-symbols/MaterialSymbolsPerson';
import MaterialSymbolsPerson2OutlineRounded from '@/components/icons/material-symbols/MaterialSymbolsPerson2OutlineRounded';
import LoadMoreButton from '@/components/load-more-button';
import EmptyState from '@/components/ui/empty-state';
import Stack from '@/components/ui/stack';
import { useSessionUI } from '@/services/session';
import { useInfiniteList } from '@/utils/api/use-infinite-list';
import { useParams } from '@/utils/navigation';

import { userFavouritesOptions } from '../../queries';
import { favoritePreview } from './favorite-preview';
import FavoriteSkeleton from './favorite-skeleton';

type FavoriteItems = {
    [ContentTypeEnum.ANIME]: FavouriteAnimeResponse;
    [ContentTypeEnum.MANGA]: FavouriteMangaResponse;
    [ContentTypeEnum.NOVEL]: FavouriteNovelResponse;
    [ContentTypeEnum.CHARACTER]: FavouriteCharacterResponse;
    [ContentTypeEnum.PERSON]: FavouritePersonResponse;
    [ContentTypeEnum.COLLECTION]: FavouriteCollectionResponse;
};

type FavoriteItem = FavoriteItems[FavouriteContentTypeEnum];

type SectionConfig<T> = {
    icon: ComponentType<SVGProps<SVGSVGElement>>;
    labels: { nominative: string; accusative: string };
    getImage(item: T): string | null | undefined;
    /** Spoiler and +18 items keep the preview card fully blurred. */
    isSensitive?(item: T): boolean;
    renderItem(item: T): ReactNode;
};

type EntityItemProps = {
    entity: Extract<
        CardEntity,
        {
            type:
                | typeof ContentTypeEnum.CHARACTER
                | typeof ContentTypeEnum.PERSON;
        }
    >;
};

const FavoriteEntityCard: FC<EntityItemProps> = ({ entity }) => {
    const { preferences } = useSessionUI();

    return (
        <EntityCard
            entity={entity}
            title={getTitle(
                entity.data,
                preferences.title_language,
                preferences.name_language,
            )}
        />
    );
};

const SECTIONS: {
    [K in FavouriteContentTypeEnum]: SectionConfig<FavoriteItems[K]>;
} = {
    [ContentTypeEnum.ANIME]: {
        icon: MaterialSymbolsLiveTvRounded,
        labels: { nominative: 'Аніме', accusative: 'аніме' },
        getImage: (item) => item.image,
        renderItem: (item) => <AnimeCard key={item.slug} item={item} />,
    },
    [ContentTypeEnum.MANGA]: {
        icon: MaterialSymbolsMenuBookRounded,
        labels: { nominative: 'Манґа', accusative: 'манґу' },
        getImage: (item) => item.image,
        renderItem: (item) => <MangaCard key={item.slug} item={item} />,
    },
    [ContentTypeEnum.NOVEL]: {
        icon: MaterialSymbolsMenuBookRounded,
        labels: { nominative: 'Ранобе', accusative: 'ранобе' },
        getImage: (item) => item.image,
        renderItem: (item) => <NovelCard key={item.slug} item={item} />,
    },
    [ContentTypeEnum.CHARACTER]: {
        icon: MaterialSymbolsPerson2OutlineRounded,
        labels: { nominative: 'Персонажі', accusative: 'персонажів' },
        getImage: (item) => item.image,
        renderItem: (item) => (
            <FavoriteEntityCard
                key={item.slug}
                entity={{ type: ContentTypeEnum.CHARACTER, data: item }}
            />
        ),
    },
    [ContentTypeEnum.PERSON]: {
        icon: MaterialSymbolsPerson,
        labels: { nominative: 'Люди', accusative: 'людей' },
        getImage: (item) => item.image,
        renderItem: (item) => (
            <FavoriteEntityCard
                key={item.slug}
                entity={{ type: ContentTypeEnum.PERSON, data: item }}
            />
        ),
    },
    [ContentTypeEnum.COLLECTION]: {
        icon: MaterialSymbolsGridViewRounded,
        labels: { nominative: 'Колекції', accusative: 'колекції' },
        getImage: (item) => item.collection[0].content.image,
        isSensitive: (item) => item.nsfw || item.spoiler,
        renderItem: (item) => (
            <PosterCard
                key={item.reference}
                title={item.title}
                image={item.collection[0].content.image}
                to={`/collections/${item.reference}`}
                titleBlur={item.spoiler}
                imageBlur={item.nsfw || item.spoiler}
                leftSubtitle={(item.nsfw && '+18') || undefined}
                rightSubtitle={(item.spoiler && 'Спойлери') || undefined}
            />
        ),
    },
};

type Props = {
    type: FavouriteContentTypeEnum;
    extended?: boolean;
    total?: number;
};

const FavoriteSection: FC<Props> = ({ type, extended, total }) => {
    const params = useParams();
    const username = String(params.username);
    const section = SECTIONS[type] as SectionConfig<FavoriteItem>;
    const {
        list: rawList,
        pagination,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isPending,
        ref,
    } = useInfiniteList(
        userFavouritesOptions(username, type, { preview: !extended }),
    );

    const list = rawList as FavoriteItem[] | undefined;

    if (isPending) {
        return (
            <FavoriteSkeleton
                extended={extended}
                total={total}
                subtitles={
                    type !== ContentTypeEnum.CHARACTER &&
                    type !== ContentTypeEnum.PERSON
                }
            />
        );
    }

    if (!list && !extended) {
        return null;
    }

    const {
        items: filteredData,
        remainingCount,
        remainingItem,
    } = favoritePreview(list, pagination?.total ?? 0, extended);
    const Icon = section.icon;

    return (
        <>
            {filteredData.length > 0 && (
                <Stack
                    extended={extended}
                    size={6}
                    extendedSize={7}
                    className="grid-min-10"
                    imagePreset="cardSm"
                >
                    {filteredData.map((res) => section.renderItem(res))}
                    {remainingCount > 0 && (
                        <MorePosterCard
                            to={`/u/${username}/favorites`}
                            linkProps={{ search: { type } }}
                            image={
                                remainingItem
                                    ? section.getImage(remainingItem)
                                    : undefined
                            }
                            blurred={
                                remainingItem
                                    ? section.isSensitive?.(remainingItem)
                                    : undefined
                            }
                            total={pagination?.total ?? 0}
                            contentType={type}
                        />
                    )}
                </Stack>
            )}
            {filteredData.length === 0 && (
                <EmptyState
                    bordered
                    icon={<Icon />}
                    title={
                        <span>
                            У списку{' '}
                            <span className="font-black">
                                {section.labels.nominative}
                            </span>{' '}
                            пусто
                        </span>
                    }
                    description={`Цей список оновиться після того, як сюди буде додано ${section.labels.accusative}`}
                />
            )}
            {extended && hasNextPage && (
                <LoadMoreButton
                    isFetchingNextPage={isFetchingNextPage}
                    fetchNextPage={fetchNextPage}
                    ref={ref}
                />
            )}
        </>
    );
};

export default FavoriteSection;
