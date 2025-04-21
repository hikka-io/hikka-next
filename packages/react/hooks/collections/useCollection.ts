import { CollectionResponse } from '@hikka/client';
import { FetchQueryOptions, QueryClient } from '@tanstack/query-core';
import { UseQueryOptions } from '@tanstack/react-query';

import { queryKeys } from '../../core/queryKeys';
import { useQuery } from '../../core/useQuery';
import { prefetchQuery } from '../../server/prefetchQuery';

/**
 * Hook for retrieving a collection by reference
 */
export function useCollection(
    reference: string,
    options?: Omit<
        UseQueryOptions<CollectionResponse, Error, CollectionResponse>,
        'queryKey' | 'queryFn'
    >,
) {
    return useQuery({
        queryKey: queryKeys.collections.byReference(reference),
        queryFn: (client) => client.collections.getByReference(reference),
        options: options || {},
    });
}

/**
 * Prefetches a collection by reference for server-side rendering
 */
export async function prefetchCollection(
    queryClient: QueryClient,
    reference: string,
    options?: Omit<
        FetchQueryOptions<CollectionResponse, Error, CollectionResponse>,
        'queryKey' | 'queryFn'
    >,
) {
    return prefetchQuery({
        queryClient,
        queryKey: queryKeys.collections.byReference(reference),
        queryFn: (client) => client.collections.getByReference(reference),
        options,
    });
}
