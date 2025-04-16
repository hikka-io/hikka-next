import { AuthTokenInfoPaginationResponse } from '@hikka/client';
import { QueryClient, UseQueryOptions } from '@tanstack/react-query';

import { prefetchQuery } from '../../server/prefetchQuery';
import { queryKeys } from '../core/queryKeys';
import { useQuery } from '../core/useQuery';

export interface UseThirdPartyTokensOptions
    extends Omit<
        UseQueryOptions<
            AuthTokenInfoPaginationResponse,
            Error,
            AuthTokenInfoPaginationResponse,
            ReturnType<typeof queryKeys.auth.thirdPartyTokens>
        >,
        'queryKey' | 'queryFn'
    > {
    page?: number;
    size?: number;
}

/**
 * Hook for listing third-party tokens
 */
export function useThirdPartyTokens(params: UseThirdPartyTokensOptions = {}) {
    const { page = 1, size = 15, ...queryOptions } = params;

    return useQuery(
        queryKeys.auth.thirdPartyTokens({ page, size }),
        (client) => client.auth.listThirdPartyTokens(page, size),
        queryOptions,
    );
}

export interface PrefetchThirdPartyTokensParams
    extends UseThirdPartyTokensOptions {
    queryClient: QueryClient;
}

export async function prefetchThirdPartyTokens(
    params: PrefetchThirdPartyTokensParams,
) {
    const { queryClient, page = 1, size = 15, ...queryOptions } = params;

    return await prefetchQuery(
        queryClient,
        queryKeys.auth.thirdPartyTokens({ page, size }),
        (client) => client.auth.listThirdPartyTokens(page, size),
        queryOptions,
    );
}
