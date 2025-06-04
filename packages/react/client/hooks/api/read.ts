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

import {
    InfiniteQueryParams,
    useInfiniteQuery,
} from '@/client/useInfiniteQuery';
import { createMutation } from '@/client/useMutation';
import { QueryParams, useQuery } from '@/client/useQuery';
import { queryKeys } from '@/core';
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
    return useQuery({
        queryKey: queryKeys.read.entry(contentType, slug),
        queryFn: (client) => client.read.getReadBySlug(contentType, slug),
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
    invalidateQueries: ({ contentType, slug }) => [
        queryKeys.read.all,
        queryKeys.manga.search({}),
        queryKeys.novel.search({}),
        queryKeys.collections.all,
    ],
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
    invalidateQueries: ({ contentType, slug }) => [
        queryKeys.read.all,
        queryKeys.manga.search({}),
        queryKeys.novel.search({}),
        queryKeys.collections.all,
    ],
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
    return useQuery({
        queryKey: queryKeys.read.stats(contentType, username),
        queryFn: (client) =>
            client.read.getUserReadStats(contentType, username),
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
    return useInfiniteQuery({
        queryKey: queryKeys.read.followingUsers(
            contentType,
            slug,
            paginationArgs,
        ),
        queryFn: (client, page = paginationArgs?.page || 1) =>
            client.read.getReadingUsers(contentType, slug, {
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
 * Hook for retrieving a user's read list
 */
export function useSearchUserReads({
    contentType,
    username,
    args,
    paginationArgs,
    ...rest
}: UseReadListParams & InfiniteQueryParams<ReadPaginationResponse>) {
    return useInfiniteQuery({
        queryKey: queryKeys.read.list(
            contentType,
            username,
            args,
            paginationArgs,
        ),
        queryFn: (client, page = paginationArgs?.page || 1) =>
            client.read.searchUserReads(contentType, username, args, {
                page,
                size: paginationArgs?.size,
            }),
        ...rest,
    });
}
