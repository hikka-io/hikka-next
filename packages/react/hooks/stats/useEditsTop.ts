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
export function useEditsTop(options: UseEditsTopOptions = {}) {
    const { page = 1, size = 15, ...queryOptions } = options;

    return useQuery(
        queryKeys.stats.editsTop(),
        (client) => client.stats.getEditsTop(page, size),
        queryOptions,
    );
}

export async function prefetchEditsTop(
    queryClient: QueryClient,
    options: UseEditsTopOptions = {},
) {
    const { page = 1, size = 15, ...queryOptions } = options;

    return await prefetchQuery(
        queryClient,
        queryKeys.stats.editsTop(),
        (client) => client.stats.getEditsTop(page, size),
        queryOptions,
    );
}
