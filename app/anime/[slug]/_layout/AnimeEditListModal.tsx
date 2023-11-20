'use client';

import Modal from '@/app/_components/Modal';
import { useModalContext } from '@/utils/providers/ModalProvider';
import * as React from 'react';
import {useEffect, useState} from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import getEditList, {
    Response as EditListResponse,
} from '@/utils/api/edit/getEditList';
import EditCard from '@/app/anime/[slug]/_components/EditCard';
import AnimeEditModal from '@/app/anime/[slug]/_layout/AnimeEditModal';
import clsx from 'clsx';
import { useInView } from 'react-intersection-observer';

const Component = () => {
    const { ref, inView } = useInView();
    const params = useParams();
    const [edit, setEdit] = useState<Hikka.Edit | undefined>();
    const { animeEditList, closeModals, switchModal } = useModalContext();
    const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
        useInfiniteQuery<
            { list: Hikka.Edit[]; pagination: Hikka.Pagination },
            Error
        >({
            queryKey: ['editList', params.slug],
            queryFn: () =>
                getEditList({
                    slug: String(params.slug),
                    contentType: 'anime',
                }),
            getNextPageParam: (lastPage: EditListResponse, allPages) => {
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

    const openEditModal = (edit: Hikka.Edit) => {
        setEdit(edit);
        switchModal('animeEdit', true);
    };

    const list = data && data.pages.map((data) => data.list).flat(1);

    useEffect(() => {
        if (inView && data) {
            fetchNextPage();
        }
    }, [inView])

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
                    'relative py-8 px-8',
                    "after:content-[' '] after:z-10 after:absolute after:-bottom-[calc(2rem-1px)] after:left-0 after:w-full after:h-8 after:bg-gradient-to-b after:from-black after:to-transparent",
                )}
            >
                <button
                    className="btn w-full btn-secondary"
                    onClick={() => switchModal('animeEdit', true)}
                >
                    Створити правку
                </button>
            </div>
            {data && (
                <div className="overflow-y-scroll flex-1 pb-8">
                    {list!.map((edit) => (
                        <EditCard
                            onClick={() => openEditModal(edit)}
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
            <AnimeEditModal edit={edit} setEdit={setEdit} />
        </Modal>
    );
};

export default Component;
