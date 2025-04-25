import { UserResponse } from '@hikka/client';

import { queryKeys } from '../../core/queryKeys';
import { QueryParams, useQuery } from '../../core/useQuery';
import { PrefetchQueryParams, prefetchQuery } from '../../server/prefetchQuery';

interface UseUserByUsernameParams extends QueryParams<UserResponse> {
    username: string;
}

/**
 * Hook for retrieving a user profile by username
 */
export function useUserByUsername({
    username,
    ...rest
}: UseUserByUsernameParams) {
    return useQuery({
        queryKey: queryKeys.user.byUsername(username),
        queryFn: (client) => client.user.getUserByUsername(username),
        ...rest,
    });
}

interface PrefetchUserByUsernameParams
    extends PrefetchQueryParams<UserResponse> {
    username: string;
}

/**
 * Prefetches a user profile by username for server-side rendering
 */
export async function prefetchUserByUsername({
    username,
    ...rest
}: PrefetchUserByUsernameParams) {
    return prefetchQuery({
        queryKey: queryKeys.user.byUsername(username),
        queryFn: (client) => client.user.getUserByUsername(username),
        ...rest,
    });
}
