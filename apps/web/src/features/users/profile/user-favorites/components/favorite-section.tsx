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

import AnimeCard from '@/components/content-card/anime-card';
import type { CardEntity } from '@/components/content-card/entity';
import EntityCard from '@/components/content-card/entity-card';
import MangaCard from '@/components/content-card/manga-card';
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
import { cn } from '@/utils/cn';
import { useParams } from '@/utils/navigation';
import { getTitle } from '@/utils/title/get-title';

import {
    userFavouritesListOptions,
    userFavouritesPreviewOptions,
} from '../../../queries';
import { favoritePreview } from '../favorite-preview';
import FavoriteMoreCard from './favorite-more-card';
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
        renderItem: (item) => (
            <PosterCard
                key={item.reference}
                title={item.title}
                image={item.collection[0].content.image}
                to={`/collections/${item.reference}`}
                titleClassName={cn(item.spoiler && 'blur hover:blur-none')}
                containerClassName={cn(item.nsfw && 'blur hover:blur-none')}
                leftSubtitle={(item.nsfw && '+18') || undefined}
                rightSubtitle={(item.spoiler && 'Спойлери') || undefined}
            />
        ),
    },
};

type Props = {
    type: FavouriteContentTypeEnum;
    extended?: boolean;
};

const FavoriteSection: FC<Props> = ({ type, extended }) => {
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
        extended
            ? userFavouritesListOptions(username, type)
            : userFavouritesPreviewOptions(username, type),
    );

    const list = rawList as FavoriteItem[] | undefined;

    if (isPending) {
        return <FavoriteSkeleton extended={extended} />;
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
                        <FavoriteMoreCard
                            count={remainingCount}
                            image={
                                remainingItem
                                    ? section.getImage(remainingItem)
                                    : undefined
                            }
                            username={username}
                            type={type}
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
