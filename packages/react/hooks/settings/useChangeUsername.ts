import { UserResponse, UsernameArgs } from '@hikka/client';
import { UseMutationOptions, UseMutationResult } from '@tanstack/react-query';

import { queryKeys } from '../core/queryKeys';
import { createMutation } from '../core/useMutation';

/**
 * Hook for changing username
 */
export function useChangeUsername(
    options?: Omit<
        UseMutationOptions<UserResponse, Error, UsernameArgs>,
        'mutationFn'
    >,
): UseMutationResult<UserResponse, Error, UsernameArgs> {
    return createMutation<UserResponse, Error, UsernameArgs>(
        (client, args) => client.settings.changeUsername(args),
        () => [
            // Invalidate user profile
            queryKeys.user.me(),
        ],
    )(options);
}
