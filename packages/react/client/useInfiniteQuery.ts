'use client';

import { HikkaClient, PaginatedResponse, PaginationArgs } from '@hikka/client';
import {
    InfiniteData,
    UseInfiniteQueryOptions,
    useInfiniteQuery as useTanstackInfiniteQuery,
} from '@tanstack/react-query';
import React from 'react';
import { useInView } from 'react-intersection-observer';

import { useHikkaClient } from '@/client/provider/useHikkaClient';
import { addDeepTitleProperties } from '@/utils';

/**
 * Hook params for creating infinite queries
 */
export interface InfiniteQueryParams<T> {
    /** Query options */
    options?: Omit<
        UseInfiniteQueryOptions<
            T,
            Error,
            InfiniteData<T>,
            T,
            readonly unknown[],
            number
        >,
        'queryKey' | 'queryFn' | 'getNextPageParam' | 'initialPageParam'
    > & {
        initialPageParam?: number;
    };
    /** Pagination arguments */
    paginationArgs?: PaginationArgs;
    queryKey?: unknown[];
}

/**
 * Hook for creating infinite queries with the Hikka client.
 * Automatically provides the client to the queryFn.
 */
export function useInfiniteQuery<
    TItem,
    TError = Error,
    TQueryKey extends readonly unknown[] = readonly unknown[],
>({
    queryKey,
    queryFn,
    options,
}: {
    queryKey: TQueryKey;
    queryFn: (
        client: HikkaClient,
        pageParam: number,
    ) => Promise<PaginatedResponse<TItem>>;
    options?: Omit<
        UseInfiniteQueryOptions<
            PaginatedResponse<TItem>,
            TError,
            InfiniteData<PaginatedResponse<TItem>>,
            PaginatedResponse<TItem>,
            TQueryKey,
            number
        >,
        'queryKey' | 'queryFn' | 'initialPageParam' | 'getNextPageParam'
    > & {
        getNextPageParam?: (
            lastPage: PaginatedResponse<TItem>,
        ) => number | undefined | null;
        authProtected?: boolean;
    };
}) {
    const { ref, inView } = useInView();
    const { client, defaultOptions } = useHikkaClient();

    const query = useTanstackInfiniteQuery<
        PaginatedResponse<TItem>,
        TError,
        InfiniteData<PaginatedResponse<TItem>>,
        TQueryKey,
        number
    >({
        queryKey,
        queryFn: ({ pageParam }) => queryFn(client, pageParam),
        initialPageParam: 1, // Default to page 1
        getNextPageParam: (lastPage) => {
            // Use custom getNextPageParam if provided
            if (options?.getNextPageParam) {
                return options.getNextPageParam(lastPage);
            }

            // Default implementation for pagination
            const nextPage = lastPage.pagination.page + 1;
            return nextPage > lastPage.pagination.pages ? null : nextPage;
        },
        ...options,
        enabled: options?.authProtected
            ? !!client.getAuthToken() && options?.enabled
            : options?.enabled,
        select: options?.select
            ? (data) =>
                  options.select!(
                      addDeepTitleProperties(
                          data,
                          defaultOptions?.title,
                          defaultOptions?.name,
                      ),
                  )
            : (data) =>
                  addDeepTitleProperties(
                      data,
                      defaultOptions?.title,
                      defaultOptions?.name,
                  ) as unknown as InfiniteData<PaginatedResponse<TItem>>,
    });

    const list =
        query.data && query.data?.pages.map((data) => data.list).flat(1);
    const pagination =
        query.data &&
        query.data?.pages[query.data?.pages.length - 1]?.pagination;

    React.useEffect(() => {
        if (inView) {
            query.fetchNextPage();
        }
    }, [inView]);

    return {
        ...query,
        list,
        pagination,
        ref,
    };
}
