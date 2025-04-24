import { EditResponse } from '@hikka/client';

import { queryKeys } from '../../core/queryKeys';
import { QueryParams, useQuery } from '../../core/useQuery';
import { PrefetchQueryParams, prefetchQuery } from '../../server/prefetchQuery';

export interface UseEditParams {
    editId: number | string;
}

/**
 * Hook for getting edit by ID
 */
export function useEdit<TResult = EditResponse<any, any>, T = any, R = any>({
    editId,
    ...rest
}: UseEditParams & QueryParams<EditResponse<T, R>, TResult>) {
    return useQuery<EditResponse<T, R>, Error, TResult>({
        queryKey: queryKeys.edit.byId(editId),
        queryFn: (client) => client.edit.getEdit<T, R>(editId),
        ...rest,
    });
}

/**
 * Function for prefetching edit by ID
 */
export async function prefetchEdit<T = any, R = any>({
    editId,
    ...rest
}: PrefetchQueryParams<EditResponse<T, R>> & UseEditParams) {
    return prefetchQuery({
        queryKey: queryKeys.edit.byId(editId),
        queryFn: (client) => client.edit.getEdit<T, R>(editId),
        ...rest,
    });
}
