'use client';

import {
    ContentCharacterPaginationResponse,
    MangaInfoResponse,
    MangaPaginationResponse,
} from '@hikka/client';

import { useHikkaClient } from '@/client/provider/useHikkaClient';
import {
    InfiniteQueryParams,
    useInfiniteQuery,
} from '@/client/useInfiniteQuery';
import { QueryParams, useQuery } from '@/client/useQuery';
import {
    mangaBySlugOptions,
    mangaCharactersOptions,
    searchMangasOptions,
} from '@/options/api/manga';
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
    const { client } = useHikkaClient();
    return useQuery<MangaInfoResponse, Error, TResult>({
        ...mangaBySlugOptions(client, { slug }),
        ...rest,
    });
}

/**
 * Hook for retrieving manga characters with pagination
 */
export function useMangaCharacters({
    slug,
    paginationArgs = { page: 1, size: 20 },
    ...rest
}: UseMangaCharactersParams &
    InfiniteQueryParams<ContentCharacterPaginationResponse>) {
    const { client } = useHikkaClient();
    const { queryKey, queryFn, initialPageParam, getNextPageParam } =
        mangaCharactersOptions(client, { slug, paginationArgs });
    return useInfiniteQuery({
        queryKey,
        queryFn,
        initialPageParam,
        getNextPageParam,
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
    const { client } = useHikkaClient();
    const { queryKey, queryFn, initialPageParam, getNextPageParam } =
        searchMangasOptions(client, { args, paginationArgs });
    return useInfiniteQuery({
        queryKey,
        queryFn,
        initialPageParam,
        getNextPageParam,
        ...rest,
    });
}
