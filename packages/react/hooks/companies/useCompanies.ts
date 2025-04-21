import {
    CompaniesPaginationResponse,
    CompaniesSearchArgs,
    PaginationArgs,
} from '@hikka/client';
import { FetchInfiniteQueryOptions, QueryClient } from '@tanstack/query-core';
import { UseInfiniteQueryOptions } from '@tanstack/react-query';

import { queryKeys } from '../../core/queryKeys';
import { useInfiniteQuery } from '../../core/useInfiniteQuery';
import { prefetchInfiniteQuery } from '../../server/prefetchInfiniteQuery';

/**
 * Hook for searching companies
 */
export function useCompaniesSearch(
    args: CompaniesSearchArgs = {},
    paginationArgs?: PaginationArgs,
    options?: Omit<
        UseInfiniteQueryOptions<
            CompaniesPaginationResponse,
            Error,
            CompaniesPaginationResponse,
            CompaniesPaginationResponse,
            readonly unknown[],
            number
        >,
        'queryKey' | 'queryFn' | 'initialPageParam' | 'getNextPageParam'
    >,
) {
    return useInfiniteQuery({
        queryKey: queryKeys.companies.search(args, paginationArgs),
        queryFn: (client, page = paginationArgs?.page || 1) =>
            client.companies.search(args, {
                page,
                size: paginationArgs?.size,
            }),
        options,
    });
}

/**
 * Prefetches companies search for server-side rendering
 */
export async function prefetchCompaniesSearch(
    queryClient: QueryClient,
    args: CompaniesSearchArgs = {},
    paginationArgs?: PaginationArgs,
    options?: Omit<
        FetchInfiniteQueryOptions<
            CompaniesPaginationResponse,
            Error,
            CompaniesPaginationResponse,
            readonly unknown[],
            number
        >,
        'queryKey' | 'queryFn' | 'initialPageParam' | 'getNextPageParam'
    >,
) {
    return prefetchInfiniteQuery({
        queryClient,
        queryKey: queryKeys.companies.search(args, paginationArgs),
        queryFn: (client, page = paginationArgs?.page || 1) =>
            client.companies.search(args, {
                page,
                size: paginationArgs?.size,
            }),
        options,
    });
}
