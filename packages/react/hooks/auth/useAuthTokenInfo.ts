import { AuthTokenInfoResponse } from '@hikka/client';
import { FetchQueryOptions, QueryClient } from '@tanstack/query-core';
import { UseQueryOptions } from '@tanstack/react-query';

import { queryKeys } from '../../core/queryKeys';
import { useQuery } from '../../core/useQuery';
import { prefetchQuery } from '../../server/prefetchQuery';

/**
 * Hook for retrieving current auth token info
 */
export function useAuthTokenInfo(
    options?: Omit<
        UseQueryOptions<AuthTokenInfoResponse, Error, AuthTokenInfoResponse>,
        'queryKey' | 'queryFn'
    >,
) {
    return useQuery({
        queryKey: queryKeys.auth.tokenInfo(),
        queryFn: (client) => client.auth.getTokenInfo(),
        options: options || {},
    });
}

/**
 * Prefetches auth token info for server-side rendering
 */
export async function prefetchAuthTokenInfo(
    queryClient: QueryClient,
    options?: Omit<
        FetchQueryOptions<AuthTokenInfoResponse, Error, AuthTokenInfoResponse>,
        'queryKey' | 'queryFn'
    >,
) {
    return prefetchQuery({
        queryClient,
        queryKey: queryKeys.auth.tokenInfo(),
        queryFn: (client) => client.auth.getTokenInfo(),
        options,
    });
}
