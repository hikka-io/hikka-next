import { EditResponse, UpdateEditArgs } from '@hikka/client';
import { UseMutationOptions, UseMutationResult } from '@tanstack/react-query';

import { queryKeys } from '../core/queryKeys';
import { createMutation } from '../core/useMutation';

type UpdateEditVariables<T = any> = {
    editId: number | string;
    args: UpdateEditArgs<T>;
};

/**
 * Hook for updating an existing edit
 */
export function useUpdateEdit<T = any, R = any>(
    options?: Omit<
        UseMutationOptions<EditResponse<T, R>, Error, UpdateEditVariables<T>>,
        'mutationFn'
    >,
): UseMutationResult<EditResponse<T, R>, Error, UpdateEditVariables<T>> {
    return createMutation<EditResponse<T, R>, Error, UpdateEditVariables<T>>(
        (client, { editId, args }) =>
            client.edit.updateEdit<T, R>(editId, args),
        (variables) => [
            // Invalidate the specific edit
            queryKeys.edit.details(variables.editId),
            // Invalidate edit list
            queryKeys.edit.all,
        ],
    )(options);
}
