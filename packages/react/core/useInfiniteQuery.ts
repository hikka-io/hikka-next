import { PaginationArgs, PaginationResponse } from '@hikka/client';
import {
    InfiniteData,
    UseInfiniteQueryOptions,
    useInfiniteQuery as useTanstackInfiniteQuery,
} from '@tanstack/react-query';
import React from 'react';
import { useInView } from 'react-intersection-observer';

import { useHikkaClient } from '../provider/useHikkaClient';

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
        'queryKey' | 'queryFn' | 'initialPageParam' | 'getNextPageParam'
    >;
    /** Pagination arguments */
    paginationArgs?: PaginationArgs;
}

// Define the structure of the API response
export interface ListResponse<T> {
    list: T[];
    pagination: PaginationResponse;
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
        client: ReturnType<typeof useHikkaClient>,
        pageParam: number,
    ) => Promise<ListResponse<TItem>>;
    options?: Omit<
        UseInfiniteQueryOptions<
            ListResponse<TItem>,
            TError,
            InfiniteData<ListResponse<TItem>>,
            ListResponse<TItem>,
            TQueryKey,
            number
        >,
        'queryKey' | 'queryFn' | 'initialPageParam' | 'getNextPageParam'
    > & {
        getNextPageParam?: (
            lastPage: ListResponse<TItem>,
        ) => number | undefined | null;
    };
}) {
    const { ref, inView } = useInView();
    const client = useHikkaClient();

    const query = useTanstackInfiniteQuery<
        ListResponse<TItem>,
        TError,
        InfiniteData<ListResponse<TItem>>,
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
    });

    const list =
        query.data && query.data?.pages.map((data) => data.list).flat(1);
    const pagination = query.data?.pages[0]?.pagination;

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
