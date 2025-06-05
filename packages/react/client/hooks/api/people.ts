'use client';

import {
    PersonAnimePaginationResponse,
    PersonCharactersPaginationResponse,
    PersonCountResponse,
    PersonMangaPaginationResponse,
    PersonNovelPaginationResponse,
    PersonSearchPaginationResponse,
} from '@hikka/client';

import {
    InfiniteQueryParams,
    useInfiniteQuery,
} from '@/client/useInfiniteQuery';
import { QueryParams, useQuery } from '@/client/useQuery';
import { queryKeys } from '@/core';
import {
    UsePeopleSearchParams,
    UsePersonAnimeParams,
    UsePersonCharactersParams,
    UsePersonInfoParams,
    UsePersonMangaParams,
    UsePersonNovelParams,
} from '@/types/people';

/**
 * Hook for retrieving person details by slug
 */
export function usePersonBySlug<TResult = PersonCountResponse>({
    slug,
    ...rest
}: UsePersonInfoParams & QueryParams<PersonCountResponse, TResult>) {
    return useQuery<PersonCountResponse, Error, TResult>({
        queryKey: queryKeys.people.bySlug(slug),
        queryFn: (client) => client.people.getPersonBySlug(slug),
        ...rest,
    });
}

/**
 * Hook for searching people
 */
export function useSearchPeople({
    args = {},
    paginationArgs,
    ...rest
}: UsePeopleSearchParams &
    InfiniteQueryParams<PersonSearchPaginationResponse>) {
    return useInfiniteQuery({
        queryKey: queryKeys.people.search(args, paginationArgs),
        queryFn: (client, page = paginationArgs?.page || 1) =>
            client.people.searchPeople(args, {
                page,
                size: paginationArgs?.size,
            }),
        ...rest,
    });
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
