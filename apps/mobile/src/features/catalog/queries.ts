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
    searchAnimeInfiniteOptions,
    searchMangaInfiniteOptions,
    searchNovelInfiniteOptions,
} from '@hikka/api';
import { buildCatalogSearchArgs, listStatuses } from '@hikka/core';

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

/**
 * The request body: the web's catalog builder, with "hide listed" excluding every list
 * status for a signed-in viewer (the web's default until the viewer narrows them).
 */
export function catalogSearchArgs<T extends CatalogType>(
    type: T,
    search: CatalogSearch,
    signedIn: boolean,
) {
    const hidden =
        search.hide_listed && signedIn ? listStatuses(type) : undefined;

    return buildCatalogSearchArgs(type, search, hidden).args;
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
                    body: catalogSearchArgs(type, search, signedIn),
                    query,
                }),
            ) as CatalogOptions;
        case ContentTypeEnum.MANGA:
            return paginatedInfiniteOptions(
                searchMangaInfiniteOptions({
                    body: catalogSearchArgs(type, search, signedIn),
                    query,
                }),
            ) as CatalogOptions;
        case ContentTypeEnum.NOVEL:
            return paginatedInfiniteOptions(
                searchNovelInfiniteOptions({
                    body: catalogSearchArgs(type, search, signedIn),
                    query,
                }),
            ) as CatalogOptions;
    }
}
