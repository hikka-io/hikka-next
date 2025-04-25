import { ClientResponse } from '@hikka/client';

import { queryKeys } from '../../core/queryKeys';
import { QueryParams, useQuery } from '../../core/useQuery';
import { PrefetchQueryParams, prefetchQuery } from '../../server/prefetchQuery';

export interface UseClientByReferenceParams {
    reference: string;
}

/**
 * Hook for getting client by reference
 */
export function useClientByReference<TResult = ClientResponse>({
    reference,
    ...rest
}: UseClientByReferenceParams & QueryParams<ClientResponse, TResult>) {
    return useQuery<ClientResponse, Error, TResult>({
        queryKey: queryKeys.client.byReference(reference),
        queryFn: (client) => client.client.getClientByReference(reference),
        ...rest,
    });
}

/**
 * Prefetches client by reference for server-side rendering
 */
export async function prefetchClientByReference({
    reference,
    ...rest
}: PrefetchQueryParams<ClientResponse> & UseClientByReferenceParams) {
    return prefetchQuery({
        queryKey: queryKeys.client.byReference(reference),
        queryFn: (client) => client.client.getClientByReference(reference),
        ...rest,
    });
}
