import { EditsTopPaginationResponse } from '@hikka/client';
import { QueryClient, UseQueryOptions } from '@tanstack/react-query';

import { prefetchQuery } from '../../server/prefetchQuery';
import { queryKeys } from '../core/queryKeys';
import { useQuery } from '../core/useQuery';

export interface UseEditsTopOptions
    extends Omit<
        UseQueryOptions<
            EditsTopPaginationResponse,
            Error,
            EditsTopPaginationResponse,
            ReturnType<typeof queryKeys.stats.editsTop>
        >,
        'queryKey' | 'queryFn'
    > {
    page?: number;
    size?: number;
}

/**
 * Hook for getting top editors by edit count
 */
export function useEditsTop(params: UseEditsTopOptions = {}) {
    const { page = 1, size = 15, ...queryOptions } = params;

    return useQuery(
        queryKeys.stats.editsTop(),
        (client) => client.stats.getEditsTop(page, size),
        queryOptions,
    );
}

export interface PrefetchEditsTopParams extends UseEditsTopOptions {
    queryClient: QueryClient;
}

export async function prefetchEditsTop(params: PrefetchEditsTopParams) {
    const { queryClient, page = 1, size = 15, ...queryOptions } = params;

    return await prefetchQuery(
        queryClient,
        queryKeys.stats.editsTop(),
        (client) => client.stats.getEditsTop(page, size),
        queryOptions,
    );
}
