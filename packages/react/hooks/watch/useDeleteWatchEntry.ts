import { SuccessResponse } from '@hikka/client';
import { UseMutationOptions, UseMutationResult } from '@tanstack/react-query';

import { queryKeys } from '../core/queryKeys';
import { createMutation } from '../core/useMutation';

/**
 * Hook for deleting a watch entry
 */
export function useDeleteWatchEntry(
    options?: Omit<
        UseMutationOptions<SuccessResponse, Error, string>,
        'mutationFn'
    >,
): UseMutationResult<SuccessResponse, Error, string> {
    return createMutation<SuccessResponse, Error, string>(
        (client, slug) => client.watch.delete(slug),
        (slug) => [
            // Invalidate the specific watch entry
            queryKeys.watch.get(slug),
            // Invalidate watch lists in general
            queryKeys.watch.list('', {}),
            // Invalidate user stats
            queryKeys.watch.stats(''),
        ],
    )(options);
}
