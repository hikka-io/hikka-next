'use client';

import clsx from 'clsx';
import * as React from 'react';
import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

import Link from 'next/link';
import { useParams } from 'next/navigation';

import { useInfiniteQuery } from '@tanstack/react-query';

import EditCard from '@/app/_components/edit-card';
import { Button } from '@/app/_components/ui/button';
import getContentEditList, {
    Response as EditListResponse,
} from '@/utils/api/edit/getContentEditList';


const Component = () => {
    const { ref, inView } = useInView();
    const params = useParams();
    const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
        useInfiniteQuery({
            initialPageParam: 1,
            queryKey: ['editList', params.slug],
            queryFn: ({ pageParam }) =>
                getContentEditList({
                    slug: String(params.slug),
                    contentType: 'anime',
                    page: pageParam,
                }),
            getNextPageParam: (lastPage: EditListResponse) => {
                const nextPage = lastPage.pagination.page + 1;
                return nextPage > lastPage.pagination.pages
                    ? undefined
                    : nextPage;
            },
        });

    const list = data && data.pages.map((data) => data.list).flat(1);

    useEffect(() => {
        if (inView && data) {
            fetchNextPage();
        }
    }, [inView]);

    return (
        <>
            <div className={clsx('relative py-6')}>
                <Button variant="secondary" className="w-full" asChild>
                    <Link href={`/edit/anime/` + params.slug}>
                        Створити правку
                    </Link>
                </Button>
            </div>
            <hr className="h-[1px] w-auto -mx-6 bg-border" />
            {data && list!.length > 0 && (
                <div className="flex-1 overflow-y-scroll w-auto h-full -mx-6">
                    {list!.map((edit) => (
                        <EditCard
                            href={`/edit/` + edit.edit_id}
                            key={edit.edit_id}
                            edit={edit}
                        />
                    ))}
                    {hasNextPage && (
                        <div className="px-8 py-4">
                            <Button
                                variant="secondary"
                                ref={ref}
                                disabled={isFetchingNextPage}
                                onClick={() => fetchNextPage()}
                                className="w-full"
                            >
                                {isFetchingNextPage && (
                                    <span className="loading loading-spinner"></span>
                                )}
                                Заванатажити ще
                            </Button>
                        </div>
                    )}
                </div>
            )}
        </>
    );
};

export default Component;