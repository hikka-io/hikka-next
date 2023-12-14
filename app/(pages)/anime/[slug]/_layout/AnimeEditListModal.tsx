'use client';

import clsx from 'clsx';
import * as React from 'react';
import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

import Link from 'next/link';
import { useParams } from 'next/navigation';

import { useInfiniteQuery } from '@tanstack/react-query';

import EditCard from '@/app/_components/EditCard';
import Modal from '@/app/_components/Modal';
import getContentEditList, {
    Response as EditListResponse,
} from '@/utils/api/edit/getContentEditList';
import { useModalContext } from '@/utils/providers/ModalProvider';

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
        <Modal
            noEscape
            open={Boolean(animeEditList)}
            onDismiss={onDismiss}
            id="animeEditListModal"
            boxClassName="p-0 flex flex-col relative !max-w-xl"
            title="Список правок"
        >
            <div
                className={clsx(
                    'relative px-8 py-8 border-b-secondary',
                    data && list!.length > 0 && 'border-b'
                )}
            >
                <Link
                    className="btn btn-secondary w-full"
                    href={`/edit/anime/` + params.slug}
                >
                    Створити правку
                </Link>
            </div>
            {data && list!.length > 0 && (
                <div className="flex-1 overflow-y-scroll pb-8">
                    {list!.map((edit) => (
                        <EditCard
                            href={`/edit/` + edit.edit_id}
                            key={edit.edit_id}
                            edit={edit}
                        />
                    ))}
                    {hasNextPage && (
                        <div className="px-8 py-4">
                            <button
                                ref={ref}
                                disabled={isFetchingNextPage}
                                onClick={() => fetchNextPage()}
                                className="btn btn-secondary w-full"
                            >
                                {isFetchingNextPage && (
                                    <span className="loading loading-spinner"></span>
                                )}
                                Заванатажити ще
                            </button>
                        </div>
                    )}
                </div>
            )}
        </Modal>
    );
};

export default Component;
