import { WatchResponse } from '@hikka/client';

import { queryKeys } from '../../core/queryKeys';
import { QueryParams, useQuery } from '../../core/useQuery';
import { PrefetchQueryParams, prefetchQuery } from '../../server/prefetchQuery';

export interface UseWatchEntryParams {
    slug: string;
}

/**
 * Hook for retrieving a watch entry for an anime
 */
export function useWatchBySlug({
    slug,
    options,
    ...rest
}: UseWatchEntryParams & QueryParams<WatchResponse>) {
    return useQuery({
        queryKey: queryKeys.watch.entry(slug),
        queryFn: (client) => client.watch.getWatchBySlug(slug),
        options: {
            authProtected: true,
            ...options,
        },
        ...rest,
    });
}

/**
 * Prefetches a watch entry for server-side rendering
 */
export async function prefetchWatchBySlug({
    slug,
    ...rest
}: PrefetchQueryParams<WatchResponse> & UseWatchEntryParams) {
    return prefetchQuery({
        queryKey: queryKeys.watch.entry(slug),
        queryFn: (client) => client.watch.getWatchBySlug(slug),
        ...rest,
    });
}
