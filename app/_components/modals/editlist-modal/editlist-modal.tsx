'use client';

import clsx from 'clsx';
import * as React from 'react';
import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

import Link from 'next/link';

import EditCard from '@/app/_components/modals/editlist-modal/_components/ui/edit-card';
import { Button } from '@/app/_components/ui/button';
import getContentEditList from '@/app/_utils/api/edit/getContentEditList';
import useInfiniteList from '@/app/_utils/hooks/useInfiniteList';

interface Props {
    content_type: Hikka.ContentType;
    slug: string;
}

const Component = ({ content_type, slug }: Props) => {
    const { ref, inView } = useInView();
    const { list, fetchNextPage, hasNextPage, isFetchingNextPage } =
        useInfiniteList({
            queryKey: ['editList', slug, content_type],
            queryFn: ({ pageParam }) =>
                getContentEditList({
                    slug: slug,
                    content_type: content_type,
                    page: pageParam,
                }),
        });

    useEffect(() => {
        if (inView) {
            fetchNextPage();
        }
    }, [inView]);

    if (!list) {
        return null;
    }

    return (
        <>
            <div className={clsx('relative py-6')}>
                <Button variant="secondary" className="w-full" asChild>
                    <Link
                        href={`/edit/new?slug=${slug}&content_type=${content_type}`}
                    >
                        Створити правку
                    </Link>
                </Button>
            </div>
            <hr className="h-[1px] w-auto -mx-6 bg-border" />
            {list!.length > 0 && (
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