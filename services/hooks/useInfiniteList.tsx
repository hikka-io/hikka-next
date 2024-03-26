'use client';

import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

import {
    QueryFunction,
    QueryKey, UndefinedInitialDataInfiniteOptions,
    useInfiniteQuery,
} from '@tanstack/react-query';

interface Props<T> {
    queryFn: QueryFunction<API.WithPagination<T>, this['queryKey'], number>;
    queryKey: QueryKey;
    staleTime?: number;
    gcTime?: number;
    enabled?: boolean;
}

function useInfiniteList<T>({ queryFn, queryKey, staleTime, gcTime, enabled }: Props<T>) {
    const { ref, inView } = useInView();
    const query = useInfiniteQuery({
        initialPageParam: 1,
        queryKey: queryKey,
        getNextPageParam: (lastPage: API.WithPagination<T>, allPages) => {
            const nextPage = lastPage.pagination.page + 1;
            return nextPage > lastPage.pagination.pages ? undefined : nextPage;
        },
        queryFn: queryFn,
        staleTime,
        gcTime,
        enabled,
        refetchOnMount: false,
    });

    const list = query.data?.pages.map((data) => data.list).flat(1);
    const pagination = query.data?.pages[0].pagination;

    useEffect(() => {
        if (inView) {
            query.fetchNextPage();
        }
    }, [inView]);

    return { ...query, list, pagination, ref };
}

export default useInfiniteList;