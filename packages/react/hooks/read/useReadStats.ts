import { ReadContentTypeEnum, ReadStatsResponse } from '@hikka/client';
import { QueryClient, UseQueryOptions } from '@tanstack/react-query';

import { prefetchQuery } from '../../server/prefetchQuery';
import { queryKeys } from '../core/queryKeys';
import { useQuery } from '../core/useQuery';

export interface UseReadStatsOptions
    extends Omit<
        UseQueryOptions<
            ReadStatsResponse,
            Error,
            ReadStatsResponse,
            ReturnType<typeof queryKeys.read.stats>
        >,
        'queryKey' | 'queryFn'
    > {
    contentType: ReadContentTypeEnum;
    username: string;
}

/**
 * Hook for getting a user's read stats
 */
export function useReadStats(params: UseReadStatsOptions) {
    const { contentType, username, ...options } = params;

    return useQuery(
        queryKeys.read.stats(contentType, username),
        (client) => client.read.getStats(contentType, username),
        {
            enabled: !!contentType && !!username,
            ...options,
        },
    );
}

export interface PrefetchReadStatsParams extends UseReadStatsOptions {
    queryClient: QueryClient;
}

export async function prefetchReadStats(params: PrefetchReadStatsParams) {
    const { queryClient, contentType, username, ...options } = params;

    return await prefetchQuery(
        queryClient,
        queryKeys.read.stats(contentType, username),
        (client) => client.read.getStats(contentType, username),
        options,
    );
}
