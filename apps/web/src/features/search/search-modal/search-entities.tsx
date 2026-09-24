import type { ReactNode } from 'react';

import type {
    InfiniteData,
    UseInfiniteQueryOptions,
} from '@tanstack/react-query';

import {
    type AnimeResponse,
    type CharacterResponse,
    type CollectionResponse,
    ContentTypeEnum,
    getCollectionsInfiniteOptions,
    type MangaResponse,
    type NovelResponse,
    type PaginationResponse,
    type PersonResponse,
    searchAnimeInfiniteOptions,
    searchCharactersInfiniteOptions,
    searchMangaInfiniteOptions,
    searchNovelInfiniteOptions,
    searchPeopleInfiniteOptions,
    type UserResponse,
} from '@hikka/api';

import MaterialSymbolsAccountBox from '@/components/icons/material-symbols/MaterialSymbolsAccountBox';
import MaterialSymbolsAnimatedImages from '@/components/icons/material-symbols/MaterialSymbolsAnimatedImages';
import MaterialSymbolsFace3 from '@/components/icons/material-symbols/MaterialSymbolsFace3';
import MaterialSymbolsMenuBookRounded from '@/components/icons/material-symbols/MaterialSymbolsMenuBookRounded';
import MaterialSymbolsPalette from '@/components/icons/material-symbols/MaterialSymbolsPalette';
import MaterialSymbolsPerson from '@/components/icons/material-symbols/MaterialSymbolsPerson';
import MaterialSymbolsStack from '@/components/icons/material-symbols/MaterialSymbolsStack';
import { CONTENT_TYPE_LINKS } from '@/utils/constants/navigation';

import CollectionCard from './components/cards/collection-card';
import SearchCard from './components/cards/search-card';
import UserCard from './components/cards/user-card';
import type {
    ContentSearchEntityType,
    SearchEntityType,
    SearchResult,
    SearchResultVariant,
} from './types';

/** One page of any of Hikka's paginated search endpoints. */
type SearchEntityPage = {
    list: SearchResult[];
    pagination: PaginationResponse;
};

/**
 * Normalised infinite-options factory. Every generated `xxxInfiniteOptions`
 * carries its own `Options<XData>` signature and its own page type, and
 * `UseInfiniteQueryOptions` is invariant in the page type, so each factory is
 * cast onto this shape once — at its registry entry, and nowhere else.
 *
 * A page's `list` is the `SearchResult` union rather than one entity's own
 * response, so a list component cannot read `.slug` off a `CollectionResponse`
 * (which keys on `reference`) — results only reach the DOM through `getHref`
 * and `renderCard`.
 */
export type SearchEntityOptionsFn = (options: {
    body: { query?: string };
    query?: { page?: number; size?: number };
}) => UseInfiniteQueryOptions<
    SearchEntityPage,
    // biome-ignore lint/suspicious/noExplicitAny: error type is per-operation
    any,
    InfiniteData<SearchEntityPage>,
    // biome-ignore lint/suspicious/noExplicitAny: query-key type is per-operation
    any,
    // biome-ignore lint/suspicious/noExplicitAny: page-param is `number | object`
    any
>;

export type SearchEntityGroup = 'content' | 'community';

type SearchEntityOf<TItem> = {
    type: SearchEntityType;
    /** Singular — the type toggle. */
    label: string;
    /** Plural — the group heading in the `Усе` tab. */
    heading: string;
    icon: ReactNode;
    group: SearchEntityGroup;
    /**
     * Where this type lives, from the project-wide `CONTENT_TYPE_LINKS`: the
     * prefix of every row's href, and the pathname that preselects the type.
     * It is a catalog only when `hasCatalog` says so — `/u` is a profile and
     * `/characters` has no listing page at all.
     */
    routePrefix: string;
    /** Whether "Показати всі результати" may navigate off to the catalog. */
    hasCatalog: boolean;
    /** Absent for users: `/user/list` is unpaginated, so it has no infinite options. */
    options?: SearchEntityOptionsFn;
    /**
     * The row's target — doubles as its cmdk value and React key. `null` when
     * the item has no key to link to (a user without a username), which the
     * lists take as "skip this row".
     */
    getHref: (item: TItem) => string | null;
    renderCard: (
        item: TItem,
        href: string,
        type?: SearchResultVariant,
    ) => ReactNode;
};

// biome-ignore lint/suspicious/noExplicitAny: the registry is heterogeneous by design
export type SearchEntity = SearchEntityOf<any>;

/**
 * What an entry declares. Routes are not among it: `routePrefix` and the prefix
 * of `getHref` both come from `CONTENT_TYPE_LINKS`, so renaming a route there
 * moves the search modal with it. An entry only says how to read the item's
 * own URL tail.
 */
type SearchEntityInput<TItem> = Omit<
    SearchEntityOf<TItem>,
    'routePrefix' | 'getHref'
> & {
    /** Slug for most entities, `reference` for collections, `username` for users. */
    getKey: (item: TItem) => string | null | undefined;
};

/**
 * Keeps `getKey` / `renderCard` checked against the entry's own response type
 * while the exported array stays homogeneous — no cast needed, because `any` is
 * bivariant.
 */
const defineSearchEntity = <TItem,>({
    getKey,
    ...entity
}: SearchEntityInput<TItem>): SearchEntity => {
    const routePrefix = CONTENT_TYPE_LINKS[entity.type];

    return {
        ...entity,
        routePrefix,
        getHref: (item) => {
            const key = getKey(item);
            return key ? `${routePrefix}/${key}` : null;
        },
    };
};

/**
 * The single source of truth for the modal's searchable types. Array order is
 * the order of the type toggle *and* of the groups in the `Усе` tab.
 */
export const SEARCH_ENTITIES: SearchEntity[] = [
    defineSearchEntity<AnimeResponse>({
        type: ContentTypeEnum.ANIME,
        label: 'Аніме',
        heading: 'Аніме',
        icon: <MaterialSymbolsAnimatedImages className="size-4!" />,
        group: 'content',
        hasCatalog: true,
        options: searchAnimeInfiniteOptions as unknown as SearchEntityOptionsFn,
        getKey: (item) => item.slug,
        renderCard: (item, href, type) => (
            <SearchCard
                content={item}
                contentType="anime"
                href={href}
                type={type}
            />
        ),
    }),
    defineSearchEntity<MangaResponse>({
        type: ContentTypeEnum.MANGA,
        label: 'Манґа',
        heading: 'Манґа',
        icon: <MaterialSymbolsPalette className="size-4!" />,
        group: 'content',
        hasCatalog: true,
        options: searchMangaInfiniteOptions as unknown as SearchEntityOptionsFn,
        getKey: (item) => item.slug,
        renderCard: (item, href, type) => (
            <SearchCard
                content={item}
                contentType="manga"
                href={href}
                type={type}
            />
        ),
    }),
    defineSearchEntity<NovelResponse>({
        type: ContentTypeEnum.NOVEL,
        label: 'Ранобе',
        heading: 'Ранобе',
        icon: <MaterialSymbolsMenuBookRounded className="size-4!" />,
        group: 'content',
        hasCatalog: true,
        options: searchNovelInfiniteOptions as unknown as SearchEntityOptionsFn,
        getKey: (item) => item.slug,
        renderCard: (item, href, type) => (
            <SearchCard
                content={item}
                contentType="novel"
                href={href}
                type={type}
            />
        ),
    }),
    // Characters, collections and people have no catalog that takes a `?search=`
    // query, so their "show everything" footer switches the search type instead.
    defineSearchEntity<CharacterResponse>({
        type: ContentTypeEnum.CHARACTER,
        label: 'Персонаж',
        heading: 'Персонажі',
        icon: <MaterialSymbolsFace3 className="size-4!" />,
        group: 'content',
        hasCatalog: false,
        options:
            searchCharactersInfiniteOptions as unknown as SearchEntityOptionsFn,
        getKey: (item) => item.slug,
        renderCard: (item, href, type) => (
            <SearchCard
                content={item}
                contentType="character"
                href={href}
                type={type}
            />
        ),
    }),
    defineSearchEntity<CollectionResponse>({
        type: ContentTypeEnum.COLLECTION,
        label: 'Колекція',
        heading: 'Колекції',
        icon: <MaterialSymbolsStack className="size-4!" />,
        group: 'content',
        hasCatalog: false,
        options:
            getCollectionsInfiniteOptions as unknown as SearchEntityOptionsFn,
        // A collection has no slug — its route keys on the reference.
        getKey: (item) => item.reference,
        renderCard: (item, href, type) => (
            <CollectionCard collection={item} href={href} type={type} />
        ),
    }),
    defineSearchEntity<PersonResponse>({
        type: ContentTypeEnum.PERSON,
        label: 'Людина',
        heading: 'Люди',
        icon: <MaterialSymbolsPerson className="size-4!" />,
        group: 'content',
        hasCatalog: false,
        options:
            searchPeopleInfiniteOptions as unknown as SearchEntityOptionsFn,
        getKey: (item) => item.slug,
        renderCard: (item, href, type) => (
            <SearchCard
                content={item}
                contentType="person"
                href={href}
                type={type}
            />
        ),
    }),
    defineSearchEntity<UserResponse>({
        type: ContentTypeEnum.USER,
        label: 'Користувач',
        heading: 'Користувачі',
        icon: <MaterialSymbolsAccountBox className="size-4!" />,
        group: 'community',
        hasCatalog: false,
        // No options: `/user/list` answers with a bare array, so hey-api
        // generates no infinite options and `UserSearchList` stays its own list.
        getKey: (item) => item.username,
        renderCard: (item, href, type) => (
            <UserCard user={item} href={href} type={type} />
        ),
    }),
];

export const SEARCH_ENTITY_BY_TYPE = Object.fromEntries(
    SEARCH_ENTITIES.map((entity) => [entity.type, entity]),
    // `Object.fromEntries` always widens the key back to `string`.
) as Record<SearchEntityType, SearchEntity>;

/** A registry entry the `Усе` tab can search — i.e. anything but the user list. */
export type ContentSearchEntity = SearchEntity & {
    type: ContentSearchEntityType;
};

/** The entities the `Усе` tab searches — users are a separate, unpaginated list. */
export const CONTENT_SEARCH_ENTITIES = SEARCH_ENTITIES.filter(
    (entity): entity is ContentSearchEntity =>
        entity.type !== ContentTypeEnum.USER,
);
