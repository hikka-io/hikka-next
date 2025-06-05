import {
    PersonAnimePaginationResponse,
    PersonCharactersPaginationResponse,
    PersonCountResponse,
    PersonMangaPaginationResponse,
    PersonNovelPaginationResponse,
    PersonSearchPaginationResponse,
} from '@hikka/client';

import { queryKeys } from '@/core';
import {
    PrefetchInfiniteQueryParams,
    prefetchInfiniteQuery,
} from '@/server/prefetchInfiniteQuery';
import { PrefetchQueryParams, prefetchQuery } from '@/server/prefetchQuery';
import {
    UsePeopleSearchParams,
    UsePersonAnimeParams,
    UsePersonCharactersParams,
    UsePersonInfoParams,
    UsePersonMangaParams,
    UsePersonNovelParams,
} from '@/types/people';

/**
 * Prefetches person details for server-side rendering
 */
export async function prefetchPersonBySlug({
    slug,
    ...rest
}: PrefetchQueryParams<PersonCountResponse> & UsePersonInfoParams) {
    return prefetchQuery({
        queryKey: queryKeys.people.bySlug(slug),
        queryFn: (client) => client.people.getPersonBySlug(slug),
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

/**
 * Function for prefetching people search results
 */
export async function prefetchSearchPeople({
    args = {},
    paginationArgs,
    ...rest
}: PrefetchInfiniteQueryParams<PersonSearchPaginationResponse> &
    UsePeopleSearchParams) {
    return prefetchInfiniteQuery({
        queryKey: queryKeys.people.search(args, paginationArgs),
        queryFn: (client, page = paginationArgs?.page || 1) =>
            client.people.searchPeople(args, {
                page,
                size: paginationArgs?.size,
            }),
        ...rest,
    });
}
