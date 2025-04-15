import { EditResponse } from '@hikka/client';
import { UseMutationOptions, UseMutationResult } from '@tanstack/react-query';

import { queryKeys } from '../core/queryKeys';
import { createMutation } from '../core/useMutation';

type RejectEditVariables = {
    editId: number | string;
    reason?: string;
};

/**
 * Hook for rejecting an edit
 */
export function useRejectEdit(
    options?: Omit<
        UseMutationOptions<EditResponse, Error, RejectEditVariables>,
        'mutationFn'
    >,
): UseMutationResult<EditResponse, Error, RejectEditVariables> {
    return createMutation<EditResponse, Error, RejectEditVariables>(
        (client, { editId, reason }) => client.edit.rejectEdit(editId, reason),
        (variables) => [
            // Invalidate the specific edit
            queryKeys.edit.details(variables.editId),
            // Invalidate edit list
            queryKeys.edit.all,
        ],
    )(options);
}
