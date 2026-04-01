import {
    AuthTokenInfoResponse,
    HikkaClient,
    PaginationArgs,
    ProviderUrlResponse,
} from '@hikka/client';
import { infiniteQueryOptions, queryOptions } from '@tanstack/react-query';

import { queryKeys } from '@/core';
import { UseOAuthProviderUrlParams } from '@/types/auth';

export function authTokenDetailsOptions(client: HikkaClient) {
    return queryOptions<AuthTokenInfoResponse>({
        queryKey: queryKeys.auth.tokenInfo(),
        queryFn: () => client.auth.getAuthTokenDetails(),
    });
}

export function oAuthProviderUrlOptions(
    client: HikkaClient,
    { provider }: UseOAuthProviderUrlParams,
) {
    return queryOptions<ProviderUrlResponse>({
        queryKey: queryKeys.auth.oauthUrl(provider),
        queryFn: () => client.auth.getOAuthProviderUrl(provider),
    });
}

export function thirdPartyTokenListOptions(
    client: HikkaClient,
    { paginationArgs }: { paginationArgs?: PaginationArgs } = {},
) {
    return infiniteQueryOptions({
        queryKey: queryKeys.auth.thirdPartyTokens(paginationArgs),
        queryFn: ({ pageParam }) =>
            client.auth.getThirdPartyTokenList({
                page: pageParam,
                size: paginationArgs?.size,
            }),
        initialPageParam: paginationArgs?.page || 1,
        getNextPageParam: (lastPage) => {
            const nextPage = lastPage.pagination.page + 1;
            return nextPage > lastPage.pagination.pages ? null : nextPage;
        },
    });
}
