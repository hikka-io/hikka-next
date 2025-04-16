import { ProviderUrlResponse } from '@hikka/client';
import { UseQueryOptions, UseQueryResult } from '@tanstack/react-query';

import { useQuery } from '../core/useQuery';

export interface UseOAuthUrlOptions
    extends Omit<
        UseQueryOptions<ProviderUrlResponse, Error>,
        'queryKey' | 'queryFn'
    > {
    provider: string;
}

/**
 * Hook for getting an OAuth provider URL
 */
export function useOAuthUrl(
    params: UseOAuthUrlOptions,
): UseQueryResult<ProviderUrlResponse, Error> {
    const { provider, ...options } = params;

    return useQuery(
        ['auth', 'oauth', provider],
        (client) => client.auth.getOAuthUrl(provider),
        {
            enabled: !!provider,
            ...options,
        },
    );
}
