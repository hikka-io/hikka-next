import type {
    UseMangaCharactersParams,
    UseMangaInfoParams,
    UseSearchMangasParams,
} from '@/types/manga';
import {
    mangaBySlugOptions,
    mangaCharactersOptions,
    searchMangasOptions,
} from '@/options/api/manga';
import {
    type PrefetchInfiniteQueryParams,
    prefetchInfiniteQuery,
} from '@/server/prefetchInfiniteQuery';
import {
    type PrefetchQueryParams,
    prefetchQuery,
} from '@/server/prefetchQuery';

/**
 * Prefetches manga details for server-side rendering
 */
export async function prefetchMangaBySlug({
    slug,
    ...rest
}: PrefetchQueryParams & UseMangaInfoParams) {
    return prefetchQuery({
        optionsFactory: (client) => mangaBySlugOptions(client, { slug }),
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
}: PrefetchInfiniteQueryParams & UseMangaCharactersParams) {
    return prefetchInfiniteQuery({
        optionsFactory: (client) =>
            mangaCharactersOptions(client, { slug, paginationArgs }),
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
}: PrefetchInfiniteQueryParams & UseSearchMangasParams) {
    return prefetchInfiniteQuery({
        optionsFactory: (client) =>
            searchMangasOptions(client, { args, paginationArgs }),
        ...rest,
    });
}
