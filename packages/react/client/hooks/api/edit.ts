'use client';

import {
    AddEditArgs,
    ContentTypeEnum,
    EditPaginationResponse,
    EditResponse,
    TodoEditResponse,
    UpdateEditArgs,
} from '@hikka/client';
import { QueryClient } from '@tanstack/react-query';

import { useHikkaClient } from '@/client/provider/useHikkaClient';
import {
    InfiniteQueryParams,
    useInfiniteQuery,
} from '@/client/useInfiniteQuery';
import { createMutation } from '@/client/useMutation';
import { QueryParams, useQuery } from '@/client/useQuery';
import { queryKeys } from '@/core';
import {
    editListOptions,
    editOptions,
    todoEditListOptions,
} from '@/options/api/edit';
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
    const { client } = useHikkaClient();
    return useQuery<EditResponse<T, R>, Error, TResult>({
        ...editOptions(client, { editId }),
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
    const { client } = useHikkaClient();
    const { queryKey, queryFn, initialPageParam, getNextPageParam } =
        editListOptions(client, { args, paginationArgs });
    return useInfiniteQuery({
        queryKey,
        queryFn,
        initialPageParam,
        getNextPageParam,
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
    const { client } = useHikkaClient();
    const { queryKey, queryFn, initialPageParam, getNextPageParam } =
        todoEditListOptions(client, { args, paginationArgs });
    return useInfiniteQuery({
        queryKey,
        queryFn,
        initialPageParam,
        getNextPageParam,
        ...rest,
    });
}

function invalidateContentQueries({
    data,
    queryClient,
}: {
    data: EditResponse;
    queryClient: QueryClient;
}) {
    const slug = data.content?.slug;
    if (!slug) return;

    const contentKeyMap: Partial<
        Record<ContentTypeEnum, readonly unknown[]>
    > = {
        [ContentTypeEnum.ANIME]: queryKeys.anime.details(slug),
        [ContentTypeEnum.MANGA]: queryKeys.manga.details(slug),
        [ContentTypeEnum.NOVEL]: queryKeys.novel.details(slug),
        [ContentTypeEnum.CHARACTER]: queryKeys.characters.bySlug(slug),
        [ContentTypeEnum.PERSON]: queryKeys.people.bySlug(slug),
    };

    const queryKey = contentKeyMap[data.content_type];
    if (queryKey) {
        queryClient.invalidateQueries({ queryKey, exact: false });
    }
}

/**
 * Hook for adding an edit to content
 */
export const useCreateEdit = createMutation({
    mutationFn: (client, args: AddEditArgs<any>) =>
        client.edit.createEdit(args),
    invalidateQueries: () => [queryKeys.edit.all],
    cacheByQueryKey: invalidateContentQueries,
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
    cacheByQueryKey: invalidateContentQueries,
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
