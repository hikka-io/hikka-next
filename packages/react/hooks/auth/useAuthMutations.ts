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
export const useRequestThirdPartyToken = createMutation({
    mutationFn: (
        client,
        { clientReference, args }: RequestThirdPartyTokenVariables,
    ) => client.auth.requestThirdPartyToken(clientReference, args),
    invalidateQueries: () => [queryKeys.auth.thirdPartyTokens()],
});

/**
 * Hook for requesting a password reset
 */
export const useRequestPasswordReset = createMutation({
    mutationFn: (client, args: EmailArgs) =>
        client.auth.requestPasswordReset(args),
});

/**
 * Hook for user login
 */
export const useLogin = createMutation({
    mutationFn: (
        client,
        { args, captcha }: { args: LoginArgs; captcha: CaptchaArgs },
    ) => client.auth.login(args, captcha),
    invalidateQueries: () => [queryKeys.auth.tokenInfo()],
});

/**
 * Hook for user registration
 */
export const useSignup = createMutation({
    mutationFn: (
        client,
        { args, captcha }: { args: SignupArgs; captcha: CaptchaArgs },
    ) => client.auth.signup(args, captcha),
    invalidateQueries: () => [queryKeys.auth.tokenInfo()],
});

/**
 * Hook for account activation
 */
export const useActivateAccount = createMutation({
    mutationFn: (client, args: TokenArgs) => client.auth.activate(args),
    invalidateQueries: () => [queryKeys.auth.tokenInfo()],
});

/**
 * Hook for resending activation link
 */
export const useResendActivation = createMutation({
    mutationFn: (client) => client.auth.resendActivation(),
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
export const useOAuthToken = createMutation({
    mutationFn: (
        client,
        { provider, args }: { provider: string; args: CodeArgs },
    ) => client.auth.getOAuthToken(provider, args),
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
export const useRevokeToken = createMutation({
    mutationFn: (client, tokenReference: string) =>
        client.auth.revokeToken(tokenReference),
    invalidateQueries: () => [queryKeys.auth.thirdPartyTokens()],
});
