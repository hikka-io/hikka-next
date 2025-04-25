// TODO: Implement useTodoEditList
import { TodoEditArgs, TodoEditResponse } from '@hikka/client';

import { queryKeys } from '../../core/queryKeys';
import {
    InfiniteQueryParams,
    useInfiniteQuery,
} from '../../core/useInfiniteQuery';
import {
    PrefetchInfiniteQueryParams,
    prefetchInfiniteQuery,
} from '../../server/prefetchInfiniteQuery';

export interface UseTodoEditListParams {
    args: TodoEditArgs;
}

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
