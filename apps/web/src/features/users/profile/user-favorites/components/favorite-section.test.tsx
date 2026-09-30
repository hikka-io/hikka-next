import { isValidElement, type ReactNode } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

import {
    ContentTypeEnum,
    configureBrowserClient,
    createRequestClient,
    type FavouriteAnimeResponse,
    type FavouriteCharacterResponse,
    type FavouriteCollectionResponse,
    type FavouriteContentTypeEnum,
    type FavouriteMangaResponse,
    type FavouriteNovelResponse,
    type FavouritePersonResponse,
    favouriteListInfiniteOptions,
} from '@hikka/api';

import AnimeCard from '@/components/content-card/anime-card';
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
import FavoriteSection from './favorite-section';
import FavoriteSkeleton from './favorite-skeleton';

const mocks = vi.hoisted(() => ({
    state: {
        list: undefined as unknown[] | undefined,
        total: 0,
        hasNextPage: false,
        isPending: false,
    },
    stub: (name: string) =>
        function Stub(props: Record<string, unknown>) {
            return (
                <div data-stub={name}>
                    {Object.entries(props).map(([key, value]) => (
                        <div key={key} data-prop={key}>
                            {isValidElement(value)
                                ? value
                                : JSON.stringify(value)}
                        </div>
                    ))}
                </div>
            );
        },
}));

vi.mock('@/utils/api/use-infinite-list', () => ({
    useInfiniteList: vi.fn(() => ({
        list: mocks.state.list,
        pagination: { total: mocks.state.total },
        fetchNextPage: () => {},
        hasNextPage: mocks.state.hasNextPage,
        isFetchingNextPage: false,
        isPending: mocks.state.isPending,
        ref: () => {},
    })),
}));
vi.mock('@/utils/navigation', async (importOriginal) => ({
    ...(await importOriginal<object>()),
    useParams: () => ({ username: 'emp_ua' }),
}));
vi.mock('@/services/session/use-session-ui', () => ({
    useSessionUI: () => ({
        preferences: { title_language: 'title_en', name_language: 'name_en' },
    }),
}));
vi.mock('@/components/content-card/anime-card', () => ({
    default: mocks.stub('anime'),
}));
vi.mock('@/components/content-card/manga-card', () => ({
    default: mocks.stub('manga'),
}));
vi.mock('@/components/content-card/novel-card', () => ({
    default: mocks.stub('novel'),
}));
vi.mock('@/components/content-card/entity-card', () => ({
    default: mocks.stub('entity'),
}));
vi.mock('@/components/content-card/poster-card', () => ({
    default: mocks.stub('poster'),
}));

type Item =
    | FavouriteAnimeResponse
    | FavouriteMangaResponse
    | FavouriteNovelResponse
    | FavouriteCharacterResponse
    | FavouritePersonResponse
    | FavouriteCollectionResponse;

type Params = Record<string, string>;

type Legacy<T> = {
    options(params: Params): ReturnType<typeof favouriteListInfiniteOptions>;
    extra?(params: Params): { enabled: boolean };
    card(
        res: T,
        preferences: ReturnType<typeof useSessionUI>['preferences'],
    ): ReactNode;
    moreImage(remainingItem: T | undefined): string | null | undefined;
    icon: ReactNode;
    title: ReactNode;
    description: string;
};

const legacyOptions =
    (content_type: FavouriteContentTypeEnum) => (params: Params) =>
        favouriteListInfiniteOptions({
            path: {
                content_type,
                username: String(params.username),
            },
        });

const LEGACY: {
    anime: Legacy<FavouriteAnimeResponse>;
    manga: Legacy<FavouriteMangaResponse>;
    novel: Legacy<FavouriteNovelResponse>;
    character: Legacy<FavouriteCharacterResponse>;
    person: Legacy<FavouritePersonResponse>;
    collection: Legacy<FavouriteCollectionResponse>;
} = {
    anime: {
        options: legacyOptions(ContentTypeEnum.ANIME),
        card: (res) => <AnimeCard key={res.slug} item={res} />,
        moreImage: (remainingItem) => remainingItem?.image,
        icon: <MaterialSymbolsLiveTvRounded />,
        title: (
            <span>
                У списку <span className="font-black">Аніме</span> пусто
            </span>
        ),
        description:
            'Цей список оновиться після того, як сюди буде додано аніме',
    },
    manga: {
        options: legacyOptions(ContentTypeEnum.MANGA),
        extra: (params) => ({ enabled: !!params.username }),
        card: (res) => <MangaCard key={res.slug} item={res} />,
        moreImage: (remainingItem) => remainingItem?.image,
        icon: <MaterialSymbolsMenuBookRounded />,
        title: (
            <span>
                У списку <span className="font-black">Манґа</span> пусто
            </span>
        ),
        description:
            'Цей список оновиться після того, як сюди буде додано манґу',
    },
    novel: {
        options: legacyOptions(ContentTypeEnum.NOVEL),
        card: (res) => <NovelCard key={res.slug} item={res} />,
        moreImage: (remainingItem) => remainingItem?.image,
        icon: <MaterialSymbolsMenuBookRounded />,
        title: (
            <span>
                У списку <span className="font-black">Ранобе</span> пусто
            </span>
        ),
        description:
            'Цей список оновиться після того, як сюди буде додано ранобе',
    },
    character: {
        options: legacyOptions(ContentTypeEnum.CHARACTER),
        card: (res, preferences) => (
            <EntityCard
                key={res.slug}
                entity={{ type: ContentTypeEnum.CHARACTER, data: res }}
                title={getTitle(
                    res,
                    preferences.title_language,
                    preferences.name_language,
                )}
            />
        ),
        moreImage: (remainingItem) => remainingItem?.image,
        icon: <MaterialSymbolsPerson2OutlineRounded />,
        title: (
            <span>
                У списку <span className="font-black">Персонажі</span> пусто
            </span>
        ),
        description:
            'Цей список оновиться після того, як сюди буде додано персонажів',
    },
    person: {
        options: legacyOptions(ContentTypeEnum.PERSON),
        card: (res, preferences) => (
            <EntityCard
                key={res.slug}
                entity={{ type: ContentTypeEnum.PERSON, data: res }}
                title={getTitle(
                    res,
                    preferences.title_language,
                    preferences.name_language,
                )}
            />
        ),
        moreImage: (remainingItem) => remainingItem?.image,
        icon: <MaterialSymbolsPerson />,
        title: (
            <span>
                У списку <span className="font-black">Люди</span> пусто
            </span>
        ),
        description:
            'Цей список оновиться після того, як сюди буде додано людей',
    },
    collection: {
        options: legacyOptions(ContentTypeEnum.COLLECTION),
        card: (res) => (
            <PosterCard
                key={res.reference}
                title={res.title}
                image={res.collection[0].content.image}
                to={`/collections/${res.reference}`}
                titleClassName={cn(res.spoiler && 'blur hover:blur-none')}
                containerClassName={cn(res.nsfw && 'blur hover:blur-none')}
                leftSubtitle={(res.nsfw && '+18') || undefined}
                rightSubtitle={(res.spoiler && 'Спойлери') || undefined}
            />
        ),
        moreImage: (remainingItem) =>
            remainingItem?.collection[0].content.image,
        icon: <MaterialSymbolsGridViewRounded />,
        title: (
            <span>
                У списку <span className="font-black">Колекції</span> пусто
            </span>
        ),
        description:
            'Цей список оновиться після того, як сюди буде додано колекції',
    },
};

type SectionProps = { type: FavouriteContentTypeEnum; extended?: boolean };

const LegacySection = ({ type, extended }: SectionProps) => {
    const legacy = LEGACY[type] as Legacy<Item>;
    const params = useParams();
    const { preferences } = useSessionUI();
    const {
        list: rawList,
        pagination,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isPending,
        ref,
    } = useInfiniteList(legacy.options(params), legacy.extra?.(params));

    const list = rawList as Item[] | undefined;

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
                    {filteredData.map((res) => legacy.card(res, preferences))}
                    {remainingCount > 0 && (
                        <FavoriteMoreCard
                            count={remainingCount}
                            image={legacy.moreImage(remainingItem)}
                            username={String(params.username)}
                            type={type}
                        />
                    )}
                </Stack>
            )}
            {filteredData.length === 0 && (
                <EmptyState
                    bordered
                    icon={legacy.icon}
                    title={legacy.title}
                    description={legacy.description}
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

const TYPES = Object.keys(LEGACY) as FavouriteContentTypeEnum[];
const BASE_URL = 'https://api.example.test';

const items = (type: FavouriteContentTypeEnum, count: number) =>
    Array.from({ length: count }, (_, i) => {
        if (type === ContentTypeEnum.COLLECTION) {
            return {
                reference: `ref-${i}`,
                title: `Collection ${i}`,
                spoiler: i % 2 === 0,
                nsfw: i % 3 === 0,
                collection: [{ content: { image: `/c${i}.jpg` } }],
            };
        }

        const names =
            type === ContentTypeEnum.CHARACTER ||
            type === ContentTypeEnum.PERSON
                ? { name_ua: `Ім'я ${i}`, name_en: `Name ${i}` }
                : { title_ua: `Назва ${i}`, title_en: `Title ${i}` };

        return { slug: `${type}-${i}`, image: `/i${i}.jpg`, ...names };
    });

const CASES = {
    pending: () => ({ list: undefined, total: 0, isPending: true }),
    missing: () => ({ list: undefined, total: 0 }),
    empty: () => ({ list: [], total: 0 }),
    short: (type: FavouriteContentTypeEnum) => ({
        list: items(type, 3),
        total: 3,
    }),
    overflow: (type: FavouriteContentTypeEnum) => ({
        list: items(type, 7),
        total: 11,
        hasNextPage: true,
    }),
};

const html = (node: ReactNode) => renderToStaticMarkup(node);

beforeAll(() => {
    configureBrowserClient({ baseUrl: BASE_URL });
});

beforeEach(() => {
    vi.mocked(useInfiniteList).mockClear();
    Object.assign(mocks.state, { hasNextPage: false, isPending: false });
});

describe.each(TYPES)('FavoriteSection(%s)', (type) => {
    it.each(Object.entries(CASES))(
        'renders the legacy markup for a %s list',
        (_, state) => {
            Object.assign(mocks.state, state(type));

            for (const extended of [false, true]) {
                expect(
                    html(<FavoriteSection type={type} extended={extended} />),
                ).toBe(html(<LegacySection type={type} extended={extended} />));
            }
        },
    );

    it('sizes the collapsed preview and drops the redundant enabled guard', () => {
        html(<FavoriteSection type={type} />);
        html(<LegacySection type={type} />);

        const [[options, extra], [legacyOptions, legacyExtra]] =
            vi.mocked(useInfiniteList).mock.calls;

        expect(options.queryKey).toEqual([
            { ...legacyOptions.queryKey[0], query: { size: 6 } },
        ]);
        expect(Object.keys(options)).toEqual([
            ...Object.keys(legacyOptions),
            'initialPageParam',
            'getNextPageParam',
        ]);
        expect(extra).toBeUndefined();
        expect(legacyExtra).toEqual(
            type === ContentTypeEnum.MANGA ? { enabled: true } : undefined,
        );
    });

    it('keeps the legacy key on the extended page', () => {
        html(<FavoriteSection type={type} extended />);
        html(<LegacySection type={type} extended />);

        const [[options, extra], [legacyOptions]] =
            vi.mocked(useInfiniteList).mock.calls;

        expect(options.queryKey).toEqual(legacyOptions.queryKey);
        expect(Object.keys(options)).toEqual([
            ...Object.keys(legacyOptions),
            'initialPageParam',
            'getNextPageParam',
        ]);
        expect(extra).toBeUndefined();
    });

    it('shares the keys with the loader prefetches', () => {
        const client = createRequestClient({
            baseUrl: BASE_URL,
            internalBaseUrl: 'http://backend:8000',
            authToken: 'token',
        });

        expect(userFavouritesListOptions('emp_ua', type).queryKey).toEqual([
            {
                _id: 'favouriteList',
                _infinite: true,
                baseUrl: BASE_URL,
                path: { content_type: type, username: 'emp_ua' },
            },
        ]);
        expect(userFavouritesListOptions('emp_ua', type).queryKey).toEqual(
            userFavouritesListOptions('emp_ua', type, client).queryKey,
        );
        expect(userFavouritesPreviewOptions('emp_ua', type).queryKey).toEqual(
            userFavouritesPreviewOptions('emp_ua', type, client).queryKey,
        );
    });
});
