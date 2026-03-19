'use client';

import { PaginatedResponse, PaginationArgs } from '@hikka/client';
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
export interface InfiniteQueryParams<
    T,
    TQueryKey extends readonly unknown[] = readonly unknown[],
> {
    /** Query options */
    options?: Omit<
        UseInfiniteQueryOptions<T, Error, InfiniteData<T>, TQueryKey, number>,
        'queryKey' | 'queryFn' | 'getNextPageParam' | 'initialPageParam'
    > & {
        authProtected?: boolean;
        initialPageParam?: number;
    };
    /** Pagination arguments */
    paginationArgs?: PaginationArgs;
    queryKey?: TQueryKey;
}

/**
 * Hook for creating infinite queries with the Hikka client.
 * Accepts standard TanStack queryFn and pagination options.
 */
export function useInfiniteQuery<
    TItem,
    TError = Error,
    TQueryKey extends readonly unknown[] = readonly unknown[],
>({
    queryKey,
    queryFn,
    initialPageParam,
    getNextPageParam,
    options,
}: {
    queryKey: TQueryKey;
    queryFn?: (
        ...args: any[]
    ) => PaginatedResponse<TItem> | Promise<PaginatedResponse<TItem>>;
    initialPageParam?: number;
    getNextPageParam?: (...args: any[]) => number | undefined | null;
    options?: Omit<
        UseInfiniteQueryOptions<
            PaginatedResponse<TItem>,
            TError,
            InfiniteData<PaginatedResponse<TItem>>,
            TQueryKey,
            number
        >,
        'queryKey' | 'queryFn' | 'getNextPageParam' | 'initialPageParam'
    > & {
        authProtected?: boolean;
        initialPageParam?: number;
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
        queryFn: queryFn!,
        initialPageParam: options?.initialPageParam ?? initialPageParam ?? 1,
        getNextPageParam:
            getNextPageParam ??
            ((lastPage) => {
                const nextPage = lastPage.pagination.page + 1;
                return nextPage > lastPage.pagination.pages ? null : nextPage;
            }),
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
