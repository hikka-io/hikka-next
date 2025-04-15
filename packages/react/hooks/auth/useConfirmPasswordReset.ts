import { ComfirmResetArgs, TokenResponse } from '@hikka/client';
import { UseMutationOptions, UseMutationResult } from '@tanstack/react-query';

import { queryKeys } from '../core/queryKeys';
import { createMutation } from '../core/useMutation';

/**
 * Hook for confirming a password reset
 */
export function useConfirmPasswordReset(
    options?: Omit<
        UseMutationOptions<TokenResponse, Error, ComfirmResetArgs>,
        'mutationFn'
    >,
): UseMutationResult<TokenResponse, Error, ComfirmResetArgs> {
    return createMutation<TokenResponse, Error, ComfirmResetArgs>(
        (client, args) => client.auth.confirmPasswordReset(args),
        // Update user data and token info on successful password reset
        [queryKeys.user.me(), queryKeys.auth.tokenInfo()],
    )(options);
}
