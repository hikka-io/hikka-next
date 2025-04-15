import { TokenArgs, TokenResponse } from '@hikka/client';
import { UseMutationOptions, UseMutationResult } from '@tanstack/react-query';

import { queryKeys } from '../core/queryKeys';
import { createMutation } from '../core/useMutation';

/**
 * Hook for activating an account
 */
export function useActivate(
    options?: Omit<
        UseMutationOptions<TokenResponse, Error, TokenArgs>,
        'mutationFn'
    >,
): UseMutationResult<TokenResponse, Error, TokenArgs> {
    return createMutation<TokenResponse, Error, TokenArgs>(
        (client, args) => client.auth.activate(args),
        // Update user data and token info on successful activation
        [queryKeys.user.me(), queryKeys.auth.tokenInfo()],
    )(options);
}
