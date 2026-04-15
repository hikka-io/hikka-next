'use client';

import {
    ReadArgs,
    ReadContentType,
    ReadPaginationResponse,
    ReadResponse,
    ReadStatsResponse,
    ReadStatusEnum,
    UserReadPaginationResponse,
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
    readBySlugOptions,
    readStatsOptions,
    readingUsersOptions,
    searchUserReadsOptions,
} from '@/options/api/read';
import {
    UseReadEntryParams,
    UseReadListParams,
    UseReadStatsParams,
    UseReadingUsersParams,
} from '@/types/read';

/**
 * Hook for retrieving a read entry for manga or novel
 */
export function useReadBySlug({
    contentType,
    slug,
    options,
    ...rest
}: UseReadEntryParams & QueryParams<ReadResponse>) {
    const { client } = useHikkaClient();
    return useQuery({
        ...readBySlugOptions(client, { contentType, slug }),
        options: {
            authProtected: true,
            ...options,
        },
        ...rest,
    });
}

type AddOrUpdateReadVariables = {
    contentType: ReadContentType;
    slug: string;
    args: ReadArgs;
};

/**
 * Hook for adding or updating a read entry
 */
export const useCreateRead = createMutation({
    mutationFn: (
        client,
        { contentType, slug, args }: AddOrUpdateReadVariables,
    ) => client.read.createRead(contentType, slug, args),
    invalidateQueries: ({ contentType }) => [
        queryKeys.manga.search({}),
        queryKeys.novel.search({}),
        queryKeys.collections.all,
        queryKeys.read.lists(contentType),
    ],
    invalidateRefetchType: 'all',
    cacheByQueryKey: ({ data, queryClient, args }) => {
        queryClient.setQueryData<ReadResponse>(
            queryKeys.read.entry(args.contentType, args.slug),
            () => {
                return data;
            },
        );
    },
});

type DeleteReadVariables = {
    contentType: ReadContentType;
    slug: string;
};

/**
 * Hook for deleting a read entry
 */
export const useDeleteRead = createMutation({
    mutationFn: (client, { contentType, slug }: DeleteReadVariables) =>
        client.read.deleteRead(contentType, slug),
    invalidateQueries: ({ contentType }) => [
        queryKeys.manga.search({}),
        queryKeys.novel.search({}),
        queryKeys.collections.all,
        queryKeys.read.lists(contentType),
    ],
    invalidateRefetchType: 'all',
    cacheByQueryKey: ({ queryClient, args }) => {
        queryClient.resetQueries({
            queryKey: queryKeys.read.entry(args.contentType, args.slug),
        });
    },
});

type RandomReadVariables = {
    contentType: ReadContentType;
    username: string;
    status: ReadStatusEnum;
};

/**
 * Hook for retrieving a random manga/novel from a user's read list
 */
export const useRandomReadByStatus = createMutation({
    mutationFn: (
        client,
        { contentType, username, status }: RandomReadVariables,
    ) => client.read.getRandomReadByStatus(contentType, username, status),
    invalidateQueries: () => [queryKeys.read.all],
});

/**
 * Hook for retrieving read stats for a user
 */
export function useReadStats({
    contentType,
    username,
    ...rest
}: UseReadStatsParams & QueryParams<ReadStatsResponse>) {
    const { client } = useHikkaClient();
    return useQuery({
        ...readStatsOptions(client, { contentType, username }),
        ...rest,
    });
}

/**
 * Hook for retrieving users from following list that are reading a manga/novel
 */
export function useReadingUsers({
    contentType,
    slug,
    paginationArgs,
    options,
    ...rest
}: UseReadingUsersParams & InfiniteQueryParams<UserReadPaginationResponse>) {
    const { client } = useHikkaClient();
    const { queryKey, queryFn, initialPageParam, getNextPageParam } =
        readingUsersOptions(client, { contentType, slug, paginationArgs });
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
 * Hook for retrieving a user's read list
 */
export function useSearchUserReads({
    contentType,
    username,
    args,
    paginationArgs,
    ...rest
}: UseReadListParams & InfiniteQueryParams<ReadPaginationResponse>) {
    const { client } = useHikkaClient();
    const { queryKey, queryFn, initialPageParam, getNextPageParam } =
        searchUserReadsOptions(client, {
            contentType,
            username,
            args,
            paginationArgs,
        });
    return useInfiniteQuery({
        queryKey,
        queryFn,
        initialPageParam,
        getNextPageParam,
        ...rest,
    });
}
