'use client';

import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

import {
    QueryFunction,
    QueryKey, UndefinedInitialDataInfiniteOptions,
    useInfiniteQuery,
} from '@tanstack/react-query';

interface Props<T> {
    queryFn: QueryFunction<Hikka.WithPagination<T>, this['queryKey'], number>;
    queryKey: QueryKey;
    staleTime?: number;
    gcTime?: number;
}

function useInfiniteList<T>({ queryFn, queryKey, staleTime, gcTime }: Props<T>) {
    const { ref, inView } = useInView();
    const query = useInfiniteQuery({
        initialPageParam: 1,
        queryKey: queryKey,
        getNextPageParam: (lastPage: Hikka.WithPagination<T>, allPages) => {
            const nextPage = lastPage.pagination.page + 1;
            return nextPage > lastPage.pagination.pages ? undefined : nextPage;
        },
        queryFn: queryFn,
        staleTime,
        gcTime,
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