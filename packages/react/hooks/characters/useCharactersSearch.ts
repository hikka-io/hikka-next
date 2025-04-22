import {
    CharactersSearchPaginationResponse,
    PaginationArgs,
    QuerySearchArgs,
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
 * Hook for searching characters
 */
export function useCharactersSearch(
    args: QuerySearchArgs = {},
    paginationArgs?: PaginationArgs,
    options?: Omit<
        UseInfiniteQueryOptions<
            CharactersSearchPaginationResponse,
            Error,
            InfiniteData<CharactersSearchPaginationResponse>,
            CharactersSearchPaginationResponse,
            readonly unknown[],
            number
        >,
        'queryKey' | 'queryFn' | 'initialPageParam' | 'getNextPageParam'
    >,
) {
    return useInfiniteQuery({
        queryKey: queryKeys.characters.search(args, paginationArgs),
        queryFn: (client, page = paginationArgs?.page || 1) =>
            client.characters.search(args, {
                page,
                size: paginationArgs?.size,
            }),
        options: options || {},
    });
}

/**
 * Function for prefetching character search results
 */
export async function prefetchCharactersSearch(
    queryClient: QueryClient,
    args: QuerySearchArgs = {},
    paginationArgs?: PaginationArgs,
    options?: Omit<
        FetchInfiniteQueryOptions<
            CharactersSearchPaginationResponse,
            Error,
            CharactersSearchPaginationResponse,
            readonly unknown[],
            number
        >,
        'queryKey' | 'queryFn' | 'initialPageParam' | 'getNextPageParam'
    >,
) {
    return prefetchInfiniteQuery({
        queryClient,
        queryKey: queryKeys.characters.search(args, paginationArgs),
        queryFn: (client, page = paginationArgs?.page || 1) =>
            client.characters.search(args, {
                page,
                size: paginationArgs?.size,
            }),
        options: options || {},
    });
}
