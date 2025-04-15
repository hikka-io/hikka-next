import { SuccessResponse } from '@hikka/client';
import { UseMutationOptions, UseMutationResult } from '@tanstack/react-query';

import { queryKeys } from '../core/queryKeys';
import { createMutation } from '../core/useMutation';

/**
 * Hook for deleting a collection
 */
export function useDeleteCollection(
    options?: Omit<
        UseMutationOptions<SuccessResponse, Error, string>,
        'mutationFn'
    >,
): UseMutationResult<SuccessResponse, Error, string> {
    return createMutation<SuccessResponse, Error, string>(
        (client, reference) => client.collections.delete(reference),
        (reference) => [
            // Invalidate the specific collection
            queryKeys.collections.details(reference),
            // Invalidate collections list
            queryKeys.collections.all,
        ],
    )(options);
}
