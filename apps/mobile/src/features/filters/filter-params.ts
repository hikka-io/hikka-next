import { ContentTypeEnum } from '@hikka/api';
import {
    type AnimeSearch,
    DATE_RANGE,
    type MangaSearch,
    type NovelSearch,
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

type GenreState = 'include' | 'exclude' | undefined;

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

/**
 * Turning the date range on applies the full range at once and drops the season and year
 * filters it hides, so no hidden filter stays in the request or the chips.
 */
export function setDateRangeEnabled(
    search: CatalogSearch,
    enabled: boolean,
): CatalogSearch {
    if (!enabled) {
        return setParam(
            setParam(search, 'date_range', null),
            'date_range_enabled',
            null,
        );
    }

    const { seasons: _seasons, years: _years, ...rest } = search;

    return setParam(
        setParam(rest, 'date_range', DATE_RANGE),
        'date_range_enabled',
        true,
    );
}
