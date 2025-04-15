import { EmailArgs, UserResponse } from '@hikka/client';
import { UseMutationOptions, UseMutationResult } from '@tanstack/react-query';

import { queryKeys } from '../core/queryKeys';
import { createMutation } from '../core/useMutation';

/**
 * Hook for changing email
 */
export function useChangeEmail(
    options?: Omit<
        UseMutationOptions<UserResponse, Error, EmailArgs>,
        'mutationFn'
    >,
): UseMutationResult<UserResponse, Error, EmailArgs> {
    return createMutation<UserResponse, Error, EmailArgs>(
        (client, args) => client.settings.changeEmail(args),
        () => [
            // Invalidate user profile
            queryKeys.user.me(),
        ],
    )(options);
}
