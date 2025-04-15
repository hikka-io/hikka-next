import { PasswordArgs, UserResponse } from '@hikka/client';
import { UseMutationOptions, UseMutationResult } from '@tanstack/react-query';

import { createMutation } from '../core/useMutation';

/**
 * Hook for changing user password
 */
export function useChangePassword(
    options?: Omit<
        UseMutationOptions<UserResponse, Error, PasswordArgs>,
        'mutationFn'
    >,
): UseMutationResult<UserResponse, Error, PasswordArgs> {
    return createMutation<UserResponse, Error, PasswordArgs>(
        (client, args) => client.settings.changePassword(args),
        // No need to invalidate any queries here since password change doesn't affect stored data
    )(options);
}
