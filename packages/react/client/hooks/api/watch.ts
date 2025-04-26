'use client';

import {
    UserWatchPaginationResponse,
    WatchPaginationResponse,
    WatchResponse,
    WatchStatsResponse,
} from '@hikka/client';

import {
    InfiniteQueryParams,
    useInfiniteQuery,
} from '@/client/useInfiniteQuery';
import { createMutation } from '@/client/useMutation';
import { QueryParams, useQuery } from '@/client/useQuery';
import { queryKeys } from '@/core';
import {
    RandomAnimeVariables,
    UseCreateWatchParams,
    UseFollowingWatchersParams,
    UseWatchEntryParams,
    UseWatchListParams,
    UseWatchStatsParams,
} from '@/types/watch';

/**
 * Hook for retrieving a user's watch list
 */
export function useSearchUserWatches({
    username,
    args,
    paginationArgs,
    ...rest
}: UseWatchListParams & InfiniteQueryParams<WatchPaginationResponse>) {
    return useInfiniteQuery({
        queryKey: queryKeys.watch.list(username, args, paginationArgs),
        queryFn: (client, page = paginationArgs?.page || 1) =>
            client.watch.searchUserWatches(username, args, {
                page,
                size: paginationArgs?.size,
            }),
        ...rest,
    });
}

/**
 * Hook for retrieving watch stats for a user
 */
export function useUserWatchStats({
    username,
    ...rest
}: UseWatchStatsParams & QueryParams<WatchStatsResponse>) {
    return useQuery({
        queryKey: queryKeys.watch.stats(username),
        queryFn: (client) => client.watch.getUserWatchStats(username),
        ...rest,
    });
}

/**
 * Hook for adding or updating a watch entry
 */
export const useCreateWatch = createMutation({
    mutationFn: (client, { slug, args }: UseCreateWatchParams) =>
        client.watch.createWatch(slug, args),
    invalidateQueries: ({ slug }) => [
        queryKeys.watch.entry(slug),
        queryKeys.watch.all,
        queryKeys.anime.search({}),
    ],
});

/**
 * Hook for deleting a watch entry
 */
export const useDeleteWatch = createMutation({
    mutationFn: (client, slug: string) => client.watch.deleteWatch(slug),
    invalidateQueries: (slug) => [
        queryKeys.watch.entry(slug),
        queryKeys.watch.all,
    ],
});

/**
 * Hook for getting a random anime from a user's watch list
 */
export const useRandomWatchByStatus = createMutation({
    mutationFn: (client, { username, status }: RandomAnimeVariables) =>
        client.watch.getRandomWatchByStatus(username, status),
    invalidateQueries: () => [],
});

/**
 * Hook for retrieving users from following list that are watching an anime
 */
export function useWatchingUsers({
    slug,
    paginationArgs,
    options,
    ...rest
}: UseFollowingWatchersParams &
    InfiniteQueryParams<UserWatchPaginationResponse>) {
    return useInfiniteQuery({
        queryKey: queryKeys.watch.followingUsers(slug, paginationArgs),
        queryFn: (client, page = paginationArgs?.page || 1) =>
            client.watch.getWatchingUsers(slug, {
                page,
                size: paginationArgs?.size,
            }),
        options: {
            authProtected: true,
            ...options,
        },
        ...rest,
    });
}

/**
 * Hook for retrieving a watch entry for an anime
 */
export function useWatchBySlug({
    slug,
    options,
    ...rest
}: UseWatchEntryParams & QueryParams<WatchResponse>) {
    return useQuery({
        queryKey: queryKeys.watch.entry(slug),
        queryFn: (client) => client.watch.getWatchBySlug(slug),
        options: {
            authProtected: true,
            ...options,
        },
        ...rest,
    });
}
