'use client';

import {
    QueryFunction,
    QueryKey,
    useInfiniteQuery,
} from '@tanstack/react-query';
import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

interface Props<T> {
    queryFn: QueryFunction<Hikka.WithPagination<T>, this['queryKey'], number>;
    queryKey: QueryKey;
}

function useInfiniteList<T>({ queryFn, queryKey }: Props<T>) {
    const { ref, inView } = useInView();
    const query = useInfiniteQuery({
        initialPageParam: 1,
        queryKey: queryKey,
        getNextPageParam: (lastPage: Hikka.WithPagination<T>, allPages) => {
            const nextPage = lastPage.pagination.page + 1;
            return nextPage > lastPage.pagination.pages ? undefined : nextPage;
        },
        queryFn: queryFn,
    });

    const list = query.data?.pages.map((data) => data.list).flat(1);

    useEffect(() => {
        if (inView) {
            query.fetchNextPage();
        }
    }, [inView]);

    return { ...query, list, ref };
}

export default useInfiniteList;