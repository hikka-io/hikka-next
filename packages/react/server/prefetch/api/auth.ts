import {
    authTokenDetailsOptions,
    oAuthProviderUrlOptions,
    thirdPartyTokenListOptions,
} from '@/options/api/auth';
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
}: PrefetchQueryParams = {}) {
    return prefetchQuery({
        optionsFactory: (client) => authTokenDetailsOptions(client),
        ...rest,
    });
}

/**
 * Prefetches OAuth URL for server-side rendering
 */
export async function prefetchOAuthProviderUrl({
    provider,
    ...rest
}: PrefetchQueryParams & UseOAuthProviderUrlParams) {
    return prefetchQuery({
        optionsFactory: (client) =>
            oAuthProviderUrlOptions(client, { provider }),
        ...rest,
    });
}

/**
 * Prefetches third-party tokens for server-side rendering
 */
export async function prefetchThirdPartyTokenList({
    paginationArgs,
    ...rest
}: PrefetchInfiniteQueryParams & UseThirdPartyTokenListParams) {
    return prefetchInfiniteQuery({
        optionsFactory: (client) =>
            thirdPartyTokenListOptions(client, { paginationArgs }),
        ...rest,
    });
}
