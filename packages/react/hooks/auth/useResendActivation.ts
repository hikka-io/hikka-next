import { UserResponse } from '@hikka/client';
import { UseMutationOptions, UseMutationResult } from '@tanstack/react-query';

import { createMutation } from '../core/useMutation';

/**
 * Hook for resending account activation email
 */
export function useResendActivation(
    options?: Omit<UseMutationOptions<UserResponse, Error, void>, 'mutationFn'>,
): UseMutationResult<UserResponse, Error, void> {
    return createMutation<UserResponse, Error, void>((client) =>
        client.auth.resendActivation(),
    )(options);
}
