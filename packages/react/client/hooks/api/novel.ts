'use client';

import {
    ContentCharacterPaginationResponse,
    NovelInfoResponse,
    NovelPaginationResponse,
} from '@hikka/client';

import { useHikkaClient } from '@/client/provider/useHikkaClient';
import {
    InfiniteQueryParams,
    useInfiniteQuery,
} from '@/client/useInfiniteQuery';
import { QueryParams, useQuery } from '@/client/useQuery';
import {
    novelBySlugOptions,
    novelCharactersOptions,
    searchNovelsOptions,
} from '@/options/api/novel';
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
    const { client } = useHikkaClient();
    return useQuery<NovelInfoResponse, Error, TResult>({
        ...novelBySlugOptions(client, { slug }),
        ...rest,
    });
}

/**
 * Hook for retrieving novel characters
 */
export function useNovelCharacters({
    slug,
    paginationArgs = { page: 1, size: 20 },
    ...rest
}: UseNovelCharactersParams &
    InfiniteQueryParams<ContentCharacterPaginationResponse>) {
    const { client } = useHikkaClient();
    const { queryKey, queryFn, initialPageParam, getNextPageParam } =
        novelCharactersOptions(client, { slug, paginationArgs });
    return useInfiniteQuery({
        queryKey,
        queryFn,
        initialPageParam,
        getNextPageParam,
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
    const { client } = useHikkaClient();
    const { queryKey, queryFn, initialPageParam, getNextPageParam } =
        searchNovelsOptions(client, { args, paginationArgs });
    return useInfiniteQuery({
        queryKey,
        queryFn,
        initialPageParam,
        getNextPageParam,
        ...rest,
    });
}
