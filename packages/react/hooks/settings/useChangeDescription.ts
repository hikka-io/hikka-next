import { DescriptionArgs, UserResponse } from '@hikka/client';
import { UseMutationOptions, UseMutationResult } from '@tanstack/react-query';

import { queryKeys } from '../core/queryKeys';
import { createMutation } from '../core/useMutation';

/**
 * Hook for changing user description
 */
export function useChangeDescription(
    options?: Omit<
        UseMutationOptions<UserResponse, Error, DescriptionArgs>,
        'mutationFn'
    >,
): UseMutationResult<UserResponse, Error, DescriptionArgs> {
    return createMutation<UserResponse, Error, DescriptionArgs>(
        (client, args) => client.settings.changeDescription(args),
        () => [
            // Invalidate user profile
            queryKeys.user.me(),
        ],
    )(options);
}
