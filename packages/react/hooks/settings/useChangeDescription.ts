import { DescriptionArgs, UserResponse } from '@hikka/client';
import { UseMutationOptions, UseMutationResult } from '@tanstack/react-query';

import { queryKeys } from '../core/queryKeys';
import { createMutation } from '../core/useMutation';

export interface UseChangeDescriptionOptions
    extends Omit<
        UseMutationOptions<UserResponse, Error, DescriptionArgs>,
        'mutationFn'
    > {}

/**
 * Hook for changing user description
 */
export function useChangeDescription(
    params: UseChangeDescriptionOptions = {},
): UseMutationResult<UserResponse, Error, DescriptionArgs> {
    return createMutation<UserResponse, Error, DescriptionArgs>(
        (client, args) => client.settings.changeDescription(args),
        () => [
            // Invalidate user profile
            queryKeys.user.me(),
        ],
    )(params);
}
