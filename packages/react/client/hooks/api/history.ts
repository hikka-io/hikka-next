'use client';

import type { HistoryPaginationResponse } from '@hikka/client';

import type { UseUserHistoryParams } from '@/types/history';
import { useHikkaClient } from '@/client/provider/useHikkaClient';
import {
    type InfiniteQueryParams,
    useInfiniteQuery,
} from '@/client/useInfiniteQuery';
import {
    followingHistoryOptions,
    userHistoryOptions,
} from '@/options/api/history';

/**
 * Hook for retrieving history of users that the current user follows
 */
export function useFollowingHistory({
    paginationArgs,
    ...rest
}: InfiniteQueryParams<HistoryPaginationResponse> = {}) {
    const { client } = useHikkaClient();
    const { queryKey, queryFn, initialPageParam, getNextPageParam } =
        followingHistoryOptions(client, { paginationArgs });
    return useInfiniteQuery({
        queryKey,
        queryFn,
        initialPageParam,
        getNextPageParam,
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
    const { client } = useHikkaClient();
    const { queryKey, queryFn, initialPageParam, getNextPageParam } =
        userHistoryOptions(client, { username, paginationArgs });
    return useInfiniteQuery({
        queryKey,
        queryFn,
        initialPageParam,
        getNextPageParam,
        ...rest,
    });
}
