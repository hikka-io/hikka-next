'use client';

import Modal from '@/app/_components/Modal';
import { useModalContext } from '@/utils/providers/ModalProvider';
import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import getEditList from '@/utils/api/edit/getEditList';
import EditCard from '@/app/anime/[slug]/_components/EditCard';
import AnimeEditModal from "@/app/anime/[slug]/_layout/AnimeEditModal";
import {useState} from "react";
import clsx from "clsx";

const Component = () => {
    const params = useParams();
    const [edit, setEdit] = useState<Hikka.Edit | undefined>();
    const { animeEditList, closeModals, switchModal } = useModalContext();
    const { data, isLoading, error } = useQuery<
        { list: Hikka.Edit[]; pagination: Hikka.Pagination },
        Error
    >({
        queryKey: ['editList', params.slug],
        queryFn: () =>
            getEditList({ slug: String(params.slug), contentType: 'anime' }),
        enabled: Boolean(animeEditList),
    });

    const onDismiss = () => {
        closeModals();
    };

    const openEditModal = (edit: Hikka.Edit) => {
        setEdit(edit);
        switchModal('animeEdit');
    }

    return (
        <Modal
            open={Boolean(animeEditList)}
            onDismiss={onDismiss}
            id="searchModal"
            boxClassName="p-0 flex flex-col relative !max-w-xl"
            title="Список правок"
        >
            <div
                className={clsx(
                    'relative py-8 px-8',
                    "after:content-[' '] after:z-10 after:absolute after:-bottom-[calc(2rem-1px)] after:left-0 after:w-full after:h-8 after:bg-gradient-to-b after:from-black after:to-transparent",
                )}
            >
                <button className="btn w-full btn-secondary" onClick={() => switchModal('animeEdit')}>Створити правку</button>
            </div>
            {data && (
                <div className="overflow-y-scroll flex-1 pb-8">
                    {data.list.map((edit) => (
                        <EditCard onClick={() => openEditModal(edit)} key={edit.edit_id} edit={edit} />
                    ))}
                </div>
            )}
            <AnimeEditModal edit={edit} setEdit={setEdit} />
        </Modal>
    );
};

export default Component;
