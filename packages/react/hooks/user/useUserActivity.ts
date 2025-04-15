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
    > {}

/**
 * Hook for getting user activity
 */
export function useUserActivity(
    username: string,
    options: UseUserActivityOptions = {},
) {
    return useQuery(
        queryKeys.user.activity(username),
        (client) => client.user.getActivity(username),
        {
            enabled: !!username,
            ...options,
        },
    );
}

export async function prefetchUserActivity(
    queryClient: QueryClient,
    username: string,
    options: UseUserActivityOptions = {},
) {
    return await prefetchQuery(
        queryClient,
        queryKeys.user.activity(username),
        (client) => client.user.getActivity(username),
        options,
    );
}
