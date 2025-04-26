import {
    EditPaginationResponse,
    EditResponse,
    TodoEditResponse,
} from '@hikka/client';

import { queryKeys } from '@/core';
import {
    PrefetchInfiniteQueryParams,
    prefetchInfiniteQuery,
} from '@/server/prefetchInfiniteQuery';
import { PrefetchQueryParams, prefetchQuery } from '@/server/prefetchQuery';
import {
    UseEditListParams,
    UseEditParams,
    UseTodoEditListParams,
} from '@/types/edit';

/**
 * Function for prefetching edit by ID
 */
export async function prefetchEdit<T = any, R = any>({
    editId,
    ...rest
}: PrefetchQueryParams<EditResponse<T, R>> & UseEditParams) {
    return prefetchQuery({
        queryKey: queryKeys.edit.byId(editId),
        queryFn: (client) => client.edit.getEdit<T, R>(editId),
        ...rest,
    });
}

/**
 * Function for prefetching list of edits
 */
export async function prefetchEditList<T = any>({
    args = {},
    paginationArgs,
    ...rest
}: PrefetchInfiniteQueryParams<EditPaginationResponse<T>> & UseEditListParams) {
    return prefetchInfiniteQuery({
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
 * Function for prefetching list of todo edits
 */
export async function prefetchTodoEditList<T = any>({
    args,
    paginationArgs,
    ...rest
}: PrefetchInfiniteQueryParams<TodoEditResponse<T>> & UseTodoEditListParams) {
    return prefetchInfiniteQuery({
        queryKey: queryKeys.edit.list(args, paginationArgs),
        queryFn: (client, page = paginationArgs?.page || 1) =>
            client.edit.getTodoEditList<T>(args, {
                page,
                size: paginationArgs?.size,
            }),
        ...rest,
    });
}
