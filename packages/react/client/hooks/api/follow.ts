'use client';

import {
    FollowListResponse,
    FollowResponse,
    FollowStatsResponse,
} from '@hikka/client';

import {
    InfiniteQueryParams,
    useInfiniteQuery,
} from '@/client/useInfiniteQuery';
import { createMutation } from '@/client/useMutation';
import { QueryParams, useQuery } from '@/client/useQuery';
import { queryKeys } from '@/core';
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
    return useQuery({
        queryKey: queryKeys.follow.status(username),
        queryFn: (client) => client.follow.getFollowStatus(username),
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
    return useQuery({
        queryKey: queryKeys.follow.stats(username),
        queryFn: (client) => client.follow.getUserFollowStats(username),
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
    return useInfiniteQuery({
        queryKey: queryKeys.follow.followers(username, paginationArgs),
        queryFn: (client, page = paginationArgs?.page || 1) =>
            client.follow.getUserFollowers(username, {
                page,
                size: paginationArgs?.size,
            }),
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
    return useInfiniteQuery({
        queryKey: queryKeys.follow.followings(username, paginationArgs),
        queryFn: (client, page = paginationArgs?.page || 1) =>
            client.follow.getUserFollowings(username, {
                page,
                size: paginationArgs?.size,
            }),
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
        queryKeys.follow.status(username),
        queryKeys.follow.stats(username),
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
        queryKeys.follow.status(username),
        queryKeys.follow.stats(username),
        queryKeys.user.byUsername(username),
    ],
});
