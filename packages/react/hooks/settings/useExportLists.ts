import { UserExportResponse } from '@hikka/client';
import { UseMutationOptions, UseMutationResult } from '@tanstack/react-query';

import { createMutation } from '../core/useMutation';

/**
 * Hook for exporting a user's lists (watch, read, favourites)
 */
export function useExportLists(
    options?: Omit<
        UseMutationOptions<UserExportResponse, Error, void>,
        'mutationFn'
    >,
): UseMutationResult<UserExportResponse, Error, void> {
    return createMutation<UserExportResponse, Error, void>(
        (client) => client.settings.export(),
        // No need to invalidate any queries as this is just an export operation
    )(options);
}
