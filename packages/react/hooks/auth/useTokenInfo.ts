import { AuthTokenInfoResponse } from '@hikka/client';
import { QueryClient, UseQueryOptions } from '@tanstack/react-query';

import { prefetchQuery } from '@/server/prefetchQuery';

import { queryKeys } from '../core/queryKeys';
import { useQuery } from '../core/useQuery';

export interface UseTokenInfoOptions
    extends Omit<
        UseQueryOptions<
            AuthTokenInfoResponse,
            Error,
            AuthTokenInfoResponse,
            ReturnType<typeof queryKeys.auth.tokenInfo>
        >,
        'queryKey' | 'queryFn'
    > {}

/**
 * Hook for getting current token info
 */
export function useTokenInfo(options: UseTokenInfoOptions = {}) {
    return useQuery(
        queryKeys.auth.tokenInfo(),
        (client) => client.auth.getTokenInfo(),
        options,
    );
}

export async function prefetchTokenInfo(
    queryClient: QueryClient,
    options: UseTokenInfoOptions = {},
) {
    return await prefetchQuery(
        queryClient,
        queryKeys.auth.tokenInfo(),
        (client) => client.auth.getTokenInfo(),
        options,
    );
}
