import { AuthTokenInfoResponse } from '@hikka/client';

import { queryKeys } from '../../core/queryKeys';
import { QueryParams, useQuery } from '../../core/useQuery';
import { PrefetchQueryParams, prefetchQuery } from '../../server/prefetchQuery';

/**
 * Hook for retrieving current auth token info
 */
export function useAuthTokenInfo({
    ...rest
}: QueryParams<AuthTokenInfoResponse> = {}) {
    return useQuery({
        queryKey: queryKeys.auth.tokenInfo(),
        queryFn: (client) => client.auth.getTokenInfo(),
        ...rest,
    });
}

/**
 * Prefetches auth token info for server-side rendering
 */
export async function prefetchAuthTokenInfo({
    ...rest
}: PrefetchQueryParams<AuthTokenInfoResponse> = {}) {
    return prefetchQuery({
        queryKey: queryKeys.auth.tokenInfo(),
        queryFn: (client) => client.auth.getTokenInfo(),
        ...rest,
    });
}
