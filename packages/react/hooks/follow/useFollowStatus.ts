import { FollowResponse } from '@hikka/client';

import { queryKeys } from '../../core/queryKeys';
import { QueryParams, useQuery } from '../../core/useQuery';
import { PrefetchQueryParams, prefetchQuery } from '../../server/prefetchQuery';

export interface UseFollowStatusParams {
    username: string;
}

/**
 * Hook for checking if a user is followed
 */
export function useFollowStatus({
    username,
    ...rest
}: UseFollowStatusParams & QueryParams<FollowResponse>) {
    return useQuery({
        queryKey: queryKeys.follow.status(username),
        queryFn: (client) => client.follow.checkFollow(username),
        ...rest,
    });
}

/**
 * Prefetches follow status for server-side rendering
 */
export async function prefetchFollowStatus({
    username,
    ...rest
}: PrefetchQueryParams<FollowResponse> & UseFollowStatusParams) {
    return prefetchQuery({
        queryKey: queryKeys.follow.status(username),
        queryFn: (client) => client.follow.checkFollow(username),
        ...rest,
    });
}
