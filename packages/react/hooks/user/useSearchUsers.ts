import { QuerySearchRequiredArgs, UserResponse } from '@hikka/client';

import { queryKeys } from '../../core/queryKeys';
import { QueryParams, useQuery } from '../../core/useQuery';
import { PrefetchQueryParams, prefetchQuery } from '../../server/prefetchQuery';

export interface UseUserSearchParams {
    args: QuerySearchRequiredArgs;
}

/**
 * Hook for searching users
 */
export function useSearchUsers({
    args,
    ...rest
}: UseUserSearchParams & QueryParams<UserResponse[]>) {
    return useQuery({
        queryKey: queryKeys.user.search(args),
        queryFn: (client) => client.user.searchUsers(args),
        ...rest,
    });
}

/**
 * Prefetches user search results for server-side rendering
 */
export async function prefetchSearchUsers({
    args,
    ...rest
}: PrefetchQueryParams<UserResponse[]> & UseUserSearchParams) {
    return prefetchQuery({
        queryKey: queryKeys.user.search(args),
        queryFn: (client) => client.user.searchUsers(args),
        ...rest,
    });
}
