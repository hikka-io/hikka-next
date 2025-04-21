import {
    PaginationArgs,
    ReadContentTypeEnum,
    ReadPaginationResponse,
    ReadSearchArgs,
} from '@hikka/client';
import { FetchInfiniteQueryOptions, QueryClient } from '@tanstack/query-core';
import { UseInfiniteQueryOptions } from '@tanstack/react-query';

import { queryKeys } from '../../core/queryKeys';
import { useInfiniteQuery } from '../../core/useInfiniteQuery';
import { prefetchInfiniteQuery } from '../../server/prefetchInfiniteQuery';

/**
 * Hook for retrieving a user's read list
 */
export function useReadList(
    contentType: ReadContentTypeEnum,
    username: string,
    args: ReadSearchArgs,
    paginationArgs?: PaginationArgs,
    options?: Omit<
        UseInfiniteQueryOptions<
            ReadPaginationResponse,
            Error,
            ReadPaginationResponse,
            ReadPaginationResponse,
            readonly unknown[],
            number
        >,
        'queryKey' | 'queryFn' | 'initialPageParam' | 'getNextPageParam'
    >,
) {
    return useInfiniteQuery({
        queryKey: queryKeys.read.list(
            contentType,
            username,
            args,
            paginationArgs,
        ),
        queryFn: (client, page = paginationArgs?.page || 1) =>
            client.read.getList(contentType, username, args, {
                page,
                size: paginationArgs?.size,
            }),
        options,
    });
}

/**
 * Prefetches a user's read list for server-side rendering
 */
export async function prefetchReadList(
    queryClient: QueryClient,
    contentType: ReadContentTypeEnum,
    username: string,
    args: ReadSearchArgs,
    paginationArgs?: PaginationArgs,
    options?: Omit<
        FetchInfiniteQueryOptions<
            ReadPaginationResponse,
            Error,
            ReadPaginationResponse,
            readonly unknown[],
            number
        >,
        'queryKey' | 'queryFn' | 'initialPageParam' | 'getNextPageParam'
    >,
) {
    return prefetchInfiniteQuery({
        queryClient,
        queryKey: queryKeys.read.list(
            contentType,
            username,
            args,
            paginationArgs,
        ),
        queryFn: (client, page = paginationArgs?.page || 1) =>
            client.read.getList(contentType, username, args, {
                page,
                size: paginationArgs?.size,
            }),
        options,
    });
}
