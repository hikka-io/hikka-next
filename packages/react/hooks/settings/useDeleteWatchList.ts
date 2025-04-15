import { SuccessResponse } from '@hikka/client';
import { UseMutationOptions, UseMutationResult } from '@tanstack/react-query';

import { queryKeys } from '../core/queryKeys';
import { createMutation } from '../core/useMutation';

/**
 * Hook for deleting a user's entire watch list
 */
export function useDeleteWatchList(
    options?: Omit<
        UseMutationOptions<SuccessResponse, Error, void>,
        'mutationFn'
    >,
): UseMutationResult<SuccessResponse, Error, void> {
    return createMutation<SuccessResponse, Error, void>(
        (client) => client.settings.deleteWatchList(),
        () => [
            // Invalidate all watch-related queries
            queryKeys.watch.all,
            // Invalidate watch stats for the current user
            queryKeys.watch.stats(''),
        ],
    )(options);
}
