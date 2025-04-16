import { UserResponse, UsernameArgs } from '@hikka/client';
import { UseMutationOptions, UseMutationResult } from '@tanstack/react-query';

import { queryKeys } from '../core/queryKeys';
import { createMutation } from '../core/useMutation';

export interface UseChangeUsernameOptions
    extends Omit<
        UseMutationOptions<UserResponse, Error, UsernameArgs>,
        'mutationFn'
    > {}

/**
 * Hook for changing username
 */
export function useChangeUsername(
    params: UseChangeUsernameOptions = {},
): UseMutationResult<UserResponse, Error, UsernameArgs> {
    return createMutation<UserResponse, Error, UsernameArgs>(
        (client, args) => client.settings.changeUsername(args),
        () => [
            // Invalidate user profile
            queryKeys.user.me(),
        ],
    )(params);
}
