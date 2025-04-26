'use client';

import { HistoryPaginationResponse } from '@hikka/client';

import {
    InfiniteQueryParams,
    useInfiniteQuery,
} from '@/client/useInfiniteQuery';
import { queryKeys } from '@/core';
import { UseUserHistoryParams } from '@/types/history';

/**
 * Hook for retrieving history of users that the current user follows
 */
export function useFollowingHistory({
    paginationArgs,
    ...rest
}: InfiniteQueryParams<HistoryPaginationResponse> = {}) {
    return useInfiniteQuery({
        queryKey: queryKeys.history.following(paginationArgs),
        queryFn: (client, page = paginationArgs?.page || 1) =>
            client.history.getFollowingHistory({
                page,
                size: paginationArgs?.size,
            }),
        ...rest,
    });
}

/**
 * Hook for retrieving a specific user's history
 */
export function useUserHistory({
    username,
    paginationArgs,
    ...rest
}: UseUserHistoryParams & InfiniteQueryParams<HistoryPaginationResponse>) {
    return useInfiniteQuery({
        queryKey: queryKeys.history.user(username, paginationArgs),
        queryFn: (client, page = paginationArgs?.page || 1) =>
            client.history.getUserHistory(username, {
                page,
                size: paginationArgs?.size,
            }),
        ...rest,
    });
}
