import type {
    InfiniteData,
    UseInfiniteQueryOptions,
} from '@tanstack/react-query';

import {
    type AnimeResponseWithWatch,
    ContentTypeEnum,
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
    buildAnimeSearchArgs,
    buildMangaSearchArgs,
    buildNovelSearchArgs,
    READ_STATUS,
    WATCH_STATUS,
} from '@hikka/core';

import type { CatalogSearch, CatalogType } from '@/features/filters';

/** A multiple of the grid's three columns, so every page fills its rows. */
export const CATALOG_PAGE_SIZE = 30;

export type CatalogItem =
    | AnimeResponseWithWatch
    | MangaResponseWithRead
    | NovelResponseWithRead;

type CatalogPage = {
    list: CatalogItem[];
    pagination: PaginationResponse;
};

export type CatalogData = InfiniteData<CatalogPage, number>;

type CatalogOptions = UseInfiniteQueryOptions<
    CatalogPage,
    Error,
    CatalogData,
    readonly unknown[],
    number
> & { initialPageParam: number };

const WATCH_STATUSES = Object.keys(WATCH_STATUS) as WatchStatusEnum[];
const READ_STATUSES = Object.keys(READ_STATUS) as ReadStatusEnum[];

function excludeWatched<T>(args: T, search: CatalogSearch, signedIn: boolean) {
    return search.hide_listed && signedIn
        ? { ...args, exclude_watch_status: WATCH_STATUSES }
        : args;
}

function excludeRead<T>(args: T, search: CatalogSearch, signedIn: boolean) {
    return search.hide_listed && signedIn
        ? { ...args, exclude_read_status: READ_STATUSES }
        : args;
}

/**
 * The web's `catalogSearchQuery`: the shared core builders turn catalog state into the
 * request body, and `hide_listed` excludes every list status for a signed-in viewer.
 */
export function catalogSearchArgs(
    type: CatalogType,
    search: CatalogSearch,
    signedIn: boolean,
) {
    switch (type) {
        case ContentTypeEnum.ANIME:
            return excludeWatched(
                buildAnimeSearchArgs(search).args,
                search,
                signedIn,
            );
        case ContentTypeEnum.MANGA:
            return excludeRead(
                buildMangaSearchArgs(search).args,
                search,
                signedIn,
            );
        case ContentTypeEnum.NOVEL:
            return excludeRead(
                buildNovelSearchArgs(search).args,
                search,
                signedIn,
            );
    }
}

export function catalogSearchOptions(
    type: CatalogType,
    search: CatalogSearch,
    signedIn: boolean,
) {
    const query = { size: CATALOG_PAGE_SIZE };

    switch (type) {
        case ContentTypeEnum.ANIME:
            return paginatedInfiniteOptions(
                searchAnimeInfiniteOptions({
                    body: excludeWatched(
                        buildAnimeSearchArgs(search).args,
                        search,
                        signedIn,
                    ),
                    query,
                }),
            ) as CatalogOptions;
        case ContentTypeEnum.MANGA:
            return paginatedInfiniteOptions(
                searchMangaInfiniteOptions({
                    body: excludeRead(
                        buildMangaSearchArgs(search).args,
                        search,
                        signedIn,
                    ),
                    query,
                }),
            ) as CatalogOptions;
        case ContentTypeEnum.NOVEL:
            return paginatedInfiniteOptions(
                searchNovelInfiniteOptions({
                    body: excludeRead(
                        buildNovelSearchArgs(search).args,
                        search,
                        signedIn,
                    ),
                    query,
                }),
            ) as CatalogOptions;
    }
}
