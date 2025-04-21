import {
    FavouriteContentTypeEnum,
    FavouritePaginationResponse,
    PaginationArgs,
} from '@hikka/client';
import { FetchInfiniteQueryOptions, QueryClient } from '@tanstack/query-core';
import { UseInfiniteQueryOptions } from '@tanstack/react-query';

import { queryKeys } from '../../core/queryKeys';
import { useInfiniteQuery } from '../../core/useInfiniteQuery';
import { prefetchInfiniteQuery } from '../../server/prefetchInfiniteQuery';

/**
 * Hook for retrieving a user's favourite list
 */
export function useFavouriteList(
    contentType: FavouriteContentTypeEnum,
    username: string,
    paginationArgs?: PaginationArgs,
    options?: Omit<
        UseInfiniteQueryOptions<
            FavouritePaginationResponse,
            Error,
            FavouritePaginationResponse,
            FavouritePaginationResponse,
            readonly unknown[],
            number
        >,
        'queryKey' | 'queryFn' | 'initialPageParam' | 'getNextPageParam'
    >,
) {
    return useInfiniteQuery({
        queryKey: queryKeys.favourite.list(
            contentType,
            username,
            paginationArgs,
        ),
        queryFn: (client, page = paginationArgs?.page || 1) =>
            client.favourite.getList(contentType, username, {
                page,
                size: paginationArgs?.size,
            }),
        options,
    });
}

/**
 * Prefetches a user's favourite list for server-side rendering
 */
export async function prefetchFavouriteList(
    queryClient: QueryClient,
    contentType: FavouriteContentTypeEnum,
    username: string,
    paginationArgs?: PaginationArgs,
    options?: Omit<
        FetchInfiniteQueryOptions<
            FavouritePaginationResponse,
            Error,
            FavouritePaginationResponse,
            readonly unknown[],
            number
        >,
        'queryKey' | 'queryFn' | 'initialPageParam' | 'getNextPageParam'
    >,
) {
    return prefetchInfiniteQuery({
        queryClient,
        queryKey: queryKeys.favourite.list(
            contentType,
            username,
            paginationArgs,
        ),
        queryFn: (client, page = paginationArgs?.page || 1) =>
            client.favourite.getList(contentType, username, {
                page,
                size: paginationArgs?.size,
            }),
        options,
    });
}
