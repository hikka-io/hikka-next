import { EditResponse } from '@hikka/client';
import { QueryClient, UseQueryOptions } from '@tanstack/react-query';

import { prefetchQuery } from '../../server/prefetchQuery';
import { queryKeys } from '../core/queryKeys';
import { useQuery } from '../core/useQuery';

export interface UseEditOptions<T = any, R = any>
    extends Omit<
        UseQueryOptions<
            EditResponse<T, R>,
            Error,
            EditResponse<T, R>,
            ReturnType<typeof queryKeys.edit.details>
        >,
        'queryKey' | 'queryFn'
    > {
    editId: number | string;
}

/**
 * Hook for getting a specific edit by ID
 */
export function useEdit<T = any, R = any>(params: UseEditOptions<T, R>) {
    const { editId, ...options } = params;

    return useQuery(
        queryKeys.edit.details(editId),
        (client) => client.edit.getEdit<T, R>(editId),
        {
            enabled: !!editId,
            ...options,
        },
    );
}

export interface PrefetchEditParams<T = any, R = any>
    extends UseEditOptions<T, R> {
    queryClient: QueryClient;
}

export async function prefetchEdit<T = any, R = any>(
    params: PrefetchEditParams<T, R>,
) {
    const { queryClient, editId, ...options } = params;

    return await prefetchQuery(
        queryClient,
        queryKeys.edit.details(editId),
        (client) => client.edit.getEdit<T, R>(editId),
        options,
    );
}
