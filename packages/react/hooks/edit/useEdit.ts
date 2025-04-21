import { EditResponse } from '@hikka/client';
import { FetchQueryOptions, QueryClient } from '@tanstack/query-core';
import { UseQueryOptions } from '@tanstack/react-query';

import { queryKeys } from '../../core/queryKeys';
import { useQuery } from '../../core/useQuery';
import { prefetchQuery } from '../../server/prefetchQuery';

/**
 * Hook for getting edit by ID
 */
export function useEdit<T = any, R = any>(
    editId: number | string,
    options?: Omit<
        UseQueryOptions<EditResponse<T, R>, Error, EditResponse<T, R>>,
        'queryKey' | 'queryFn'
    >,
) {
    return useQuery({
        queryKey: queryKeys.edit.byId(editId),
        queryFn: (client) => client.edit.getEdit<T, R>(editId),
        options: options || {},
    });
}

/**
 * Function for prefetching edit by ID
 */
export async function prefetchEdit<T = any, R = any>(
    queryClient: QueryClient,
    editId: number | string,
    options?: Omit<
        FetchQueryOptions<EditResponse<T, R>, Error, EditResponse<T, R>>,
        'queryKey' | 'queryFn'
    >,
) {
    return prefetchQuery({
        queryClient,
        queryKey: queryKeys.edit.byId(editId),
        queryFn: (client) => client.edit.getEdit<T, R>(editId),
        options: options || {},
    });
}
