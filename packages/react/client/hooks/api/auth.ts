'use client';

import {
    AuthTokenInfoPaginationResponse,
    AuthTokenInfoResponse,
    CaptchaArgs,
    CodeArgs,
    ComfirmResetArgs,
    EmailArgs,
    LoginArgs,
    ProviderUrlResponse,
    SignupArgs,
    TokenArgs,
    TokenProceedArgs,
    TokenRequestArgs,
} from '@hikka/client';

import {
    InfiniteQueryParams,
    useInfiniteQuery,
} from '@/client/useInfiniteQuery';
import { createMutation } from '@/client/useMutation';
import { QueryParams, useQuery } from '@/client/useQuery';
import { queryKeys } from '@/core';
import {
    UseOAuthProviderUrlParams,
    UseThirdPartyTokenListParams,
} from '@/types/auth';

/**
 * Hook for retrieving current auth token info
 */
export function useAuthTokenDetails({
    ...rest
}: QueryParams<AuthTokenInfoResponse> = {}) {
    return useQuery({
        queryKey: queryKeys.auth.tokenInfo(),
        queryFn: (client) => client.auth.getAuthTokenDetails(),
        ...rest,
    });
}

/**
 * Hook for retrieving OAuth URL for a specific provider
 */
export function useOAuthProviderUrl({
    provider,
    ...rest
}: UseOAuthProviderUrlParams & QueryParams<ProviderUrlResponse>) {
    return useQuery({
        queryKey: queryKeys.auth.oauthUrl(provider),
        queryFn: (client) => client.auth.getOAuthProviderUrl(provider),
        ...rest,
    });
}

/**
 * Hook for retrieving third-party tokens with pagination
 */
export function useThirdPartyTokenList({
    paginationArgs,
    ...rest
}: InfiniteQueryParams<AuthTokenInfoPaginationResponse> &
    UseThirdPartyTokenListParams) {
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

type RequestThirdPartyTokenVariables = {
    clientReference: string;
    args: TokenRequestArgs;
};

/**
 * Hook for requesting a third-party token
 */
export const useCreateThirdPartyTokenRequest = createMutation({
    mutationFn: (
        client,
        { clientReference, args }: RequestThirdPartyTokenVariables,
    ) => client.auth.createThirdPartyTokenRequest(clientReference, args),
    invalidateQueries: () => [queryKeys.auth.thirdPartyTokens()],
});

/**
 * Hook for requesting a password reset
 */
export const useCreatePasswordResetRequest = createMutation({
    mutationFn: (client, args: EmailArgs) =>
        client.auth.createPasswordResetRequest(args),
});

/**
 * Hook for user login
 */
export const useCreateUserSession = createMutation({
    mutationFn: (
        client,
        { args, captcha }: { args: LoginArgs; captcha: CaptchaArgs },
    ) => client.auth.createUserSession(args, captcha),
    invalidateQueries: () => [queryKeys.auth.tokenInfo()],
});

/**
 * Hook for user registration
 */
export const useCreateUser = createMutation({
    mutationFn: (
        client,
        { args, captcha }: { args: SignupArgs; captcha: CaptchaArgs },
    ) => client.auth.createUser(args, captcha),
    invalidateQueries: () => [queryKeys.auth.tokenInfo()],
});

/**
 * Hook for account activation
 */
export const useActivateUser = createMutation({
    mutationFn: (client, args: TokenArgs) => client.auth.activateUser(args),
    invalidateQueries: () => [queryKeys.auth.tokenInfo()],
});

/**
 * Hook for resending activation link
 */
export const useCreateActivationRequest = createMutation({
    mutationFn: (client) => client.auth.createActivationRequest(),
});

/**
 * Hook for confirming password reset
 */
export const useConfirmPasswordReset = createMutation({
    mutationFn: (client, args: ComfirmResetArgs) =>
        client.auth.confirmPasswordReset(args),
    invalidateQueries: () => [queryKeys.auth.tokenInfo()],
});

/**
 * Hook for getting token from OAuth code
 */
export const useCreateOAuthToken = createMutation({
    mutationFn: (
        client,
        { provider, args }: { provider: string; args: CodeArgs },
    ) => client.auth.createOAuthToken(provider, args),
    invalidateQueries: () => [queryKeys.auth.tokenInfo()],
});

/**
 * Hook for creating a third-party token
 */
export const useCreateThirdPartyToken = createMutation({
    mutationFn: (client, args: TokenProceedArgs) =>
        client.auth.createThirdPartyToken(args),
    invalidateQueries: () => [queryKeys.auth.thirdPartyTokens()],
});

/**
 * Hook for revoking a token
 */
export const useDeleteAuthToken = createMutation({
    mutationFn: (client, tokenReference: string) =>
        client.auth.deleteAuthToken(tokenReference),
    invalidateQueries: () => [queryKeys.auth.thirdPartyTokens()],
});
