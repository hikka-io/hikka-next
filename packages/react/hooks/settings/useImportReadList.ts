import { ImportReadListArgs, SuccessResponse } from '@hikka/client';
import { UseMutationOptions, UseMutationResult } from '@tanstack/react-query';

import { queryKeys } from '../core/queryKeys';
import { createMutation } from '../core/useMutation';

/**
 * Hook for importing a read list from an external source
 */
export function useImportReadList(
    options?: Omit<
        UseMutationOptions<SuccessResponse, Error, ImportReadListArgs>,
        'mutationFn'
    >,
): UseMutationResult<SuccessResponse, Error, ImportReadListArgs> {
    return createMutation<SuccessResponse, Error, ImportReadListArgs>(
        (client, args) => client.settings.importReadList(args),
        () => [
            // Invalidate all read-related queries
            queryKeys.read.all,
            // Since we don't know the content type here (manga/novel), invalidate both
            queryKeys.read.stats('manga', ''),
            queryKeys.read.stats('novel', ''),
        ],
    )(options);
}
