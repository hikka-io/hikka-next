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
    > {}

/**
 * Hook for getting a watch entry for an anime
 */
export function useWatchEntry(
    slug: string,
    options: UseWatchEntryOptions = {},
) {
    return useQuery(
        queryKeys.watch.get(slug),
        (client) => client.watch.get(slug),
        {
            enabled: !!slug,
            ...options,
        },
    );
}

export async function prefetchWatchEntry(
    queryClient: QueryClient,
    slug: string,
    options: UseWatchEntryOptions = {},
) {
    return await prefetchQuery(
        queryClient,
        queryKeys.watch.get(slug),
        (client) => client.watch.get(slug),
        options,
    );
}
