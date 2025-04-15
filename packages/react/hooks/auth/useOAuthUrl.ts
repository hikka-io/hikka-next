import { ProviderUrlResponse } from '@hikka/client';
import { UseQueryOptions, UseQueryResult } from '@tanstack/react-query';

import { useQuery } from '../core/useQuery';

/**
 * Hook for getting an OAuth provider URL
 */
export function useOAuthUrl(
    provider: string,
    options?: Omit<
        UseQueryOptions<ProviderUrlResponse, Error>,
        'queryKey' | 'queryFn'
    >,
): UseQueryResult<ProviderUrlResponse, Error> {
    return useQuery(
        ['auth', 'oauth', provider],
        (client) => client.auth.getOAuthUrl(provider),
        {
            enabled: !!provider,
            ...options,
        },
    );
}
