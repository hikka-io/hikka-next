import { ReadContentType, ReadStatsResponse } from '@hikka/client';

import { queryKeys } from '../../core/queryKeys';
import { QueryParams, useQuery } from '../../core/useQuery';
import { PrefetchQueryParams, prefetchQuery } from '../../server/prefetchQuery';

export interface UseReadStatsParams {
    contentType: ReadContentType;
    username: string;
}

/**
 * Hook for retrieving read stats for a user
 */
export function useReadStats({
    contentType,
    username,
    ...rest
}: UseReadStatsParams & QueryParams<ReadStatsResponse>) {
    return useQuery({
        queryKey: queryKeys.read.stats(contentType, username),
        queryFn: (client) =>
            client.read.getUserReadStats(contentType, username),
        ...rest,
    });
}

/**
 * Prefetches read stats for a user for server-side rendering
 */
export async function prefetchReadStats({
    contentType,
    username,
    ...rest
}: PrefetchQueryParams<ReadStatsResponse> & UseReadStatsParams) {
    return prefetchQuery({
        queryKey: queryKeys.read.stats(contentType, username),
        queryFn: (client) =>
            client.read.getUserReadStats(contentType, username),
        ...rest,
    });
}
