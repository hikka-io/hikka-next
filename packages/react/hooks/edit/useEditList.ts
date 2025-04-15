import { EditPaginationResponse, GetEditListArgs } from '@hikka/client';
import { QueryClient, UseQueryOptions } from '@tanstack/react-query';

import { prefetchQuery } from '@/server/prefetchQuery';

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
    page?: number;
    size?: number;
}

/**
 * Hook for getting a list of edits
 */
export function useEditList<T = any>(
    args: GetEditListArgs = {},
    options: UseEditListOptions<T> = {},
) {
    const { page = 1, size = 15, ...queryOptions } = options;

    return useQuery(
        queryKeys.edit.list(args),
        (client) => client.edit.getEditList<T>(args, page, size),
        queryOptions,
    );
}

export async function prefetchEditList<T = any>(
    queryClient: QueryClient,
    args: GetEditListArgs = {},
    options: UseEditListOptions<T> = {},
) {
    const { page = 1, size = 15, ...queryOptions } = options;

    return await prefetchQuery(
        queryClient,
        queryKeys.edit.list(args),
        (client) => client.edit.getEditList<T>(args, page, size),
        queryOptions,
    );
}
