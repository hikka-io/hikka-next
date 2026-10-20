import { ContentTypeEnum } from '@hikka/api';
import {
    AGE_RATING,
    type AnimeSearch,
    type FilterProperty,
    type MangaSearch,
    MEDIA_TYPE,
    type NovelSearch,
    RELEASE_STATUS,
    SEASON,
} from '@hikka/core';

export const CATALOG_TYPES = [
    ContentTypeEnum.ANIME,
    ContentTypeEnum.MANGA,
    ContentTypeEnum.NOVEL,
] as const;

export type CatalogType = (typeof CATALOG_TYPES)[number];

/** The web's catalog URL params, kept as state instead of a URL. */
export type CatalogSearch = AnimeSearch & MangaSearch & NovelSearch;

export type CatalogSearchKey = keyof CatalogSearch;

/** Params that pick the result order or text, not filters; clearing keeps them. */
const KEPT_ON_CLEAR: CatalogSearchKey[] = ['search', 'sort', 'order'];

const ENUM_LABELS: Partial<Record<CatalogSearchKey, FilterProperty<string>>> = {
    statuses: RELEASE_STATUS,
    seasons: SEASON,
    types: MEDIA_TYPE,
    ratings: AGE_RATING,
};

function isEmpty(value: unknown) {
    return (
        value === undefined ||
        value === null ||
        value === false ||
        value === '' ||
        (Array.isArray(value) && value.length === 0)
    );
}

/** Same rules as the web's `useChangeParam`: empty values drop the param, and any change resets the page. */
export function setParam<K extends CatalogSearchKey>(
    search: CatalogSearch,
    key: K,
    value: CatalogSearch[K] | null,
): CatalogSearch {
    const next = { ...search };
    delete next.page;

    if (isEmpty(value)) {
        delete next[key];
        return next;
    }

    return { ...next, [key]: value };
}

export function toggleValue(list: string[] | undefined, value: string) {
    const current = list ?? [];

    return current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value];
}

export type GenreState = 'include' | 'exclude' | undefined;

export function genreState(
    genres: string[] | undefined,
    slug: string,
): GenreState {
    if (genres?.includes(slug)) return 'include';
    if (genres?.includes(`-${slug}`)) return 'exclude';
    return undefined;
}

/** Tri-state like the web select: neutral, include, exclude (`-slug`), neutral. */
export function cycleGenre(genres: string[] | undefined, slug: string) {
    const state = genreState(genres, slug);
    const rest = (genres ?? []).filter(
        (item) => item !== slug && item !== `-${slug}`,
    );

    if (state === undefined) return [...rest, slug];
    if (state === 'include') return [...rest, `-${slug}`];
    return rest;
}

export function clearFilters(search: CatalogSearch): CatalogSearch {
    const next: CatalogSearch = {};

    for (const key of KEPT_ON_CLEAR) {
        if (search[key] !== undefined) {
            Object.assign(next, { [key]: search[key] });
        }
    }

    return next;
}

export type ActiveFilter = {
    param: CatalogSearchKey;
    value: string;
    label: string;
    excluded?: boolean;
};

type ActiveFilterOptions = {
    names?: Record<string, string>;
    signedIn?: boolean;
};

/** The web's active-filter chips (`FILTER_REGISTRY`) derived from catalog state. */
export function getActiveFilters(
    search: CatalogSearch,
    { names = {}, signedIn = false }: ActiveFilterOptions = {},
): ActiveFilter[] {
    const result: ActiveFilter[] = [];

    for (const param of [
        'genres',
        'studios',
        'statuses',
        'types',
        'seasons',
        'ratings',
    ] as const) {
        for (const raw of search[param] ?? []) {
            const excluded = param === 'genres' && raw.startsWith('-');
            const value = excluded ? raw.slice(1) : raw;
            const label =
                ENUM_LABELS[param]?.[value]?.title_ua ?? names[value] ?? value;

            result.push({
                param,
                value: raw,
                label,
                ...(excluded && { excluded }),
            });
        }
    }

    if (search.date_range_enabled) {
        result.push({
            param: 'date_range_enabled',
            value: 'true',
            label: 'Часовий проміжок',
        });
    }

    for (const param of ['years', 'score'] as const) {
        const range = search[param];

        if (range?.length === 2) {
            result.push({
                param,
                value: range.join('–'),
                label:
                    param === 'score'
                        ? `Оцінка ${range.join('–')}`
                        : range.join('–'),
            });
        }
    }

    if (search.only_translated) {
        result.push({
            param: 'only_translated',
            value: 'true',
            label: 'Перекладено українською',
        });
    }

    if (search.hide_listed && signedIn) {
        result.push({
            param: 'hide_listed',
            value: 'true',
            label: 'Без тайтлів з мого списку',
        });
    }

    return result;
}

export function removeFilter(
    search: CatalogSearch,
    filter: ActiveFilter,
): CatalogSearch {
    switch (filter.param) {
        case 'genres':
        case 'studios':
        case 'statuses':
        case 'types':
        case 'seasons':
        case 'ratings':
            return setParam(
                search,
                filter.param,
                (search[filter.param] ?? []).filter(
                    (item) => item !== filter.value,
                ),
            );
        case 'date_range_enabled':
            return setParam(
                setParam(search, 'date_range', null),
                'date_range_enabled',
                null,
            );
        default:
            return setParam(search, filter.param, null);
    }
}
