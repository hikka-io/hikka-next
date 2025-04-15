import { LoginArgs, TokenResponse } from '@hikka/client';
import { UseMutationOptions, UseMutationResult } from '@tanstack/react-query';

import { queryKeys } from '../core/queryKeys';
import { createMutation } from '../core/useMutation';

type LoginVariables = {
    args: LoginArgs;
    captcha: string;
};

/**
 * Hook for logging in to the application
 */
export function useLogin(
    options?: Omit<
        UseMutationOptions<TokenResponse, Error, LoginVariables>,
        'mutationFn'
    >,
): UseMutationResult<TokenResponse, Error, LoginVariables> {
    return createMutation<TokenResponse, Error, LoginVariables>(
        (client, { args, captcha }) => client.auth.login(args, captcha),
        // Update user data and token info on successful login
        [queryKeys.user.me(), queryKeys.auth.tokenInfo()],
    )(options);
}
