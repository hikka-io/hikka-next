import { ReadContentTypeEnum, ReadStatsResponse } from '@hikka/client';
import { FetchQueryOptions, QueryClient } from '@tanstack/query-core';
import { UseQueryOptions } from '@tanstack/react-query';

import { queryKeys } from '../../core/queryKeys';
import { useQuery } from '../../core/useQuery';
import { prefetchQuery } from '../../server/prefetchQuery';

/**
 * Hook for retrieving read stats for a user
 */
export function useReadStats(
    contentType: ReadContentTypeEnum,
    username: string,
    options?: Omit<
        UseQueryOptions<ReadStatsResponse, Error, ReadStatsResponse>,
        'queryKey' | 'queryFn'
    >,
) {
    return useQuery({
        queryKey: queryKeys.read.stats(contentType, username),
        queryFn: (client) => client.read.getStats(contentType, username),
        options: options || {},
    });
}

/**
 * Prefetches read stats for a user for server-side rendering
 */
export async function prefetchReadStats(
    queryClient: QueryClient,
    contentType: ReadContentTypeEnum,
    username: string,
    options?: Omit<
        FetchQueryOptions<ReadStatsResponse, Error, ReadStatsResponse>,
        'queryKey' | 'queryFn'
    >,
) {
    return prefetchQuery({
        queryClient,
        queryKey: queryKeys.read.stats(contentType, username),
        queryFn: (client) => client.read.getStats(contentType, username),
        options,
    });
}
