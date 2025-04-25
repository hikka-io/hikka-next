import { AuthTokenInfoPaginationResponse } from '@hikka/client';

import { queryKeys } from '../../core/queryKeys';
import {
    InfiniteQueryParams,
    useInfiniteQuery,
} from '../../core/useInfiniteQuery';
import {
    PrefetchInfiniteQueryParams,
    prefetchInfiniteQuery,
} from '../../server/prefetchInfiniteQuery';

/**
 * Hook for retrieving third-party tokens with pagination
 */
export function useAuthThirdPartyTokens({
    paginationArgs,
    ...rest
}: InfiniteQueryParams<AuthTokenInfoPaginationResponse> = {}) {
    return useInfiniteQuery({
        queryKey: queryKeys.auth.thirdPartyTokens(paginationArgs),
        queryFn: (client, page = paginationArgs?.page || 1) =>
            client.auth.getThirdPartyTokenList({
                page,
                size: paginationArgs?.size,
            }),
        ...rest,
    });
}

/**
 * Prefetches third-party tokens for server-side rendering
 */
export async function prefetchAuthThirdPartyTokens({
    paginationArgs,
    ...rest
}: PrefetchInfiniteQueryParams<AuthTokenInfoPaginationResponse> = {}) {
    return prefetchInfiniteQuery({
        queryKey: queryKeys.auth.thirdPartyTokens(paginationArgs),
        queryFn: (client, page = paginationArgs?.page || 1) =>
            client.auth.getThirdPartyTokenList({
                page,
                size: paginationArgs?.size,
            }),
        ...rest,
    });
}
