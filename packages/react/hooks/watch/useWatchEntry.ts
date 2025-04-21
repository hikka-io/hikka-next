import { WatchResponse } from '@hikka/client';
import { FetchQueryOptions, QueryClient } from '@tanstack/query-core';
import { UseQueryOptions } from '@tanstack/react-query';

import { queryKeys } from '../../core/queryKeys';
import { useQuery } from '../../core/useQuery';
import { prefetchQuery } from '../../server/prefetchQuery';

/**
 * Hook for retrieving a watch entry for an anime
 */
export function useWatchEntry(
    slug: string,
    options?: Omit<
        UseQueryOptions<WatchResponse, Error, WatchResponse>,
        'queryKey' | 'queryFn'
    >,
) {
    return useQuery({
        queryKey: queryKeys.watch.entry(slug),
        queryFn: (client) => client.watch.get(slug),
        options: options || {},
    });
}

/**
 * Prefetches a watch entry for server-side rendering
 */
export async function prefetchWatchEntry(
    queryClient: QueryClient,
    slug: string,
    options?: Omit<
        FetchQueryOptions<WatchResponse, Error, WatchResponse>,
        'queryKey' | 'queryFn'
    >,
) {
    return prefetchQuery({
        queryClient,
        queryKey: queryKeys.watch.entry(slug),
        queryFn: (client) => client.watch.get(slug),
        options,
    });
}
