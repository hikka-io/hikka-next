import {
    AuthTokenInfoPaginationResponse,
    AuthTokenInfoResponse,
    ProviderUrlResponse,
} from '@hikka/client';

import { queryKeys } from '@/core';
import {
    PrefetchInfiniteQueryParams,
    prefetchInfiniteQuery,
} from '@/server/prefetchInfiniteQuery';
import { PrefetchQueryParams, prefetchQuery } from '@/server/prefetchQuery';
import {
    UseOAuthProviderUrlParams,
    UseThirdPartyTokenListParams,
} from '@/types/auth';

/**
 * Prefetches auth token info for server-side rendering
 */
export async function prefetchAuthTokenDetails({
    ...rest
}: PrefetchQueryParams<AuthTokenInfoResponse> = {}) {
    return prefetchQuery({
        queryKey: queryKeys.auth.tokenInfo(),
        queryFn: (client) => client.auth.getAuthTokenDetails(),
        ...rest,
    });
}

/**
 * Prefetches OAuth URL for server-side rendering
 */
export async function prefetchOAuthProviderUrl({
    provider,
    ...rest
}: PrefetchQueryParams<ProviderUrlResponse> & UseOAuthProviderUrlParams) {
    return prefetchQuery({
        queryKey: queryKeys.auth.oauthUrl(provider),
        queryFn: (client) => client.auth.getOAuthProviderUrl(provider),
        ...rest,
    });
}

/**
 * Prefetches third-party tokens for server-side rendering
 */
export async function prefetchThirdPartyTokenList({
    paginationArgs,
    ...rest
}: PrefetchInfiniteQueryParams<AuthTokenInfoPaginationResponse> &
    UseThirdPartyTokenListParams) {
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
