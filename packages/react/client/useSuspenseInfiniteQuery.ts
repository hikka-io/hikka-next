'use client';

import { PaginatedResponse } from '@hikka/client';
import {
    InfiniteData,
    UseSuspenseInfiniteQueryOptions,
    useSuspenseInfiniteQuery as useTanstackSuspenseInfiniteQuery,
} from '@tanstack/react-query';
import React from 'react';
import { useInView } from 'react-intersection-observer';

import { useHikkaClient } from '@/client/provider/useHikkaClient';
import { addDeepTitleProperties } from '@/utils';

/**
 * Hook for creating suspense infinite queries with the Hikka client.
 * Use this when data is guaranteed to be in cache (e.g., pre-loaded via route loader).
 * Unlike useInfiniteQuery, data is never undefined and loading states are handled by Suspense boundaries.
 */
export function useSuspenseInfiniteQuery<
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
        UseSuspenseInfiniteQueryOptions<
            PaginatedResponse<TItem>,
            TError,
            InfiniteData<PaginatedResponse<TItem>>,
            TQueryKey,
            number
        >,
        'queryKey' | 'queryFn' | 'getNextPageParam' | 'initialPageParam'
    > & {
        initialPageParam?: number;
    };
}) {
    const { ref, inView } = useInView();
    const { defaultOptions } = useHikkaClient();

    const query = useTanstackSuspenseInfiniteQuery<
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

    const list = query.data.pages.map((data) => data.list).flat(1);
    const pagination =
        query.data.pages[query.data.pages.length - 1]?.pagination;

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
