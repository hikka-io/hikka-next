import { AddEditArgs, UpdateEditArgs } from '@hikka/client';

import { queryKeys } from '../../core/queryKeys';
import { createMutation } from '../../core/useMutation';

/**
 * Hook for adding an edit to content
 */
export const useAddEdit = createMutation({
    mutationFn: (client, args: AddEditArgs<any>) => client.edit.addEdit(args),
    invalidateQueries: () => [queryKeys.edit.all],
});

/**
 * Hook for updating an existing edit
 */
export const useUpdateEdit = createMutation({
    mutationFn: (
        client,
        args: { editId: number | string; edit: UpdateEditArgs<any> },
    ) => client.edit.updateEdit(args.editId, args.edit),
    invalidateQueries: (args) => [
        queryKeys.edit.all,
        queryKeys.edit.byId(args.editId),
    ],
});

/**
 * Hook for approving an edit
 */
export const useApproveEdit = createMutation({
    mutationFn: (client, editId: number | string) =>
        client.edit.approveEdit(editId),
    invalidateQueries: (editId) => [
        queryKeys.edit.all,
        queryKeys.edit.byId(editId),
    ],
});

/**
 * Hook for rejecting an edit
 */
export const useRejectEdit = createMutation({
    mutationFn: (client, args: { editId: number | string; reason?: string }) =>
        client.edit.rejectEdit(args.editId, args.reason),
    invalidateQueries: (args) => [
        queryKeys.edit.all,
        queryKeys.edit.byId(args.editId),
    ],
});
