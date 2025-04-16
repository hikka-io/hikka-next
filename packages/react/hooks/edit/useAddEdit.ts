import { AddEditArgs, EditResponse } from '@hikka/client';
import { UseMutationOptions, UseMutationResult } from '@tanstack/react-query';

import { queryKeys } from '../core/queryKeys';
import { createMutation } from '../core/useMutation';

export interface UseAddEditOptions<T = any, R = any>
    extends Omit<
        UseMutationOptions<EditResponse<T, R>, Error, AddEditArgs<T>>,
        'mutationFn'
    > {}

/**
 * Hook for adding an edit to content
 */
export function useAddEdit<T = any, R = any>(
    params: UseAddEditOptions<T, R> = {},
): UseMutationResult<EditResponse<T, R>, Error, AddEditArgs<T>> {
    return createMutation<EditResponse<T, R>, Error, AddEditArgs<T>>(
        (client, args) => client.edit.addEdit<T, R>(args),
        () => [
            // Invalidate edit list
            queryKeys.edit.all,
        ],
    )(params);
}
