import { AuthTokenInfoPaginationResponse, PaginationArgs } from '@hikka/client';
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
 * Hook for retrieving third-party tokens with pagination
 */
export function useAuthThirdPartyTokens(
    paginationArgs?: PaginationArgs,
    options?: Omit<
        UseInfiniteQueryOptions<
            AuthTokenInfoPaginationResponse,
            Error,
            InfiniteData<AuthTokenInfoPaginationResponse>,
            AuthTokenInfoPaginationResponse,
            readonly unknown[],
            number
        >,
        'queryKey' | 'queryFn' | 'initialPageParam' | 'getNextPageParam'
    >,
) {
    return useInfiniteQuery({
        queryKey: queryKeys.auth.thirdPartyTokens(paginationArgs),
        queryFn: (client, page = paginationArgs?.page || 1) =>
            client.auth.listThirdPartyTokens({
                page,
                size: paginationArgs?.size,
            }),
        options,
    });
}

/**
 * Prefetches third-party tokens for server-side rendering
 */
export async function prefetchAuthThirdPartyTokens(
    queryClient: QueryClient,
    paginationArgs?: PaginationArgs,
    options?: Omit<
        FetchInfiniteQueryOptions<
            AuthTokenInfoPaginationResponse,
            Error,
            AuthTokenInfoPaginationResponse,
            readonly unknown[],
            number
        >,
        'queryKey' | 'queryFn' | 'initialPageParam' | 'getNextPageParam'
    >,
) {
    return prefetchInfiniteQuery({
        queryClient,
        queryKey: queryKeys.auth.thirdPartyTokens(paginationArgs),
        queryFn: (client, page = paginationArgs?.page || 1) =>
            client.auth.listThirdPartyTokens({
                page,
                size: paginationArgs?.size,
            }),
        options,
    });
}
