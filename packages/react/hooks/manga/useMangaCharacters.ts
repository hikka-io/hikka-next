import {
    ContentCharacterPaginationResponse,
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
 * Hook for retrieving manga characters with pagination
 */
export function useMangaCharacters(
    slug: string,
    paginationArgs?: PaginationArgs,
    options?: Omit<
        UseInfiniteQueryOptions<
            ContentCharacterPaginationResponse,
            Error,
            InfiniteData<ContentCharacterPaginationResponse>,
            ContentCharacterPaginationResponse,
            readonly unknown[],
            number
        >,
        'queryKey' | 'queryFn' | 'initialPageParam' | 'getNextPageParam'
    >,
) {
    return useInfiniteQuery({
        queryKey: queryKeys.manga.characters(slug, paginationArgs),
        queryFn: (client, page = paginationArgs?.page || 1) =>
            client.manga.getCharacters(slug, {
                page,
                size: paginationArgs?.size,
            }),
        options,
    });
}

/**
 * Prefetches manga characters for server-side rendering
 */
export async function prefetchMangaCharacters(
    queryClient: QueryClient,
    slug: string,
    paginationArgs?: PaginationArgs,
    options?: Omit<
        FetchInfiniteQueryOptions<
            ContentCharacterPaginationResponse,
            Error,
            ContentCharacterPaginationResponse,
            readonly unknown[],
            number
        >,
        'queryKey' | 'queryFn' | 'initialPageParam' | 'getNextPageParam'
    >,
) {
    return prefetchInfiniteQuery({
        queryClient,
        queryKey: queryKeys.manga.characters(slug, paginationArgs),
        queryFn: (client, page = paginationArgs?.page || 1) =>
            client.manga.getCharacters(slug, {
                page,
                size: paginationArgs?.size,
            }),
        options,
    });
}
