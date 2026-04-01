import {
    editListOptions,
    editOptions,
    todoEditListOptions,
} from '@/options/api/edit';
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
export async function prefetchEdit({
    editId,
    ...rest
}: PrefetchQueryParams & UseEditParams) {
    return prefetchQuery({
        optionsFactory: (client) => editOptions(client, { editId }),
        ...rest,
    });
}

/**
 * Function for prefetching list of edits
 */
export async function prefetchEditList({
    args = {},
    paginationArgs,
    ...rest
}: PrefetchInfiniteQueryParams & UseEditListParams) {
    return prefetchInfiniteQuery({
        optionsFactory: (client) =>
            editListOptions(client, { args, paginationArgs }),
        ...rest,
    });
}

/**
 * Function for prefetching list of todo edits
 */
export async function prefetchTodoEditList({
    args,
    paginationArgs,
    ...rest
}: PrefetchInfiniteQueryParams & UseTodoEditListParams) {
    return prefetchInfiniteQuery({
        optionsFactory: (client) =>
            todoEditListOptions(client, { args, paginationArgs }),
        ...rest,
    });
}
