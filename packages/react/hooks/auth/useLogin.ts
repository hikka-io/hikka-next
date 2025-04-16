import { LoginArgs, TokenResponse } from '@hikka/client';
import { UseMutationOptions, UseMutationResult } from '@tanstack/react-query';

import { queryKeys } from '../core/queryKeys';
import { createMutation } from '../core/useMutation';

type LoginVariables = {
    args: LoginArgs;
    captcha: string;
};

export interface UseLoginOptions
    extends Omit<
        UseMutationOptions<TokenResponse, Error, LoginVariables>,
        'mutationFn'
    > {}

/**
 * Hook for logging in to the application
 */
export function useLogin(
    params: UseLoginOptions = {},
): UseMutationResult<TokenResponse, Error, LoginVariables> {
    return createMutation<TokenResponse, Error, LoginVariables>(
        (client, { args, captcha }) => client.auth.login(args, captcha),
        // Update user data and token info on successful login
        [queryKeys.user.me(), queryKeys.auth.tokenInfo()],
    )(params);
}
