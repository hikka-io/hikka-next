import {
    ContentCharacterPaginationResponse,
    MangaInfoResponse,
    MangaPaginationResponse,
} from '@hikka/client';

import { queryKeys } from '@/core';
import {
    PrefetchInfiniteQueryParams,
    prefetchInfiniteQuery,
} from '@/server/prefetchInfiniteQuery';
import { PrefetchQueryParams, prefetchQuery } from '@/server/prefetchQuery';
import {
    UseMangaCharactersParams,
    UseMangaInfoParams,
    UseSearchMangasParams,
} from '@/types/manga';

/**
 * Prefetches manga details for server-side rendering
 */
export async function prefetchMangaBySlug({
    slug,
    ...rest
}: PrefetchQueryParams<MangaInfoResponse> & UseMangaInfoParams) {
    return prefetchQuery({
        queryKey: queryKeys.manga.details(slug),
        queryFn: (client) => client.manga.getMangaBySlug(slug),
        ...rest,
    });
}

/**
 * Prefetches manga characters for server-side rendering
 */
export async function prefetchMangaCharacters({
    slug,
    paginationArgs,
    ...rest
}: PrefetchInfiniteQueryParams<ContentCharacterPaginationResponse> &
    UseMangaCharactersParams) {
    return prefetchInfiniteQuery({
        queryKey: queryKeys.manga.characters(slug, paginationArgs),
        queryFn: (client, page = paginationArgs?.page || 1) =>
            client.manga.getMangaCharacters(slug, {
                page,
                size: paginationArgs?.size,
            }),
        ...rest,
    });
}

/**
 * Prefetches manga search results for server-side rendering
 */
export async function prefetchSearchMangas({
    args,
    paginationArgs,
    ...rest
}: PrefetchInfiniteQueryParams<MangaPaginationResponse> &
    UseSearchMangasParams) {
    return prefetchInfiniteQuery({
        queryKey: queryKeys.manga.search({ args, paginationArgs }),
        queryFn: (client, page = paginationArgs?.page || 1) =>
            client.manga.searchMangas(args, {
                page,
                size: paginationArgs?.size,
            }),
        ...rest,
    });
}
