'use client';

import {
    ContentCharacterPaginationResponse,
    NovelInfoResponse,
    NovelPaginationResponse,
} from '@hikka/client';

import {
    InfiniteQueryParams,
    useInfiniteQuery,
} from '@/client/useInfiniteQuery';
import { QueryParams, useQuery } from '@/client/useQuery';
import { queryKeys } from '@/core';
import {
    UseNovelCharactersParams,
    UseNovelInfoParams,
    UseSearchNovelsParams,
} from '@/types/novel';

/**
 * Hook for retrieving novel details by slug
 */
export function useNovelBySlug<TResult = NovelInfoResponse>({
    slug,
    ...rest
}: UseNovelInfoParams & QueryParams<NovelInfoResponse, TResult>) {
    return useQuery<NovelInfoResponse, Error, TResult>({
        queryKey: queryKeys.novel.details(slug),
        queryFn: (client) => client.novel.getNovelBySlug(slug),
        ...rest,
    });
}

/**
 * Hook for retrieving novel characters
 */
export function useNovelCharacters({
    slug,
    paginationArgs,
    ...rest
}: UseNovelCharactersParams &
    InfiniteQueryParams<ContentCharacterPaginationResponse>) {
    return useInfiniteQuery({
        queryKey: queryKeys.novel.characters(slug, paginationArgs),
        queryFn: (client, page = paginationArgs?.page || 1) =>
            client.novel.getNovelCharacters(slug, {
                page,
                size: paginationArgs?.size,
            }),
        ...rest,
    });
}

/**
 * Hook for searching novels
 */
export function useSearchNovels({
    args,
    paginationArgs,
    ...rest
}: UseSearchNovelsParams & InfiniteQueryParams<NovelPaginationResponse>) {
    return useInfiniteQuery({
        queryKey: queryKeys.novel.search({ args, paginationArgs }),
        queryFn: (client, page = paginationArgs?.page || 1) =>
            client.novel.searchNovels(args, {
                page,
                size: paginationArgs?.size,
            }),
        ...rest,
    });
}
