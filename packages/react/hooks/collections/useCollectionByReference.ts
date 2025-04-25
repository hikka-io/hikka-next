import { CollectionContent, CollectionResponse } from '@hikka/client';

import { queryKeys } from '../../core/queryKeys';
import { QueryParams, useQuery } from '../../core/useQuery';
import { PrefetchQueryParams, prefetchQuery } from '../../server/prefetchQuery';

export interface UseCollectionParams {
    reference: string;
}

/**
 * Hook for retrieving a collection by reference
 */
export function useCollectionByReference<
    TResult = CollectionResponse<CollectionContent>,
>({
    reference,
    ...rest
}: UseCollectionParams &
    QueryParams<CollectionResponse<CollectionContent>, TResult>) {
    return useQuery<CollectionResponse<CollectionContent>, Error, TResult>({
        queryKey: queryKeys.collections.byReference(reference),
        queryFn: (client) =>
            client.collections.getCollectionByReference(reference),
        ...rest,
    });
}

/**
 * Prefetches a collection by reference for server-side rendering
 */
export async function prefetchCollectionByReference({
    reference,
    ...rest
}: PrefetchQueryParams<CollectionResponse<CollectionContent>> &
    UseCollectionParams) {
    return prefetchQuery({
        queryKey: queryKeys.collections.byReference(reference),
        queryFn: (client) =>
            client.collections.getCollectionByReference(reference),
        ...rest,
    });
}
