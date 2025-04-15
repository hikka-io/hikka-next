import { QuerySearchRequiredArgs, UserResponse } from '@hikka/client';
import { QueryClient, UseQueryOptions } from '@tanstack/react-query';

import { prefetchQuery } from '../../server/prefetchQuery';

import { queryKeys } from '../core/queryKeys';
import { useQuery } from '../core/useQuery';

export interface UseUserSearchOptions
    extends Omit<
        UseQueryOptions<
            UserResponse[],
            Error,
            UserResponse[],
            ReturnType<typeof queryKeys.user.search>
        >,
        'queryKey' | 'queryFn'
    > {}

/**
 * Hook for searching users
 */
export function useUserSearch(
    args: QuerySearchRequiredArgs,
    options: UseUserSearchOptions = {},
) {
    const query = args.query || '';

    return useQuery(
        queryKeys.user.search(query),
        (client) => client.user.search(args),
        {
            enabled: !!args.query,
            ...options,
        },
    );
}

export async function prefetchUserSearch(
    queryClient: QueryClient,
    args: QuerySearchRequiredArgs,
    options: UseUserSearchOptions = {},
) {
    const query = args.query || '';

    return await prefetchQuery(
        queryClient,
        queryKeys.user.search(query),
        (client) => client.user.search(args),
        options,
    );
}
