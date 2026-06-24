'use client';

import type {
    PersonAnimePaginationResponse,
    PersonCharactersPaginationResponse,
    PersonCountResponse,
    PersonMangaPaginationResponse,
    PersonNovelPaginationResponse,
    PersonSearchPaginationResponse,
} from '@hikka/client';

import type {
    UsePeopleSearchParams,
    UsePersonAnimeParams,
    UsePersonCharactersParams,
    UsePersonInfoParams,
    UsePersonMangaParams,
    UsePersonNovelParams,
} from '@/types/people';
import { useHikkaClient } from '@/client/provider/useHikkaClient';
import {
    type InfiniteQueryParams,
    useInfiniteQuery,
} from '@/client/useInfiniteQuery';
import { type QueryParams, useQuery } from '@/client/useQuery';
import {
    personAnimeOptions,
    personBySlugOptions,
    personCharactersOptions,
    personMangaOptions,
    personNovelOptions,
    searchPeopleOptions,
} from '@/options/api/people';

/**
 * Hook for retrieving person details by slug
 */
export function usePersonBySlug<TResult = PersonCountResponse>({
    slug,
    ...rest
}: UsePersonInfoParams & QueryParams<PersonCountResponse, TResult>) {
    const { client } = useHikkaClient();
    return useQuery<PersonCountResponse, Error, TResult>({
        ...personBySlugOptions(client, { slug }),
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
    const { client } = useHikkaClient();
    const { queryKey, queryFn, initialPageParam, getNextPageParam } =
        searchPeopleOptions(client, { args, paginationArgs });
    return useInfiniteQuery({
        queryKey,
        queryFn,
        initialPageParam,
        getNextPageParam,
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
    const { client } = useHikkaClient();
    const { queryKey, queryFn, initialPageParam, getNextPageParam } =
        personAnimeOptions(client, { slug, paginationArgs });
    return useInfiniteQuery({
        queryKey,
        queryFn,
        initialPageParam,
        getNextPageParam,
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
    const { client } = useHikkaClient();
    const { queryKey, queryFn, initialPageParam, getNextPageParam } =
        personMangaOptions(client, { slug, paginationArgs });
    return useInfiniteQuery({
        queryKey,
        queryFn,
        initialPageParam,
        getNextPageParam,
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
    const { client } = useHikkaClient();
    const { queryKey, queryFn, initialPageParam, getNextPageParam } =
        personNovelOptions(client, { slug, paginationArgs });
    return useInfiniteQuery({
        queryKey,
        queryFn,
        initialPageParam,
        getNextPageParam,
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
    const { client } = useHikkaClient();
    const { queryKey, queryFn, initialPageParam, getNextPageParam } =
        personCharactersOptions(client, { slug, paginationArgs });
    return useInfiniteQuery({
        queryKey,
        queryFn,
        initialPageParam,
        getNextPageParam,
        ...rest,
    });
}
