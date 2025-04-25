import {
    PersonAnimePaginationResponse,
    PersonCharactersPaginationResponse,
    PersonMangaPaginationResponse,
    PersonNovelPaginationResponse,
} from '@hikka/client';

import { queryKeys } from '../../core/queryKeys';
import {
    InfiniteQueryParams,
    useInfiniteQuery,
} from '../../core/useInfiniteQuery';
import {
    PrefetchInfiniteQueryParams,
    prefetchInfiniteQuery,
} from '../../server/prefetchInfiniteQuery';

export interface UsePersonAnimeParams {
    slug: string;
}

/**
 * Hook for getting person's anime work
 */
export function usePersonAnime({
    slug,
    paginationArgs,
    ...rest
}: UsePersonAnimeParams & InfiniteQueryParams<PersonAnimePaginationResponse>) {
    return useInfiniteQuery({
        queryKey: queryKeys.people.anime(slug, paginationArgs),
        queryFn: (client, page = paginationArgs?.page || 1) =>
            client.people.getPersonAnime(slug, {
                page,
                size: paginationArgs?.size,
            }),
        ...rest,
    });
}

/**
 * Prefetches person's anime work for server-side rendering
 */
export async function prefetchPersonAnime({
    slug,
    paginationArgs,
    ...rest
}: PrefetchInfiniteQueryParams<PersonAnimePaginationResponse> &
    UsePersonAnimeParams) {
    return prefetchInfiniteQuery({
        queryKey: queryKeys.people.anime(slug, paginationArgs),
        queryFn: (client, page = paginationArgs?.page || 1) =>
            client.people.getPersonAnime(slug, {
                page,
                size: paginationArgs?.size,
            }),
        ...rest,
    });
}

export interface UsePersonMangaParams {
    slug: string;
}

/**
 * Hook for getting person's manga work
 */
export function usePersonManga({
    slug,
    paginationArgs,
    ...rest
}: UsePersonMangaParams & InfiniteQueryParams<PersonMangaPaginationResponse>) {
    return useInfiniteQuery({
        queryKey: queryKeys.people.manga(slug, paginationArgs),
        queryFn: (client, page = paginationArgs?.page || 1) =>
            client.people.getPersonManga(slug, {
                page,
                size: paginationArgs?.size,
            }),
        ...rest,
    });
}

/**
 * Prefetches person's manga work for server-side rendering
 */
export async function prefetchPersonManga({
    slug,
    paginationArgs,
    ...rest
}: PrefetchInfiniteQueryParams<PersonMangaPaginationResponse> &
    UsePersonMangaParams) {
    return prefetchInfiniteQuery({
        queryKey: queryKeys.people.manga(slug, paginationArgs),
        queryFn: (client, page = paginationArgs?.page || 1) =>
            client.people.getPersonManga(slug, {
                page,
                size: paginationArgs?.size,
            }),
        ...rest,
    });
}

export interface UsePersonNovelParams {
    slug: string;
}

/**
 * Hook for getting person's novel work
 */
export function usePersonNovel({
    slug,
    paginationArgs,
    ...rest
}: UsePersonNovelParams & InfiniteQueryParams<PersonNovelPaginationResponse>) {
    return useInfiniteQuery({
        queryKey: queryKeys.people.novel(slug, paginationArgs),
        queryFn: (client, page = paginationArgs?.page || 1) =>
            client.people.getPersonNovel(slug, {
                page,
                size: paginationArgs?.size,
            }),
        ...rest,
    });
}

/**
 * Prefetches person's novel work for server-side rendering
 */
export async function prefetchPersonNovel({
    slug,
    paginationArgs,
    ...rest
}: PrefetchInfiniteQueryParams<PersonNovelPaginationResponse> &
    UsePersonNovelParams) {
    return prefetchInfiniteQuery({
        queryKey: queryKeys.people.novel(slug, paginationArgs),
        queryFn: (client, page = paginationArgs?.page || 1) =>
            client.people.getPersonNovel(slug, {
                page,
                size: paginationArgs?.size,
            }),
        ...rest,
    });
}

export interface UsePersonCharactersParams {
    slug: string;
}

/**
 * Hook for getting characters voiced by this person
 */
export function usePersonCharacters({
    slug,
    paginationArgs,
    ...rest
}: UsePersonCharactersParams &
    InfiniteQueryParams<PersonCharactersPaginationResponse>) {
    return useInfiniteQuery({
        queryKey: queryKeys.people.characters(slug, paginationArgs),
        queryFn: (client, page = paginationArgs?.page || 1) =>
            client.people.getPersonCharacters(slug, {
                page,
                size: paginationArgs?.size,
            }),
        ...rest,
    });
}

/**
 * Prefetches characters voiced by this person for server-side rendering
 */
export async function prefetchPersonCharacters({
    slug,
    paginationArgs,
    ...rest
}: PrefetchInfiniteQueryParams<PersonCharactersPaginationResponse> &
    UsePersonCharactersParams) {
    return prefetchInfiniteQuery({
        queryKey: queryKeys.people.characters(slug, paginationArgs),
        queryFn: (client, page = paginationArgs?.page || 1) =>
            client.people.getPersonCharacters(slug, {
                page,
                size: paginationArgs?.size,
            }),
        ...rest,
    });
}
