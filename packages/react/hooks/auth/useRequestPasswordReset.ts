import { EmailArgs, UserResponse } from '@hikka/client';
import { UseMutationOptions, UseMutationResult } from '@tanstack/react-query';

import { createMutation } from '../core/useMutation';

export interface UseRequestPasswordResetOptions
    extends Omit<
        UseMutationOptions<UserResponse, Error, EmailArgs>,
        'mutationFn'
    > {}

/**
 * Hook for requesting a password reset
 */
export function useRequestPasswordReset(
    params: UseRequestPasswordResetOptions = {},
): UseMutationResult<UserResponse, Error, EmailArgs> {
    return createMutation<UserResponse, Error, EmailArgs>((client, args) =>
        client.auth.requestPasswordReset(args),
    )(params);
}
