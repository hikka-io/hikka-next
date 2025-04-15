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
export function useThirdPartyTokens(options: UseThirdPartyTokensOptions = {}) {
    const { page = 1, size = 15, ...queryOptions } = options;

    return useQuery(
        queryKeys.auth.thirdPartyTokens({ page, size }),
        (client) => client.auth.listThirdPartyTokens(page, size),
        queryOptions,
    );
}

export async function prefetchThirdPartyTokens(
    queryClient: QueryClient,
    options: UseThirdPartyTokensOptions = {},
) {
    const { page = 1, size = 15, ...queryOptions } = options;

    return await prefetchQuery(
        queryClient,
        queryKeys.auth.thirdPartyTokens({ page, size }),
        (client) => client.auth.listThirdPartyTokens(page, size),
        queryOptions,
    );
}
