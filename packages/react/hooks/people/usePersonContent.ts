import {
    PaginationArgs,
    PersonAnimePaginationResponse,
    PersonCharactersPaginationResponse,
    PersonMangaPaginationResponse,
    PersonNovelPaginationResponse,
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
 * Hook for getting person's anime work
 */
export function usePersonAnime(
    slug: string,
    paginationArgs?: PaginationArgs,
    options?: Omit<
        UseInfiniteQueryOptions<
            PersonAnimePaginationResponse,
            Error,
            InfiniteData<PersonAnimePaginationResponse>,
            PersonAnimePaginationResponse,
            readonly unknown[],
            number
        >,
        'queryKey' | 'queryFn' | 'initialPageParam' | 'getNextPageParam'
    >,
) {
    return useInfiniteQuery({
        queryKey: queryKeys.people.anime(slug, paginationArgs),
        queryFn: (client, page = paginationArgs?.page || 1) =>
            client.people.getAnime(slug, {
                page,
                size: paginationArgs?.size,
            }),
        options: options || {},
    });
}

/**
 * Function for prefetching person's anime work
 */
export async function prefetchPersonAnime(
    queryClient: QueryClient,
    slug: string,
    paginationArgs?: PaginationArgs,
    options?: Omit<
        FetchInfiniteQueryOptions<
            PersonAnimePaginationResponse,
            Error,
            PersonAnimePaginationResponse,
            readonly unknown[],
            number
        >,
        'queryKey' | 'queryFn' | 'initialPageParam' | 'getNextPageParam'
    >,
) {
    return prefetchInfiniteQuery({
        queryClient,
        queryKey: queryKeys.people.anime(slug, paginationArgs),
        queryFn: (client, page = paginationArgs?.page || 1) =>
            client.people.getAnime(slug, {
                page,
                size: paginationArgs?.size,
            }),
        options: options || {},
    });
}

/**
 * Hook for getting person's manga work
 */
export function usePersonManga(
    slug: string,
    paginationArgs?: PaginationArgs,
    options?: Omit<
        UseInfiniteQueryOptions<
            PersonMangaPaginationResponse,
            Error,
            InfiniteData<PersonMangaPaginationResponse>,
            PersonMangaPaginationResponse,
            readonly unknown[],
            number
        >,
        'queryKey' | 'queryFn' | 'initialPageParam' | 'getNextPageParam'
    >,
) {
    return useInfiniteQuery({
        queryKey: queryKeys.people.manga(slug, paginationArgs),
        queryFn: (client, page = paginationArgs?.page || 1) =>
            client.people.getManga(slug, {
                page,
                size: paginationArgs?.size,
            }),
        options: options || {},
    });
}

/**
 * Function for prefetching person's manga work
 */
export async function prefetchPersonManga(
    queryClient: QueryClient,
    slug: string,
    paginationArgs?: PaginationArgs,
    options?: Omit<
        FetchInfiniteQueryOptions<
            PersonMangaPaginationResponse,
            Error,
            PersonMangaPaginationResponse,
            readonly unknown[],
            number
        >,
        'queryKey' | 'queryFn' | 'initialPageParam' | 'getNextPageParam'
    >,
) {
    return prefetchInfiniteQuery({
        queryClient,
        queryKey: queryKeys.people.manga(slug, paginationArgs),
        queryFn: (client, page = paginationArgs?.page || 1) =>
            client.people.getManga(slug, {
                page,
                size: paginationArgs?.size,
            }),
        options: options || {},
    });
}

/**
 * Hook for getting person's novel work
 */
export function usePersonNovel(
    slug: string,
    paginationArgs?: PaginationArgs,
    options?: Omit<
        UseInfiniteQueryOptions<
            PersonNovelPaginationResponse,
            Error,
            InfiniteData<PersonNovelPaginationResponse>,
            PersonNovelPaginationResponse,
            readonly unknown[],
            number
        >,
        'queryKey' | 'queryFn' | 'initialPageParam' | 'getNextPageParam'
    >,
) {
    return useInfiniteQuery({
        queryKey: queryKeys.people.novel(slug, paginationArgs),
        queryFn: (client, page = paginationArgs?.page || 1) =>
            client.people.getNovel(slug, {
                page,
                size: paginationArgs?.size,
            }),
        options: options || {},
    });
}

/**
 * Function for prefetching person's novel work
 */
export async function prefetchPersonNovel(
    queryClient: QueryClient,
    slug: string,
    paginationArgs?: PaginationArgs,
    options?: Omit<
        FetchInfiniteQueryOptions<
            PersonNovelPaginationResponse,
            Error,
            PersonNovelPaginationResponse,
            readonly unknown[],
            number
        >,
        'queryKey' | 'queryFn' | 'initialPageParam' | 'getNextPageParam'
    >,
) {
    return prefetchInfiniteQuery({
        queryClient,
        queryKey: queryKeys.people.novel(slug, paginationArgs),
        queryFn: (client, page = paginationArgs?.page || 1) =>
            client.people.getNovel(slug, {
                page,
                size: paginationArgs?.size,
            }),
        options: options || {},
    });
}

/**
 * Hook for getting characters voiced by this person
 */
export function usePersonCharacters(
    slug: string,
    paginationArgs?: PaginationArgs,
    options?: Omit<
        UseInfiniteQueryOptions<
            PersonCharactersPaginationResponse,
            Error,
            InfiniteData<PersonCharactersPaginationResponse>,
            PersonCharactersPaginationResponse,
            readonly unknown[],
            number
        >,
        'queryKey' | 'queryFn' | 'initialPageParam' | 'getNextPageParam'
    >,
) {
    return useInfiniteQuery({
        queryKey: queryKeys.people.characters(slug, paginationArgs),
        queryFn: (client, page = paginationArgs?.page || 1) =>
            client.people.getCharacters(slug, {
                page,
                size: paginationArgs?.size,
            }),
        options: options || {},
    });
}

/**
 * Function for prefetching characters voiced by this person
 */
export async function prefetchPersonCharacters(
    queryClient: QueryClient,
    slug: string,
    paginationArgs?: PaginationArgs,
    options?: Omit<
        FetchInfiniteQueryOptions<
            PersonCharactersPaginationResponse,
            Error,
            PersonCharactersPaginationResponse,
            readonly unknown[],
            number
        >,
        'queryKey' | 'queryFn' | 'initialPageParam' | 'getNextPageParam'
    >,
) {
    return prefetchInfiniteQuery({
        queryClient,
        queryKey: queryKeys.people.characters(slug, paginationArgs),
        queryFn: (client, page = paginationArgs?.page || 1) =>
            client.people.getCharacters(slug, {
                page,
                size: paginationArgs?.size,
            }),
        options: options || {},
    });
}
