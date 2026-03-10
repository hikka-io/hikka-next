'use client';

import {
    UserWatchPaginationResponse,
    WatchPaginationResponse,
    WatchResponse,
    WatchStatsResponse,
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
    searchUserWatchesOptions,
    userWatchStatsOptions,
    watchBySlugOptions,
    watchingUsersOptions,
} from '@/options/api/watch';
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
    const { client } = useHikkaClient();
    const { queryKey, queryFn, initialPageParam, getNextPageParam } =
        searchUserWatchesOptions(client, { username, args, paginationArgs });
    return useInfiniteQuery({
        queryKey,
        queryFn,
        initialPageParam,
        getNextPageParam,
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
    const { client } = useHikkaClient();
    return useQuery({
        ...userWatchStatsOptions(client, { username }),
        ...rest,
    });
}

/**
 * Hook for adding or updating a watch entry
 */
export const useCreateWatch = createMutation({
    mutationFn: (client, { slug, args }: UseCreateWatchParams) =>
        client.watch.createWatch(slug, args),
    invalidateQueries: () => [
        queryKeys.anime.search({}),
        queryKeys.collections.all,
    ],
    cacheByQueryKey: ({ data, queryClient, args }) => {
        queryClient.setQueryData<WatchResponse>(
            queryKeys.watch.entry(args.slug),
            () => {
                return data;
            },
        );
    },
});

/**
 * Hook for deleting a watch entry
 */
export const useDeleteWatch = createMutation({
    mutationFn: (client, slug: string) => client.watch.deleteWatch(slug),
    invalidateQueries: () => [
        queryKeys.anime.search({}),
        queryKeys.collections.all,
    ],
    cacheByQueryKey: ({ queryClient, args: slug }) => {
        queryClient.resetQueries({
            queryKey: queryKeys.watch.entry(slug),
        });
    },
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
    const { client } = useHikkaClient();
    const { queryKey, queryFn, initialPageParam, getNextPageParam } =
        watchingUsersOptions(client, { slug, paginationArgs });
    return useInfiniteQuery({
        queryKey,
        queryFn,
        initialPageParam,
        getNextPageParam,
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
    const { client } = useHikkaClient();
    return useQuery({
        ...watchBySlugOptions(client, { slug }),
        options: {
            authProtected: true,
            ...options,
        },
        ...rest,
    });
}
