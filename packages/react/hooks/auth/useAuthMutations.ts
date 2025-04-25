import {
    CaptchaArgs,
    CodeArgs,
    ComfirmResetArgs,
    EmailArgs,
    LoginArgs,
    SignupArgs,
    TokenArgs,
    TokenProceedArgs,
    TokenRequestArgs,
} from '@hikka/client';

import { queryKeys } from '../../core/queryKeys';
import { createMutation } from '../../core/useMutation';

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
