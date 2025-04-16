import { UserResponse } from '@hikka/client';
import { UseMutationOptions, UseMutationResult } from '@tanstack/react-query';

import { createMutation } from '../core/useMutation';

export interface UseResendActivationOptions
    extends Omit<UseMutationOptions<UserResponse, Error, void>, 'mutationFn'> {}

/**
 * Hook for resending account activation email
 */
export function useResendActivation(
    params: UseResendActivationOptions = {},
): UseMutationResult<UserResponse, Error, void> {
    return createMutation<UserResponse, Error, void>((client) =>
        client.auth.resendActivation(),
    )(params);
}
