'use client';

import {
    AnimeEpisodesListResponse,
    AnimeInfoResponse,
    AnimePaginationResponse,
    AnimeStaffPaginationResponse,
    ContentCharacterPaginationResponse,
} from '@hikka/client';

import {
    InfiniteQueryParams,
    useInfiniteQuery,
} from '@/client/useInfiniteQuery';
import { QueryParams, useQuery } from '@/client/useQuery';
import { queryKeys } from '@/core';
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
 * Hook for retrieving anime details by slug
 */
export function useAnimeBySlug<TResult = AnimeInfoResponse>({
    slug,
    ...rest
}: UseAnimeInfoParams & QueryParams<AnimeInfoResponse, TResult>) {
    return useQuery<AnimeInfoResponse, Error, TResult>({
        queryKey: queryKeys.anime.details(slug),
        queryFn: (client) => client.anime.getAnimeBySlug(slug),
        ...rest,
    });
}

/**
 * Hook for retrieving anime characters with pagination
 */
export function useAnimeCharacters({
    slug,
    paginationArgs = { page: 1, size: 20 },
    ...rest
}: UseAnimeCharactersParams &
    InfiniteQueryParams<ContentCharacterPaginationResponse>) {
    return useInfiniteQuery({
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
 * Hook for retrieving anime staff with pagination
 */
export function useAnimeStaff({
    slug,
    paginationArgs,
    ...rest
}: UseAnimeStaffParams & InfiniteQueryParams<AnimeStaffPaginationResponse>) {
    return useInfiniteQuery({
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
 * Hook for retrieving anime episodes with pagination
 */
export function useAnimeEpisodes({
    slug,
    paginationArgs,
    ...rest
}: UseAnimeEpisodesParams & InfiniteQueryParams<AnimeEpisodesListResponse>) {
    return useInfiniteQuery({
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
 * Hook for retrieving anime franchise entries with pagination
 */
export function useAnimeFranchise({
    slug,
    paginationArgs,
    ...rest
}: UseAnimeFranchiseParams & InfiniteQueryParams<AnimePaginationResponse>) {
    return useInfiniteQuery({
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
 * Hook for retrieving anime recommendations with pagination
 */
export function useAnimeRecommendations({
    slug,
    paginationArgs,
    ...rest
}: UseAnimeRecommendationsParams &
    InfiniteQueryParams<AnimePaginationResponse>) {
    return useInfiniteQuery({
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
 * Hook for searching anime with pagination
 */
export function useSearchAnimes({
    args,
    paginationArgs,
    ...rest
}: UseAnimeSearchParams & InfiniteQueryParams<AnimePaginationResponse>) {
    return useInfiniteQuery({
        queryKey: queryKeys.anime.search({ args, paginationArgs }),
        queryFn: (client, page = paginationArgs?.page || 1) =>
            client.anime.searchAnimes(args, {
                page,
                size: paginationArgs?.size,
            }),
        ...rest,
    });
}
