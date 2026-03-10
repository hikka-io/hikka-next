import { HikkaClient, PaginationArgs } from '@hikka/client';
import { infiniteQueryOptions, queryOptions } from '@tanstack/react-query';

import { queryKeys } from '@/core';
import {
    UseEditListParams,
    UseEditParams,
    UseTodoEditListParams,
} from '@/types/edit';

export function editOptions(
    client: HikkaClient,
    { editId }: UseEditParams,
) {
    return queryOptions({
        queryKey: queryKeys.edit.byId(editId),
        queryFn: () => client.edit.getEdit(editId),
    });
}

export function editListOptions(
    client: HikkaClient,
    {
        args = {},
        paginationArgs,
    }: UseEditListParams & { paginationArgs?: PaginationArgs },
) {
    return infiniteQueryOptions({
        queryKey: queryKeys.edit.list(args, paginationArgs),
        queryFn: ({ pageParam }) =>
            client.edit.getEditList(args, {
                page: paginationArgs?.page ?? pageParam,
                size: paginationArgs?.size,
            }),
        initialPageParam: paginationArgs?.page || 1,
        getNextPageParam: (lastPage) => {
            const nextPage = lastPage.pagination.page + 1;
            return nextPage > lastPage.pagination.pages ? null : nextPage;
        },
    });
}

export function todoEditListOptions(
    client: HikkaClient,
    {
        args,
        paginationArgs,
    }: UseTodoEditListParams & { paginationArgs?: PaginationArgs },
) {
    return infiniteQueryOptions({
        queryKey: queryKeys.edit.todoList(args, paginationArgs),
        queryFn: ({ pageParam }) =>
            client.edit.getTodoEditList(args, {
                page: paginationArgs?.page ?? pageParam,
                size: paginationArgs?.size,
            }),
        initialPageParam: paginationArgs?.page || 1,
        getNextPageParam: (lastPage) => {
            const nextPage = lastPage.pagination.page + 1;
            return nextPage > lastPage.pagination.pages ? null : nextPage;
        },
    });
}
