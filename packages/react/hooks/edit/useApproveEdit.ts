import { EditResponse } from '@hikka/client';
import { UseMutationOptions, UseMutationResult } from '@tanstack/react-query';

import { queryKeys } from '../core/queryKeys';
import { createMutation } from '../core/useMutation';

/**
 * Hook for approving an edit
 */
export function useApproveEdit(
    options?: Omit<
        UseMutationOptions<EditResponse, Error, number | string>,
        'mutationFn'
    >,
): UseMutationResult<EditResponse, Error, number | string> {
    return createMutation<EditResponse, Error, number | string>(
        (client, editId) => client.edit.approveEdit(editId),
        (editId) => [
            // Invalidate the specific edit
            queryKeys.edit.details(editId),
            // Invalidate edit list
            queryKeys.edit.all,
        ],
    )(options);
}
