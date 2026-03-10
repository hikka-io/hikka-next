import {
    animeBySlugOptions,
    animeCharactersOptions,
    animeEpisodesOptions,
    animeFranchiseOptions,
    animeRecommendationsOptions,
    animeStaffOptions,
    searchAnimesOptions,
} from '@/options/api/anime';
import {
    PrefetchInfiniteQueryParams,
    prefetchInfiniteQuery,
} from '@/server/prefetchInfiniteQuery';
import { PrefetchQueryParams, prefetchQuery } from '@/server/prefetchQuery';
import {
    UseAnimeCharactersParams,
    UseAnimeEpisodesParams,
    UseAnimeFranchiseParams,
    UseAnimeInfoParams,
    UseAnimeRecommendationsParams,
    UseAnimeSearchParams,
    UseAnimeStaffParams,
} from '@/types/anime';

/**
 * Prefetches anime details for server-side rendering
 */
export async function prefetchAnimeBySlug({
    slug,
    ...rest
}: PrefetchQueryParams & UseAnimeInfoParams) {
    return prefetchQuery({
        optionsFactory: (client) => animeBySlugOptions(client, { slug }),
        ...rest,
    });
}

/**
 * Prefetches anime characters for server-side rendering
 */
export async function prefetchAnimeCharacters({
    slug,
    paginationArgs,
    ...rest
}: PrefetchInfiniteQueryParams & UseAnimeCharactersParams) {
    return prefetchInfiniteQuery({
        optionsFactory: (client) =>
            animeCharactersOptions(client, { slug, paginationArgs }),
        ...rest,
    });
}

/**
 * Prefetches anime episodes for server-side rendering
 */
export async function prefetchAnimeEpisodes({
    slug,
    paginationArgs,
    ...rest
}: PrefetchInfiniteQueryParams & UseAnimeEpisodesParams) {
    return prefetchInfiniteQuery({
        optionsFactory: (client) =>
            animeEpisodesOptions(client, { slug, paginationArgs }),
        ...rest,
    });
}

/**
 * Prefetches anime franchise entries for server-side rendering
 */
export async function prefetchAnimeFranchise({
    slug,
    paginationArgs,
    ...rest
}: PrefetchInfiniteQueryParams & UseAnimeFranchiseParams) {
    return prefetchInfiniteQuery({
        optionsFactory: (client) =>
            animeFranchiseOptions(client, { slug, paginationArgs }),
        ...rest,
    });
}

/**
 * Prefetches anime recommendations for server-side rendering
 */
export async function prefetchAnimeRecommendations({
    slug,
    paginationArgs,
    ...rest
}: PrefetchInfiniteQueryParams & UseAnimeRecommendationsParams) {
    return prefetchInfiniteQuery({
        optionsFactory: (client) =>
            animeRecommendationsOptions(client, { slug, paginationArgs }),
        ...rest,
    });
}

/**
 * Prefetches anime staff for server-side rendering
 */
export async function prefetchAnimeStaff({
    slug,
    paginationArgs,
    ...rest
}: PrefetchInfiniteQueryParams & UseAnimeStaffParams) {
    return prefetchInfiniteQuery({
        optionsFactory: (client) =>
            animeStaffOptions(client, { slug, paginationArgs }),
        ...rest,
    });
}

/**
 * Prefetches anime search results for server-side rendering
 */
export async function prefetchSearchAnimes({
    args,
    paginationArgs,
    ...rest
}: PrefetchInfiniteQueryParams & UseAnimeSearchParams) {
    return prefetchInfiniteQuery({
        optionsFactory: (client) =>
            searchAnimesOptions(client, { args, paginationArgs }),
        ...rest,
    });
}
