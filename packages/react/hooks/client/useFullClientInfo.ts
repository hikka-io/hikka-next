import { ClientInfoResponse } from '@hikka/client';

import { queryKeys } from '../../core/queryKeys';
import { QueryParams, useQuery } from '../../core/useQuery';
import { PrefetchQueryParams, prefetchQuery } from '../../server/prefetchQuery';

export interface UseFullClientInfoParams {
    reference: string;
}

/**
 * Hook for getting full client info including secret
 */
export function useFullClientInfo<TResult = ClientInfoResponse>({
    reference,
    ...rest
}: UseFullClientInfoParams & QueryParams<ClientInfoResponse, TResult>) {
    return useQuery<ClientInfoResponse, Error, TResult>({
        queryKey: queryKeys.client.fullInfo(reference),
        queryFn: (client) => client.client.getClientFullDetails(reference),
        ...rest,
    });
}

/**
 * Prefetches full client info for server-side rendering
 */
export async function prefetchFullClientInfo({
    reference,
    ...rest
}: PrefetchQueryParams<ClientInfoResponse> & UseFullClientInfoParams) {
    return prefetchQuery({
        queryKey: queryKeys.client.fullInfo(reference),
        queryFn: (client) => client.client.getClientFullDetails(reference),
        ...rest,
    });
}
