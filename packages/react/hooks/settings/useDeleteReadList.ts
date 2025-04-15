import { ReadDeleteContenType, SuccessResponse } from '@hikka/client';
import { UseMutationOptions, UseMutationResult } from '@tanstack/react-query';

import { queryKeys } from '../core/queryKeys';
import { createMutation } from '../core/useMutation';

/**
 * Hook for deleting a user's read list for a specific content type (manga or novel)
 */
export function useDeleteReadList(
    options?: Omit<
        UseMutationOptions<SuccessResponse, Error, ReadDeleteContenType>,
        'mutationFn'
    >,
): UseMutationResult<SuccessResponse, Error, ReadDeleteContenType> {
    return createMutation<SuccessResponse, Error, ReadDeleteContenType>(
        (client, contentType) => client.settings.deleteReadList(contentType),
        (contentType) => [
            // Invalidate all read-related queries for this content type
            queryKeys.read.all,
            // Invalidate read stats for the current user
            queryKeys.read.stats(contentType, ''),
        ],
    )(options);
}
