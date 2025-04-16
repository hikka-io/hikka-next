import { EditPaginationResponse, GetEditListArgs } from '@hikka/client';
import { QueryClient, UseQueryOptions } from '@tanstack/react-query';

import { prefetchQuery } from '../../server/prefetchQuery';
import { queryKeys } from '../core/queryKeys';
import { useQuery } from '../core/useQuery';

export interface UseEditListOptions<T = any>
    extends Omit<
        UseQueryOptions<
            EditPaginationResponse<T>,
            Error,
            EditPaginationResponse<T>,
            ReturnType<typeof queryKeys.edit.list>
        >,
        'queryKey' | 'queryFn'
    > {
    args?: GetEditListArgs;
    page?: number;
    size?: number;
}

/**
 * Hook for getting a list of edits
 */
export function useEditList<T = any>(params: UseEditListOptions<T> = {}) {
    const { args = {}, page = 1, size = 15, ...queryOptions } = params;

    return useQuery(
        queryKeys.edit.list(args),
        (client) => client.edit.getEditList<T>(args, page, size),
        queryOptions,
    );
}

export interface PrefetchEditListParams<T = any> extends UseEditListOptions<T> {
    queryClient: QueryClient;
}

export async function prefetchEditList<T = any>(
    params: PrefetchEditListParams<T>,
) {
    const {
        queryClient,
        args = {},
        page = 1,
        size = 15,
        ...queryOptions
    } = params;

    return await prefetchQuery(
        queryClient,
        queryKeys.edit.list(args),
        (client) => client.edit.getEditList<T>(args, page, size),
        queryOptions,
    );
}
