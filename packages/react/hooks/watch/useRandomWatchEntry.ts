import { AnimeResponse, WatchStatusEnum } from '@hikka/client';
import { UseQueryOptions, UseQueryResult } from '@tanstack/react-query';

import { useQuery } from '../core/useQuery';

export interface UseRandomWatchEntryOptions
    extends Omit<
        UseQueryOptions<AnimeResponse, Error>,
        'queryKey' | 'queryFn'
    > {
    username: string;
    status: WatchStatusEnum;
}

/**
 * Hook for getting a random watch entry from a user's list
 */
export function useRandomWatchEntry(
    params: UseRandomWatchEntryOptions,
): UseQueryResult<AnimeResponse, Error> {
    const { username, status, ...options } = params;

    return useQuery(
        ['watch', 'random', username, status],
        (client) => client.watch.getRandom(username, status),
        {
            enabled: !!username && !!status,
            ...options,
        },
    );
}
