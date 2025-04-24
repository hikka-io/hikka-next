import { EditPaginationResponse, GetEditListArgs } from '@hikka/client';

import { queryKeys } from '../../core/queryKeys';
import {
    InfiniteQueryParams,
    useInfiniteQuery,
} from '../../core/useInfiniteQuery';
import {
    PrefetchInfiniteQueryParams,
    prefetchInfiniteQuery,
} from '../../server/prefetchInfiniteQuery';

export interface UseEditListParams {
    args?: GetEditListArgs;
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
