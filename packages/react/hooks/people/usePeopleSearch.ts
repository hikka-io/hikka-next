import {
    PaginationArgs,
    PersonSearchPaginationResponse,
    QuerySearchArgs,
} from '@hikka/client';
import { FetchInfiniteQueryOptions, QueryClient } from '@tanstack/query-core';
import { UseInfiniteQueryOptions } from '@tanstack/react-query';

import { queryKeys } from '../../core/queryKeys';
import { useInfiniteQuery } from '../../core/useInfiniteQuery';
import { prefetchInfiniteQuery } from '../../server/prefetchInfiniteQuery';

/**
 * Hook for searching people
 */
export function usePeopleSearch(
    args: QuerySearchArgs = {},
    paginationArgs?: PaginationArgs,
    options?: Omit<
        UseInfiniteQueryOptions<
            PersonSearchPaginationResponse,
            Error,
            PersonSearchPaginationResponse,
            PersonSearchPaginationResponse,
            readonly unknown[],
            number
        >,
        'queryKey' | 'queryFn' | 'initialPageParam' | 'getNextPageParam'
    >,
) {
    return useInfiniteQuery({
        queryKey: queryKeys.people.search(args, paginationArgs),
        queryFn: (client, page = paginationArgs?.page || 1) =>
            client.people.search(args, {
                page,
                size: paginationArgs?.size,
            }),
        options: options || {},
    });
}

/**
 * Function for prefetching people search results
 */
export async function prefetchPeopleSearch(
    queryClient: QueryClient,
    args: QuerySearchArgs = {},
    paginationArgs?: PaginationArgs,
    options?: Omit<
        FetchInfiniteQueryOptions<
            PersonSearchPaginationResponse,
            Error,
            PersonSearchPaginationResponse,
            readonly unknown[],
            number
        >,
        'queryKey' | 'queryFn' | 'initialPageParam' | 'getNextPageParam'
    >,
) {
    return prefetchInfiniteQuery({
        queryClient,
        queryKey: queryKeys.people.search(args, paginationArgs),
        queryFn: (client, page = paginationArgs?.page || 1) =>
            client.people.search(args, {
                page,
                size: paginationArgs?.size,
            }),
        options: options || {},
    });
}
