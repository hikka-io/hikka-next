import { CollectionResponse } from '@hikka/client';
import { QueryClient, UseQueryOptions } from '@tanstack/react-query';

import { prefetchQuery } from '../../server/prefetchQuery';
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
    > {
    reference: string;
}

/**
 * Hook for getting a collection by reference
 */
export function useCollection(params: UseCollectionOptions) {
    const { reference, ...options } = params;

    return useQuery(
        queryKeys.collections.details(reference),
        (client) => client.collections.getByReference(reference),
        {
            enabled: !!reference,
            ...options,
        },
    );
}

export interface PrefetchCollectionParams extends UseCollectionOptions {
    queryClient: QueryClient;
}

export async function prefetchCollection(params: PrefetchCollectionParams) {
    const { queryClient, reference, ...options } = params;

    return await prefetchQuery(
        queryClient,
        queryKeys.collections.details(reference),
        (client) => client.collections.getByReference(reference),
        options,
    );
}
