import { ImportWatchListArgs, SuccessResponse } from '@hikka/client';
import { UseMutationOptions, UseMutationResult } from '@tanstack/react-query';

import { queryKeys } from '../core/queryKeys';
import { createMutation } from '../core/useMutation';

/**
 * Hook for importing a watch list from an external source
 */
export function useImportWatchList(
    options?: Omit<
        UseMutationOptions<SuccessResponse, Error, ImportWatchListArgs>,
        'mutationFn'
    >,
): UseMutationResult<SuccessResponse, Error, ImportWatchListArgs> {
    return createMutation<SuccessResponse, Error, ImportWatchListArgs>(
        (client, args) => client.settings.importWatchList(args),
        () => [
            // Invalidate all watch-related queries
            queryKeys.watch.all,
            // Invalidate watch stats
            queryKeys.watch.stats(''),
        ],
    )(options);
}
