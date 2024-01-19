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
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from '@/app/_components/ui/sheet';
import getContentEditList, {
    Response as EditListResponse,
} from '@/utils/api/edit/getContentEditList';
import { useModalContext } from '@/utils/providers/modal-provider';


const Component = () => {
    const { ref, inView } = useInView();
    const params = useParams();
    const { animeEditList, closeModals } = useModalContext();
    const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
        useInfiniteQuery<
            { list: Hikka.Edit[]; pagination: Hikka.Pagination },
            Error
        >({
            queryKey: ['editList', params.slug],
            queryFn: ({ pageParam = 1 }) =>
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
            enabled: Boolean(animeEditList),
        });

    const onDismiss = () => {
        closeModals();
    };

    const list = data && data.pages.map((data) => data.list).flat(1);

    useEffect(() => {
        if (inView && data) {
            fetchNextPage();
        }
    }, [inView]);

    return (
        <Sheet
            open={Boolean(animeEditList)}
            onOpenChange={(open) => !open && onDismiss()}
        >
            <SheetContent side="left" className="!max-w-xl flex flex-col gap-0 pb-0">
                <SheetHeader>
                    <SheetTitle>Список правок</SheetTitle>
                </SheetHeader>
                <div
                    className={clsx(
                        'relative py-6',
                    )}
                >
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
            </SheetContent>
        </Sheet>
    );
};

export default Component;