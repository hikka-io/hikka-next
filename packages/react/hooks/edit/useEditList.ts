import {
    EditPaginationResponse,
    GetEditListArgs,
    PaginationArgs,
} from '@hikka/client';
import {
    FetchInfiniteQueryOptions,
    InfiniteData,
    QueryClient,
} from '@tanstack/query-core';
import { UseInfiniteQueryOptions } from '@tanstack/react-query';

import { queryKeys } from '../../core/queryKeys';
import { useInfiniteQuery } from '../../core/useInfiniteQuery';
import { prefetchInfiniteQuery } from '../../server/prefetchInfiniteQuery';

/**
 * Hook for getting a list of edits
 */
export function useEditList<T = any>(
    args: GetEditListArgs = {},
    paginationArgs?: PaginationArgs,
    options?: Omit<
        UseInfiniteQueryOptions<
            EditPaginationResponse<T>,
            Error,
            InfiniteData<EditPaginationResponse<T>>,
            EditPaginationResponse<T>,
            readonly unknown[],
            number
        >,
        'queryKey' | 'queryFn' | 'initialPageParam' | 'getNextPageParam'
    >,
) {
    return useInfiniteQuery({
        queryKey: queryKeys.edit.list(args, paginationArgs),
        queryFn: (client, page = paginationArgs?.page || 1) =>
            client.edit.getEditList<T>(args, {
                page,
                size: paginationArgs?.size,
            }),
        options: options || {},
    });
}

/**
 * Function for prefetching list of edits
 */
export async function prefetchEditList<T = any>(
    queryClient: QueryClient,
    args: GetEditListArgs = {},
    paginationArgs?: PaginationArgs,
    options?: Omit<
        FetchInfiniteQueryOptions<
            EditPaginationResponse<T>,
            Error,
            EditPaginationResponse<T>,
            readonly unknown[],
            number
        >,
        'queryKey' | 'queryFn' | 'initialPageParam' | 'getNextPageParam'
    >,
) {
    return prefetchInfiniteQuery({
        queryClient,
        queryKey: queryKeys.edit.list(args, paginationArgs),
        queryFn: (client, page = paginationArgs?.page || 1) =>
            client.edit.getEditList<T>(args, {
                page,
                size: paginationArgs?.size,
            }),
        options: options || {},
    });
}
