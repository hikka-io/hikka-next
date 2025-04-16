import { AuthTokenInfoResponse } from '@hikka/client';
import { QueryClient, UseQueryOptions } from '@tanstack/react-query';

import { prefetchQuery } from '../../server/prefetchQuery';
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
export function useTokenInfo(params: UseTokenInfoOptions = {}) {
    return useQuery(
        queryKeys.auth.tokenInfo(),
        (client) => client.auth.getTokenInfo(),
        params,
    );
}

export interface PrefetchTokenInfoParams extends UseTokenInfoOptions {
    queryClient: QueryClient;
}

export async function prefetchTokenInfo(params: PrefetchTokenInfoParams) {
    const { queryClient, ...options } = params;

    return await prefetchQuery(
        queryClient,
        queryKeys.auth.tokenInfo(),
        (client) => client.auth.getTokenInfo(),
        options,
    );
}
