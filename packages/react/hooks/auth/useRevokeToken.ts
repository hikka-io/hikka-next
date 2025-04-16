import { AuthTokenInfoResponse } from '@hikka/client';
import { UseMutationOptions, UseMutationResult } from '@tanstack/react-query';

import { queryKeys } from '../core/queryKeys';
import { createMutation } from '../core/useMutation';

export interface UseRevokeTokenOptions
    extends Omit<
        UseMutationOptions<AuthTokenInfoResponse, Error, string>,
        'mutationFn'
    > {}

/**
 * Hook for revoking a token
 */
export function useRevokeToken(
    params: UseRevokeTokenOptions = {},
): UseMutationResult<AuthTokenInfoResponse, Error, string> {
    return createMutation<AuthTokenInfoResponse, Error, string>(
        (client, tokenReference) => client.auth.revokeToken(tokenReference),
        // Update token lists after revocation
        [queryKeys.auth.thirdPartyTokens({})],
    )(params);
}
