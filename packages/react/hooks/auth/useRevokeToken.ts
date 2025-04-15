import { AuthTokenInfoResponse } from '@hikka/client';
import { UseMutationOptions, UseMutationResult } from '@tanstack/react-query';

import { queryKeys } from '../core/queryKeys';
import { createMutation } from '../core/useMutation';

/**
 * Hook for revoking a token
 */
export function useRevokeToken(
    options?: Omit<
        UseMutationOptions<AuthTokenInfoResponse, Error, string>,
        'mutationFn'
    >,
): UseMutationResult<AuthTokenInfoResponse, Error, string> {
    return createMutation<AuthTokenInfoResponse, Error, string>(
        (client, tokenReference) => client.auth.revokeToken(tokenReference),
        // Update token lists after revocation
        [queryKeys.auth.thirdPartyTokens({})],
    )(options);
}
