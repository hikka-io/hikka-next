import { SuccessResponse } from '@hikka/client';
import { UseMutationOptions, UseMutationResult } from '@tanstack/react-query';

import { queryKeys } from '../core/queryKeys';
import { createMutation } from '../core/useMutation';

export interface UseDeleteCollectionOptions
    extends Omit<
        UseMutationOptions<SuccessResponse, Error, string>,
        'mutationFn'
    > {}

/**
 * Hook for deleting a collection
 */
export function useDeleteCollection(
    params: UseDeleteCollectionOptions = {},
): UseMutationResult<SuccessResponse, Error, string> {
    return createMutation<SuccessResponse, Error, string>(
        (client, reference) => client.collections.delete(reference),
        (reference) => [
            // Invalidate the specific collection
            queryKeys.collections.details(reference),
            // Invalidate collections list
            queryKeys.collections.all,
        ],
    )(params);
}
