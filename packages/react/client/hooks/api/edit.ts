'use client';

import {
    AddEditArgs,
    EditPaginationResponse,
    EditResponse,
    TodoEditResponse,
    UpdateEditArgs,
} from '@hikka/client';

import {
    InfiniteQueryParams,
    useInfiniteQuery,
} from '@/client/useInfiniteQuery';
import { createMutation } from '@/client/useMutation';
import { QueryParams, useQuery } from '@/client/useQuery';
import { queryKeys } from '@/core';
import {
    UseEditListParams,
    UseEditParams,
    UseTodoEditListParams,
} from '@/types/edit';

/**
 * Hook for getting edit by ID
 */
export function useEdit<TResult = EditResponse<any, any>, T = any, R = any>({
    editId,
    ...rest
}: UseEditParams & QueryParams<EditResponse<T, R>, TResult>) {
    return useQuery<EditResponse<T, R>, Error, TResult>({
        queryKey: queryKeys.edit.byId(editId),
        queryFn: (client) => client.edit.getEdit<T, R>(editId),
        ...rest,
    });
}

/**
 * Hook for getting a list of edits
 */
export function useEditList<T = any>({
    args = {},
    paginationArgs,
    ...rest
}: UseEditListParams & InfiniteQueryParams<EditPaginationResponse<T>>) {
    return useInfiniteQuery({
        queryKey: queryKeys.edit.list(args, paginationArgs),
        queryFn: (client, page = paginationArgs?.page || 1) =>
            client.edit.getEditList<T>(args, {
                page,
                size: paginationArgs?.size,
            }),
        ...rest,
    });
}

/**
 * Hook for getting a list of todo edits
 */
export function useTodoEditList<T = any>({
    args,
    paginationArgs,
    ...rest
}: UseTodoEditListParams & InfiniteQueryParams<TodoEditResponse<T>>) {
    return useInfiniteQuery({
        queryKey: queryKeys.edit.list(args, paginationArgs),
        queryFn: (client, page = paginationArgs?.page || 1) =>
            client.edit.getTodoEditList<T>(args, {
                page,
                size: paginationArgs?.size,
            }),
        ...rest,
    });
}

/**
 * Hook for adding an edit to content
 */
export const useCreateEdit = createMutation({
    mutationFn: (client, args: AddEditArgs<any>) =>
        client.edit.createEdit(args),
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
