import { CollectionsListArgs, CollectionsListResponse } from '@hikka/client';
import { QueryClient, UseQueryOptions } from '@tanstack/react-query';

import { prefetchQuery } from '../../server/prefetchQuery';
import { queryKeys } from '../core/queryKeys';
import { useQuery } from '../core/useQuery';

export interface UseCollectionsOptions
    extends Omit<
        UseQueryOptions<
            CollectionsListResponse,
            Error,
            CollectionsListResponse,
            ReturnType<typeof queryKeys.collections.list>
        >,
        'queryKey' | 'queryFn'
    > {
    page?: number;
    size?: number;
}

/**
 * Hook for getting collections
 */
export function useCollections(
    args: CollectionsListArgs,
    options: UseCollectionsOptions = {},
) {
    const { page = 1, size = 15, ...queryOptions } = options;

    return useQuery(
        queryKeys.collections.list(args),
        (client) => client.collections.getCollections(args, page, size),
        queryOptions,
    );
}

export async function prefetchCollections(
    queryClient: QueryClient,
    args: CollectionsListArgs,
    options: UseCollectionsOptions = {},
) {
    const { page = 1, size = 15, ...queryOptions } = options;

    return await prefetchQuery(
        queryClient,
        queryKeys.collections.list(args),
        (client) => client.collections.getCollections(args, page, size),
        queryOptions,
    );
}
