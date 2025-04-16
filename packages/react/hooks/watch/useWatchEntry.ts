import { WatchResponse } from '@hikka/client';
import { QueryClient, UseQueryOptions } from '@tanstack/react-query';

import { prefetchQuery } from '../../server/prefetchQuery';
import { queryKeys } from '../core/queryKeys';
import { useQuery } from '../core/useQuery';

export interface UseWatchEntryOptions
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
}

/**
 * Hook for getting a watch entry for an anime
 */
export function useWatchEntry(params: UseWatchEntryOptions) {
    const { slug, ...options } = params;

    return useQuery(
        queryKeys.watch.get(slug),
        (client) => client.watch.get(slug),
        {
            enabled: !!slug,
            ...options,
        },
    );
}

export interface PrefetchWatchEntryParams extends UseWatchEntryOptions {
    queryClient: QueryClient;
}

export async function prefetchWatchEntry(params: PrefetchWatchEntryParams) {
    const { queryClient, slug, ...options } = params;

    return await prefetchQuery(
        queryClient,
        queryKeys.watch.get(slug),
        (client) => client.watch.get(slug),
        options,
    );
}
