import {
    CharacterAnimePaginationResponse,
    CharacterMangaPaginationResponse,
    CharacterNovelPaginationResponse,
    CharacterVoicesPaginationResponse,
    PaginationArgs,
} from '@hikka/client';
import {
    FetchInfiniteQueryOptions,
    InfiniteData,
    QueryClient,
} from '@tanstack/query-core';
import { UseInfiniteQueryOptions } from '@tanstack/react-query';

import { queryKeys } from '../../core/queryKeys';
import { useInfiniteQuery } from '../../core/useInfiniteQuery';
import { prefetchInfiniteQuery } from '../../server/prefetchInfiniteQuery';

/**
 * Hook for getting character's anime appearances
 */
export function useCharacterAnime(
    slug: string,
    paginationArgs?: PaginationArgs,
    options?: Omit<
        UseInfiniteQueryOptions<
            CharacterAnimePaginationResponse,
            Error,
            InfiniteData<CharacterAnimePaginationResponse>,
            CharacterAnimePaginationResponse,
            readonly unknown[],
            number
        >,
        'queryKey' | 'queryFn' | 'initialPageParam' | 'getNextPageParam'
    >,
) {
    return useInfiniteQuery({
        queryKey: queryKeys.characters.anime(slug, paginationArgs),
        queryFn: (client, page = paginationArgs?.page || 1) =>
            client.characters.getAnime(slug, {
                page,
                size: paginationArgs?.size,
            }),
        options: options || {},
    });
}

/**
 * Function for prefetching character's anime appearances
 */
export async function prefetchCharacterAnime(
    queryClient: QueryClient,
    slug: string,
    paginationArgs?: PaginationArgs,
    options?: Omit<
        FetchInfiniteQueryOptions<
            CharacterAnimePaginationResponse,
            Error,
            CharacterAnimePaginationResponse,
            readonly unknown[],
            number
        >,
        'queryKey' | 'queryFn' | 'initialPageParam' | 'getNextPageParam'
    >,
) {
    return prefetchInfiniteQuery({
        queryClient,
        queryKey: queryKeys.characters.anime(slug, paginationArgs),
        queryFn: (client, page = paginationArgs?.page || 1) =>
            client.characters.getAnime(slug, {
                page,
                size: paginationArgs?.size,
            }),
        options: options || {},
    });
}

/**
 * Hook for getting character's manga appearances
 */
export function useCharacterManga(
    slug: string,
    paginationArgs?: PaginationArgs,
    options?: Omit<
        UseInfiniteQueryOptions<
            CharacterMangaPaginationResponse,
            Error,
            InfiniteData<CharacterMangaPaginationResponse>,
            CharacterMangaPaginationResponse,
            readonly unknown[],
            number
        >,
        'queryKey' | 'queryFn' | 'initialPageParam' | 'getNextPageParam'
    >,
) {
    return useInfiniteQuery({
        queryKey: queryKeys.characters.manga(slug, paginationArgs),
        queryFn: (client, page = paginationArgs?.page || 1) =>
            client.characters.getManga(slug, {
                page,
                size: paginationArgs?.size,
            }),
        options: options || {},
    });
}

/**
 * Function for prefetching character's manga appearances
 */
export async function prefetchCharacterManga(
    queryClient: QueryClient,
    slug: string,
    paginationArgs?: PaginationArgs,
    options?: Omit<
        FetchInfiniteQueryOptions<
            CharacterMangaPaginationResponse,
            Error,
            CharacterMangaPaginationResponse,
            readonly unknown[],
            number
        >,
        'queryKey' | 'queryFn' | 'initialPageParam' | 'getNextPageParam'
    >,
) {
    return prefetchInfiniteQuery({
        queryClient,
        queryKey: queryKeys.characters.manga(slug, paginationArgs),
        queryFn: (client, page = paginationArgs?.page || 1) =>
            client.characters.getManga(slug, {
                page,
                size: paginationArgs?.size,
            }),
        options: options || {},
    });
}

/**
 * Hook for getting character's novel appearances
 */
export function useCharacterNovel(
    slug: string,
    paginationArgs?: PaginationArgs,
    options?: Omit<
        UseInfiniteQueryOptions<
            CharacterNovelPaginationResponse,
            Error,
            InfiniteData<CharacterNovelPaginationResponse>,
            CharacterNovelPaginationResponse,
            readonly unknown[],
            number
        >,
        'queryKey' | 'queryFn' | 'initialPageParam' | 'getNextPageParam'
    >,
) {
    return useInfiniteQuery({
        queryKey: queryKeys.characters.novel(slug, paginationArgs),
        queryFn: (client, page = paginationArgs?.page || 1) =>
            client.characters.getNovel(slug, {
                page,
                size: paginationArgs?.size,
            }),
        options: options || {},
    });
}

/**
 * Function for prefetching character's novel appearances
 */
export async function prefetchCharacterNovel(
    queryClient: QueryClient,
    slug: string,
    paginationArgs?: PaginationArgs,
    options?: Omit<
        FetchInfiniteQueryOptions<
            CharacterNovelPaginationResponse,
            Error,
            CharacterNovelPaginationResponse,
            readonly unknown[],
            number
        >,
        'queryKey' | 'queryFn' | 'initialPageParam' | 'getNextPageParam'
    >,
) {
    return prefetchInfiniteQuery({
        queryClient,
        queryKey: queryKeys.characters.novel(slug, paginationArgs),
        queryFn: (client, page = paginationArgs?.page || 1) =>
            client.characters.getNovel(slug, {
                page,
                size: paginationArgs?.size,
            }),
        options: options || {},
    });
}

/**
 * Hook for getting character's voice actors
 */
export function useCharacterVoices(
    slug: string,
    paginationArgs?: PaginationArgs,
    options?: Omit<
        UseInfiniteQueryOptions<
            CharacterVoicesPaginationResponse,
            Error,
            InfiniteData<CharacterVoicesPaginationResponse>,
            CharacterVoicesPaginationResponse,
            readonly unknown[],
            number
        >,
        'queryKey' | 'queryFn' | 'initialPageParam' | 'getNextPageParam'
    >,
) {
    return useInfiniteQuery({
        queryKey: queryKeys.characters.voices(slug, paginationArgs),
        queryFn: (client, page = paginationArgs?.page || 1) =>
            client.characters.getVoices(slug, {
                page,
                size: paginationArgs?.size,
            }),
        options: options || {},
    });
}

/**
 * Function for prefetching character's voice actors
 */
export async function prefetchCharacterVoices(
    queryClient: QueryClient,
    slug: string,
    paginationArgs?: PaginationArgs,
    options?: Omit<
        FetchInfiniteQueryOptions<
            CharacterVoicesPaginationResponse,
            Error,
            CharacterVoicesPaginationResponse,
            readonly unknown[],
            number
        >,
        'queryKey' | 'queryFn' | 'initialPageParam' | 'getNextPageParam'
    >,
) {
    return prefetchInfiniteQuery({
        queryClient,
        queryKey: queryKeys.characters.voices(slug, paginationArgs),
        queryFn: (client, page = paginationArgs?.page || 1) =>
            client.characters.getVoices(slug, {
                page,
                size: paginationArgs?.size,
            }),
        options: options || {},
    });
}
