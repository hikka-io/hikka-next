import { WatchArgs, WatchResponse } from '@hikka/client';
import { UseMutationOptions, UseMutationResult } from '@tanstack/react-query';

import { queryKeys } from '../core/queryKeys';
import { createMutation } from '../core/useMutation';

type UpdateWatchEntryVariables = {
    slug: string;
    args: WatchArgs;
};

/**
 * Hook for adding or updating a watch entry
 */
export function useUpdateWatchEntry(
    options?: Omit<
        UseMutationOptions<WatchResponse, Error, UpdateWatchEntryVariables>,
        'mutationFn'
    >,
): UseMutationResult<WatchResponse, Error, UpdateWatchEntryVariables> {
    return createMutation<WatchResponse, Error, UpdateWatchEntryVariables>(
        (client, { slug, args }) => client.watch.addOrUpdate(slug, args),
        (variables) => [
            // Invalidate the specific watch entry
            queryKeys.watch.get(variables.slug),
            // Invalidate watch lists in general
            queryKeys.watch.list('', {}),
            // Invalidate user stats
            queryKeys.watch.stats(''),
        ],
    )(options);
}
