'use client';

import {
    QueryFunction,
    QueryKey,
    useInfiniteQuery,
} from '@tanstack/react-query';
import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

interface Props<T> extends Hikka.QueryOptions {
    queryFn: QueryFunction<API.WithPagination<T>, this['queryKey'], number>;
    queryKey: QueryKey;
    select?: (data: {
        pages: API.WithPagination<T>[];
        pageParams: Array<unknown>;
    }) => {
        pages: API.WithPagination<T>[];
        pageParams: Array<unknown>;
    };
}

function useInfiniteList<T>({
    queryFn,
    queryKey,
    staleTime,
    gcTime,
    enabled,
    select,
}: Props<T>) {
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
        select,
    });

    const list = query.data?.pages.map((data) => data.list).flat(1);
    const pagination = query.data?.pages[0].pagination;

    useEffect(() => {
        if (inView) {
            query.fetchNextPage();
        }
    }, [inView]);

    return { ...query, list, pagination, queryKey, ref };
}

export default useInfiniteList;
