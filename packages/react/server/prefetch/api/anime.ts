import {
    AnimeEpisodesListResponse,
    AnimeInfoResponse,
    AnimePaginationResponse,
    AnimeStaffPaginationResponse,
    ContentCharacterPaginationResponse,
} from '@hikka/client';

import { queryKeys } from '@/core';
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
}: PrefetchQueryParams<AnimeInfoResponse> & UseAnimeInfoParams) {
    return prefetchQuery({
        queryKey: queryKeys.anime.details(slug),
        queryFn: (client) => client.anime.getAnimeBySlug(slug),
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
}: PrefetchInfiniteQueryParams<ContentCharacterPaginationResponse> &
    UseAnimeCharactersParams) {
    return prefetchInfiniteQuery({
        queryKey: queryKeys.anime.characters(slug, paginationArgs),
        queryFn: (client, page = paginationArgs?.page || 1) =>
            client.anime.getAnimeCharacters(slug, {
                page,
                size: paginationArgs?.size,
            }),
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
}: PrefetchInfiniteQueryParams<AnimeEpisodesListResponse> &
    UseAnimeEpisodesParams) {
    return prefetchInfiniteQuery({
        queryKey: queryKeys.anime.episodes(slug, paginationArgs),
        queryFn: (client, page = paginationArgs?.page || 1) =>
            client.anime.getAnimeEpisodes(slug, {
                page,
                size: paginationArgs?.size,
            }),
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
}: PrefetchInfiniteQueryParams<AnimePaginationResponse> &
    UseAnimeFranchiseParams) {
    return prefetchInfiniteQuery({
        queryKey: queryKeys.anime.franchise(slug, paginationArgs),
        queryFn: (client, page = paginationArgs?.page || 1) =>
            client.anime.getAnimeFranchise(slug, {
                page,
                size: paginationArgs?.size,
            }),
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
}: PrefetchInfiniteQueryParams<AnimePaginationResponse> &
    UseAnimeRecommendationsParams) {
    return prefetchInfiniteQuery({
        queryKey: queryKeys.anime.recommendations(slug, paginationArgs),
        queryFn: (client, page = paginationArgs?.page || 1) =>
            client.anime.getAnimeRecommendations(slug, {
                page,
                size: paginationArgs?.size,
            }),
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
}: PrefetchInfiniteQueryParams<AnimeStaffPaginationResponse> &
    UseAnimeStaffParams) {
    return prefetchInfiniteQuery({
        queryKey: queryKeys.anime.staff(slug, paginationArgs),
        queryFn: (client, page = paginationArgs?.page || 1) =>
            client.anime.getAnimeStaff(slug, {
                page,
                size: paginationArgs?.size,
            }),
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
}: PrefetchInfiniteQueryParams<AnimePaginationResponse> &
    UseAnimeSearchParams) {
    return prefetchInfiniteQuery({
        queryKey: queryKeys.anime.search({ args, paginationArgs }),
        queryFn: (client, pageParam) =>
            client.anime.searchAnimes(args, {
                page: paginationArgs?.page ?? pageParam,
                size: paginationArgs?.size,
            }),
        ...rest,
    });
}
