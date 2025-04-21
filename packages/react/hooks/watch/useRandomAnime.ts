import { AnimeResponse, WatchStatusEnum } from '@hikka/client';
import { FetchQueryOptions, QueryClient } from '@tanstack/query-core';
import { UseQueryOptions } from '@tanstack/react-query';

import { queryKeys } from '../../core/queryKeys';
import { useQuery } from '../../core/useQuery';
import { prefetchQuery } from '../../server/prefetchQuery';

/**
 * Hook for retrieving a random anime from a user's watch list
 */
export function useRandomAnime(
    username: string,
    status: WatchStatusEnum,
    options?: Omit<
        UseQueryOptions<AnimeResponse, Error, AnimeResponse>,
        'queryKey' | 'queryFn'
    >,
) {
    return useQuery({
        queryKey: queryKeys.watch.random(username, status),
        queryFn: (client) => client.watch.getRandom(username, status),
        options: options || {},
    });
}

/**
 * Prefetches a random anime from a user's watch list for server-side rendering
 */
export async function prefetchRandomAnime(
    queryClient: QueryClient,
    username: string,
    status: WatchStatusEnum,
    options?: Omit<
        FetchQueryOptions<AnimeResponse, Error, AnimeResponse>,
        'queryKey' | 'queryFn'
    >,
) {
    return prefetchQuery({
        queryClient,
        queryKey: queryKeys.watch.random(username, status),
        queryFn: (client) => client.watch.getRandom(username, status),
        options,
    });
}
