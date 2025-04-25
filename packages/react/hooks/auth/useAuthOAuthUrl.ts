import { ProviderUrlResponse } from '@hikka/client';

import { queryKeys } from '../../core/queryKeys';
import { QueryParams, useQuery } from '../../core/useQuery';
import { PrefetchQueryParams, prefetchQuery } from '../../server/prefetchQuery';

/**
 * Hook for retrieving OAuth URL for a specific provider
 */
export function useAuthOAuthUrl(
    provider: string,
    { ...rest }: QueryParams<ProviderUrlResponse> = {},
) {
    return useQuery({
        queryKey: queryKeys.auth.oauthUrl(provider),
        queryFn: (client) => client.auth.getOAuthProviderUrl(provider),
        ...rest,
    });
}

/**
 * Prefetches OAuth URL for server-side rendering
 */
export async function prefetchAuthOAuthUrl(
    provider: string,
    { ...rest }: PrefetchQueryParams<ProviderUrlResponse> = {},
) {
    return prefetchQuery({
        queryKey: queryKeys.auth.oauthUrl(provider),
        queryFn: (client) => client.auth.getOAuthProviderUrl(provider),
        ...rest,
    });
}
