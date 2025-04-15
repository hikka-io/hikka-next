import { UserWatchPaginationResponse } from '@hikka/client';
import { QueryClient, UseQueryOptions } from '@tanstack/react-query';

import { prefetchQuery } from '../../server/prefetchQuery';
import { queryKeys } from '../core/queryKeys';
import { useQuery } from '../core/useQuery';

export interface UseWatchingUsersOptions
    extends Omit<
        UseQueryOptions<
            UserWatchPaginationResponse,
            Error,
            UserWatchPaginationResponse,
            ReturnType<typeof queryKeys.watch.following>
        >,
        'queryKey' | 'queryFn'
    > {
    page?: number;
    size?: number;
}

/**
 * Hook for getting users who are watching an anime
 */
export function useWatchingUsers(
    slug: string,
    options: UseWatchingUsersOptions = {},
) {
    const { page = 1, size = 15, ...queryOptions } = options;

    return useQuery(
        queryKeys.watch.following(slug),
        (client) => client.watch.getFollowingUsers(slug, page, size),
        {
            enabled: !!slug,
            ...queryOptions,
        },
    );
}

export async function prefetchWatchingUsers(
    queryClient: QueryClient,
    slug: string,
    options: UseWatchingUsersOptions = {},
) {
    const { page = 1, size = 15, ...queryOptions } = options;

    return await prefetchQuery(
        queryClient,
        queryKeys.watch.following(slug),
        (client) => client.watch.getFollowingUsers(slug, page, size),
        queryOptions,
    );
}
