import { WatchResponse } from '@hikka/client';
import { QueryClient, UseQueryOptions } from '@tanstack/react-query';

import { prefetchQuery } from '../../server/prefetchQuery';
import { queryKeys } from '../core/queryKeys';
import { useQuery } from '../core/useQuery';

export interface UseWatchStatusOptions
    extends Omit<
        UseQueryOptions<
            WatchResponse,
            Error,
            WatchResponse,
            ReturnType<typeof queryKeys.watch.get>
        >,
        'queryKey' | 'queryFn'
    > {
    slug: string;
    /**
     * Whether to enable the query.
     * By default, the query is enabled if there's a slug and an auth token
     */
    enabled?: boolean;
}

/**
 * Hook for getting the watch status of an anime for the current user
 */
export function useWatchStatus(params: UseWatchStatusOptions) {
    const { slug, ...options } = params;

    return useQuery(
        queryKeys.watch.get(slug),
        async (client) => {
            // Only attempt to fetch if we have an auth token
            if (!client.getAuthToken()) {
                throw new Error('No auth token available');
            }
            return client.watch.get(slug);
        },
        {
            // By default, the query is enabled if there's a slug and an auth token
            enabled: options.enabled ?? !!slug,
            ...options,
        },
    );
}

export interface PrefetchWatchStatusParams extends UseWatchStatusOptions {
    queryClient: QueryClient;
}

export function prefetchWatchStatus(params: PrefetchWatchStatusParams) {
    const { queryClient, slug, ...options } = params;

    return prefetchQuery(
        queryClient,
        queryKeys.watch.get(slug),
        async (client) => {
            if (!client.getAuthToken()) {
                throw new Error('No auth token available');
            }
            return client.watch.get(slug);
        },
        options,
    );
}
