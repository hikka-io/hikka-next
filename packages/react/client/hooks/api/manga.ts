'use client';

import {
    ContentCharacterPaginationResponse,
    MangaInfoResponse,
    MangaPaginationResponse,
} from '@hikka/client';

import {
    InfiniteQueryParams,
    useInfiniteQuery,
} from '@/client/useInfiniteQuery';
import { QueryParams, useQuery } from '@/client/useQuery';
import { queryKeys } from '@/core';
import {
    UseMangaCharactersParams,
    UseMangaInfoParams,
    UseSearchMangasParams,
} from '@/types/manga';

/**
 * Hook for retrieving manga details by slug
 */
export function useMangaBySlug<TResult = MangaInfoResponse>({
    slug,
    ...rest
}: UseMangaInfoParams & QueryParams<MangaInfoResponse, TResult>) {
    return useQuery<MangaInfoResponse, Error, TResult>({
        queryKey: queryKeys.manga.details(slug),
        queryFn: (client) => client.manga.getMangaBySlug(slug),
        ...rest,
    });
}

/**
 * Hook for retrieving manga characters with pagination
 */
export function useMangaCharacters({
    slug,
    paginationArgs,
    ...rest
}: UseMangaCharactersParams &
    InfiniteQueryParams<ContentCharacterPaginationResponse>) {
    return useInfiniteQuery({
        queryKey: queryKeys.manga.characters(slug, paginationArgs),
        queryFn: (client, page = paginationArgs?.page || 1) =>
            client.manga.getMangaCharacters(slug, {
                page,
                size: paginationArgs?.size,
            }),
        ...rest,
    });
}

/**
 * Hook for searching manga with pagination
 */
export function useSearchMangas({
    args,
    paginationArgs,
    ...rest
}: UseSearchMangasParams & InfiniteQueryParams<MangaPaginationResponse>) {
    return useInfiniteQuery({
        queryKey: queryKeys.manga.search({ args, paginationArgs }),
        queryFn: (client, page = paginationArgs?.page || 1) =>
            client.manga.searchMangas(args, {
                page,
                size: paginationArgs?.size,
            }),
        ...rest,
    });
}
