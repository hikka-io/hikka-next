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
    > {}

/**
 * Hook for getting a user's read stats
 */
export function useReadStats(
    contentType: ReadContentTypeEnum,
    username: string,
    options: UseReadStatsOptions = {},
) {
    return useQuery(
        queryKeys.read.stats(contentType, username),
        (client) => client.read.getStats(contentType, username),
        {
            enabled: !!contentType && !!username,
            ...options,
        },
    );
}

export async function prefetchReadStats(
    queryClient: QueryClient,
    contentType: ReadContentTypeEnum,
    username: string,
    options: UseReadStatsOptions = {},
) {
    return await prefetchQuery(
        queryClient,
        queryKeys.read.stats(contentType, username),
        (client) => client.read.getStats(contentType, username),
        options,
    );
}
