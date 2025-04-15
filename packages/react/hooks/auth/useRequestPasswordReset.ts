import { EmailArgs, UserResponse } from '@hikka/client';
import { UseMutationOptions, UseMutationResult } from '@tanstack/react-query';

import { createMutation } from '../core/useMutation';

/**
 * Hook for requesting a password reset
 */
export function useRequestPasswordReset(
    options?: Omit<
        UseMutationOptions<UserResponse, Error, EmailArgs>,
        'mutationFn'
    >,
): UseMutationResult<UserResponse, Error, EmailArgs> {
    return createMutation<UserResponse, Error, EmailArgs>((client, args) =>
        client.auth.requestPasswordReset(args),
    )(options);
}
