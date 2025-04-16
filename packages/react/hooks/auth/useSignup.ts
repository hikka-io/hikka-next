import { SignupArgs, TokenResponse } from '@hikka/client';
import { UseMutationOptions, UseMutationResult } from '@tanstack/react-query';

import { queryKeys } from '../core/queryKeys';
import { createMutation } from '../core/useMutation';

type SignupVariables = {
    args: SignupArgs;
    captcha: string;
};

export interface UseSignupOptions
    extends Omit<
        UseMutationOptions<TokenResponse, Error, SignupVariables>,
        'mutationFn'
    > {}

/**
 * Hook for registering a new user
 */
export function useSignup(
    params: UseSignupOptions = {},
): UseMutationResult<TokenResponse, Error, SignupVariables> {
    return createMutation<TokenResponse, Error, SignupVariables>(
        (client, { args, captcha }) => client.auth.signup(args, captcha),
        // Update user data and token info on successful signup
        [queryKeys.user.me(), queryKeys.auth.tokenInfo()],
    )(params);
}
