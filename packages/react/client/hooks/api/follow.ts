'use client';

import {
    FollowListResponse,
    FollowResponse,
    FollowStatsResponse,
} from '@hikka/client';

import { useHikkaClient } from '@/client/provider/useHikkaClient';
import {
    InfiniteQueryParams,
    useInfiniteQuery,
} from '@/client/useInfiniteQuery';
import { createMutation } from '@/client/useMutation';
import { QueryParams, useQuery } from '@/client/useQuery';
import { queryKeys } from '@/core';
import {
    followStatusOptions,
    userFollowersOptions,
    userFollowingsOptions,
    userFollowStatsOptions,
} from '@/options/api/follow';
import {
    UseFollowStatsParams,
    UseFollowStatusParams,
    UseFollowersParams,
    UseFollowingsParams,
} from '@/types/follow';

/**
 * Hook for checking if a user is followed
 */
export function useFollowStatus({
    username,
    ...rest
}: UseFollowStatusParams & QueryParams<FollowResponse>) {
    const { client } = useHikkaClient();
    return useQuery({
        ...followStatusOptions(client, { username }),
        ...rest,
    });
}

/**
 * Hook for retrieving follow stats for a user
 */
export function useUserFollowStats({
    username,
    ...rest
}: UseFollowStatsParams & QueryParams<FollowStatsResponse>) {
    const { client } = useHikkaClient();
    return useQuery({
        ...userFollowStatsOptions(client, { username }),
        ...rest,
    });
}

/**
 * Hook for retrieving a user's followers
 */
export function useUserFollowers({
    username,
    paginationArgs,
    ...rest
}: UseFollowersParams & InfiniteQueryParams<FollowListResponse>) {
    const { client } = useHikkaClient();
    const { queryKey, queryFn, initialPageParam, getNextPageParam } =
        userFollowersOptions(client, { username, paginationArgs });
    return useInfiniteQuery({
        queryKey,
        queryFn,
        initialPageParam,
        getNextPageParam,
        ...rest,
    });
}

/**
 * Hook for retrieving a user's followings
 */
export function useUserFollowings({
    username,
    paginationArgs,
    ...rest
}: UseFollowingsParams & InfiniteQueryParams<FollowListResponse>) {
    const { client } = useHikkaClient();
    const { queryKey, queryFn, initialPageParam, getNextPageParam } =
        userFollowingsOptions(client, { username, paginationArgs });
    return useInfiniteQuery({
        queryKey,
        queryFn,
        initialPageParam,
        getNextPageParam,
        ...rest,
    });
}

/**
 * Hook for following a user
 */
export const useCreateFollow = createMutation({
    mutationFn: (client, username: string) =>
        client.follow.createFollow(username),
    invalidateQueries: (username: string) => [
        queryKeys.follow.all,
        queryKeys.articles.all,
        queryKeys.collections.all,
        queryKeys.user.byUsername(username),
    ],
});

/**
 * Hook for unfollowing a user
 */
export const useDeleteFollow = createMutation({
    mutationFn: (client, username: string) =>
        client.follow.deleteFollow(username),
    invalidateQueries: (username: string) => [
        queryKeys.follow.all,
        queryKeys.articles.all,
        queryKeys.collections.all,
        queryKeys.user.byUsername(username),
    ],
});
