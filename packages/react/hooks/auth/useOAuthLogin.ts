import { CodeArgs, TokenResponse } from '@hikka/client';
import { UseMutationOptions, UseMutationResult } from '@tanstack/react-query';

import { queryKeys } from '../core/queryKeys';
import { createMutation } from '../core/useMutation';

type OAuthLoginVariables = {
    provider: string;
    args: CodeArgs;
};

export interface UseOAuthLoginOptions
    extends Omit<
        UseMutationOptions<TokenResponse, Error, OAuthLoginVariables>,
        'mutationFn'
    > {}

/**
 * Hook for authenticating with an OAuth provider
 */
export function useOAuthLogin(
    params: UseOAuthLoginOptions = {},
): UseMutationResult<TokenResponse, Error, OAuthLoginVariables> {
    return createMutation<TokenResponse, Error, OAuthLoginVariables>(
        (client, { provider, args }) =>
            client.auth.getOAuthToken(provider, args),
        // Update user data and token info on successful OAuth login
        [queryKeys.user.me(), queryKeys.auth.tokenInfo()],
    )(params);
}
