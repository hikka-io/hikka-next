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
 * Hook for accepting an edit
 */
export const useAcceptEdit = createMutation({
    mutationFn: (client, editId: number | string) =>
        client.edit.acceptEdit(editId),
    invalidateQueries: (editId) => [
        queryKeys.edit.all,
        queryKeys.edit.byId(editId),
    ],
});

/**
 * Hook for denying an edit
 */
export const useDenyEdit = createMutation({
    mutationFn: (client, editId: number | string) =>
        client.edit.denyEdit(editId),
    invalidateQueries: (editId) => [
        queryKeys.edit.all,
        queryKeys.edit.byId(editId),
    ],
});

/**
 * Hook for closing an edit
 */
export const useCloseEdit = createMutation({
    mutationFn: (client, editId: number | string) =>
        client.edit.closeEdit(editId),
    invalidateQueries: (editId) => [
        queryKeys.edit.all,
        queryKeys.edit.byId(editId),
    ],
});
