import { SuccessResponse } from '@hikka/client';
import { UseMutationOptions, UseMutationResult } from '@tanstack/react-query';

import { queryKeys } from '../core/queryKeys';
import { createMutation } from '../core/useMutation';

export interface UseDeleteWatchListOptions
    extends Omit<
        UseMutationOptions<SuccessResponse, Error, void>,
        'mutationFn'
    > {}

/**
 * Hook for deleting a user's entire watch list
 */
export function useDeleteWatchList(
    params: UseDeleteWatchListOptions = {},
): UseMutationResult<SuccessResponse, Error, void> {
    return createMutation<SuccessResponse, Error, void>(
        (client) => client.settings.deleteWatchList(),
        () => [
            // Invalidate all watch-related queries
            queryKeys.watch.all,
            // Invalidate watch stats for the current user
            queryKeys.watch.stats(''),
        ],
    )(params);
}
