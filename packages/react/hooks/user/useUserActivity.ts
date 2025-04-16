import { ActivityResponse } from '@hikka/client';
import { QueryClient, UseQueryOptions } from '@tanstack/react-query';

import { prefetchQuery } from '../../server/prefetchQuery';
import { queryKeys } from '../core/queryKeys';
import { useQuery } from '../core/useQuery';

export interface UseUserActivityOptions
    extends Omit<
        UseQueryOptions<
            ActivityResponse[],
            Error,
            ActivityResponse[],
            ReturnType<typeof queryKeys.user.activity>
        >,
        'queryKey' | 'queryFn'
    > {
    username: string;
}

/**
 * Hook for getting user activity
 */
export function useUserActivity(params: UseUserActivityOptions) {
    const { username, ...options } = params;

    return useQuery(
        queryKeys.user.activity(username),
        (client) => client.user.getActivity(username),
        {
            enabled: !!username,
            ...options,
        },
    );
}

export interface PrefetchUserActivityParams extends UseUserActivityOptions {
    queryClient: QueryClient;
}

export async function prefetchUserActivity(params: PrefetchUserActivityParams) {
    const { queryClient, username, ...options } = params;

    return await prefetchQuery(
        queryClient,
        queryKeys.user.activity(username),
        (client) => client.user.getActivity(username),
        options,
    );
}
