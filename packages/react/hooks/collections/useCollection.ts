import { CollectionResponse } from '@hikka/client';
import { QueryClient, UseQueryOptions } from '@tanstack/react-query';

import { prefetchQuery } from '@/server/prefetchQuery';

import { queryKeys } from '../core/queryKeys';
import { useQuery } from '../core/useQuery';

export interface UseCollectionOptions
    extends Omit<
        UseQueryOptions<
            CollectionResponse,
            Error,
            CollectionResponse,
            ReturnType<typeof queryKeys.collections.details>
        >,
        'queryKey' | 'queryFn'
    > {}

/**
 * Hook for getting a collection by reference
 */
export function useCollection(
    reference: string,
    options: UseCollectionOptions = {},
) {
    return useQuery(
        queryKeys.collections.details(reference),
        (client) => client.collections.getByReference(reference),
        {
            enabled: !!reference,
            ...options,
        },
    );
}

export async function prefetchCollection(
    queryClient: QueryClient,
    reference: string,
    options: UseCollectionOptions = {},
) {
    return await prefetchQuery(
        queryClient,
        queryKeys.collections.details(reference),
        (client) => client.collections.getByReference(reference),
        options,
    );
}
