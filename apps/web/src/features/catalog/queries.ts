import type {
    InfiniteData,
    UseInfiniteQueryOptions,
} from '@tanstack/react-query';

import {
    type AnimeResponseWithWatch,
    type Client,
    ContentTypeEnum,
    type MainContentTypeEnum,
    type MangaResponseWithRead,
    type NovelResponseWithRead,
    type PaginationResponse,
    paginatedInfiniteOptions,
    type ReadStatusEnum,
    searchAnimeInfiniteOptions,
    searchMangaInfiniteOptions,
    searchNovelInfiniteOptions,
    type WatchStatusEnum,
} from '@hikka/api';

import {
    CATALOG_FILTERS_SIDEBAR_KEY,
    catalogExcludeKey,
    type UiPreferences,
} from '@/utils/cookies';
import type {
    AnimeSearch,
    MangaSearch,
    NovelSearch,
} from '@/utils/search-schemas';

import {
    buildAnimeSearchArgs,
    buildMangaSearchArgs,
    buildNovelSearchArgs,
} from './search-args';

export const CATALOG_VIEW_KEY = 'catalog';

/** The search endpoints' default `size`, which the list view relies on. */
export const SEARCH_DEFAULT_PAGE_SIZE = 15;

export type CatalogItems = {
    [ContentTypeEnum.ANIME]: AnimeResponseWithWatch;
    [ContentTypeEnum.MANGA]: MangaResponseWithRead;
    [ContentTypeEnum.NOVEL]: NovelResponseWithRead;
};

export type CatalogSearch = AnimeSearch | MangaSearch | NovelSearch;

type CatalogSearchPage = {
    list: CatalogItems[MainContentTypeEnum][];
    pagination: PaginationResponse;
};

type CatalogSearchOptions = UseInfiniteQueryOptions<
    CatalogSearchPage,
    Error,
    InfiniteData<CatalogSearchPage>,
    readonly unknown[],
    number
> & { initialPageParam: number };

type CatalogLayoutPrefs = Pick<UiPreferences, 'views' | 'collapsibles'>;

export function catalogColumns(
    prefs: CatalogLayoutPrefs | null,
    key: string,
): 1 | 5 | 7 {
    if (prefs?.views[key] === 'list') return 1;

    return (prefs?.collapsibles[CATALOG_FILTERS_SIDEBAR_KEY] ?? true) ? 5 : 7;
}

/** The page size is part of the query key, so the loader and the page both derive it here. */
export function catalogPageSize(
    prefs: CatalogLayoutPrefs | null,
    key: string,
): number | undefined {
    const columns = catalogColumns(prefs, key);

    return columns === 1 ? undefined : columns * 4;
}

/** An empty selection sends nothing, so the field is only ever a non-empty list. */
export function catalogExcludeStatuses(
    prefs: Pick<UiPreferences, 'filters'> | null,
    contentType: MainContentTypeEnum,
): string[] | undefined {
    const statuses = prefs?.filters[catalogExcludeKey(contentType)];

    return statuses?.length ? statuses : undefined;
}

export function catalogSearchQuery(
    contentType: MainContentTypeEnum,
    search: CatalogSearch,
    size?: number,
    excludeStatuses?: string[],
    client?: Client,
) {
    switch (contentType) {
        case ContentTypeEnum.ANIME: {
            const { args: searchArgs, page } = buildAnimeSearchArgs(search);
            const args = {
                ...searchArgs,
                ...(excludeStatuses && {
                    exclude_watch_status: excludeStatuses as WatchStatusEnum[],
                }),
            };

            return {
                args,
                options: paginatedInfiniteOptions(
                    searchAnimeInfiniteOptions({
                        body: args,
                        query: { size },
                        client,
                    }),
                    page,
                ) as CatalogSearchOptions,
            };
        }
        case ContentTypeEnum.MANGA: {
            const { args: searchArgs, page } = buildMangaSearchArgs(search);
            const args = {
                ...searchArgs,
                ...(excludeStatuses && {
                    exclude_read_status: excludeStatuses as ReadStatusEnum[],
                }),
            };

            return {
                args,
                options: paginatedInfiniteOptions(
                    searchMangaInfiniteOptions({
                        body: args,
                        query: { size },
                        client,
                    }),
                    page,
                ) as CatalogSearchOptions,
            };
        }
        case ContentTypeEnum.NOVEL: {
            const { args: searchArgs, page } = buildNovelSearchArgs(search);
            const args = {
                ...searchArgs,
                ...(excludeStatuses && {
                    exclude_read_status: excludeStatuses as ReadStatusEnum[],
                }),
            };

            return {
                args,
                options: paginatedInfiniteOptions(
                    searchNovelInfiniteOptions({
                        body: args,
                        query: { size },
                        client,
                    }),
                    page,
                ) as CatalogSearchOptions,
            };
        }
    }
}

export function catalogSearchOptions(
    contentType: MainContentTypeEnum,
    search: CatalogSearch,
    size?: number,
    excludeStatuses?: string[],
    client?: Client,
): CatalogSearchOptions {
    return catalogSearchQuery(
        contentType,
        search,
        size,
        excludeStatuses,
        client,
    ).options;
}
