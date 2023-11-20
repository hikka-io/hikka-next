'use client';

import { useModalContext } from '@/utils/providers/ModalProvider';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import getEditList, {
    Response as EditListResponse,
} from '@/utils/api/edit/getEditList';
import AnimeEditModal from '@/app/_layout/AnimeEditModal';
import { useInView } from 'react-intersection-observer';
import clsx from 'clsx';
import { EDIT_STATUS } from '@/utils/constants';
import BaseCard from '@/app/_components/BaseCard';
import { format } from 'date-fns';
import Link from 'next/link';
import setDefaultOptions from 'date-fns/setDefaultOptions';
import { uk } from 'date-fns/locale';
import { useAuthContext } from '@/utils/providers/AuthProvider';

const Component = () => {
    setDefaultOptions({ locale: uk });
    const params = useParams();
    const queryClient = useQueryClient();
    const { secret } = useAuthContext();
    const [go, setGo] = useState(false);
    const { ref, inView } = useInView();
    const [edit, setEdit] = useState<Hikka.Edit | undefined>();
    const { switchModal } = useModalContext();

    const user: Hikka.User | undefined = queryClient.getQueryData([
        'user',
        params.username,
    ]);

    const loggedUser: Hikka.User | undefined = queryClient.getQueryData([
        'loggedUser',
        secret,
    ]);

    const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
        useInfiniteQuery<
            { list: Hikka.Edit[]; pagination: Hikka.Pagination },
            Error
        >({
            queryKey: ['editList', params.slug],
            queryFn: ({ pageParam = 1 }) =>
                getEditList({
                    page: pageParam,
                }),
            getNextPageParam: (lastPage: EditListResponse) => {
                const nextPage = lastPage.pagination.page + 1;
                return nextPage > lastPage.pagination.pages
                    ? undefined
                    : nextPage;
            },
        });

    const openEditModal = (edit: Hikka.Edit) => {
        setEdit(edit);
        switchModal('animeEdit');
    };

    const list = data && data.pages.map((data) => data.list).flat(1);

    useEffect(() => {
        if (inView && data) {
            fetchNextPage();
        }
    }, [inView]);

    if (
        loggedUser?.username !== user?.username ||
        !(loggedUser?.role === 'moderator' || loggedUser?.role === 'admin')
    ) {
        return null;
    }

    return (
        <div className="flex flex-col gap-8">
            <div className="overflow-x-auto">
                <table className="table">
                    <thead className="bg-secondary/30 overflow-hidden rounded-lg">
                        <tr>
                            <th className="w-8">#</th>
                            <th>Автор</th>
                            <th align="left">Контент</th>
                            <th className=" hidden lg:table-cell" align="left">
                                Опис
                            </th>
                            <th align="center" className="w-20">
                                Статус
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {list &&
                            list.map((edit) => (
                                <tr
                                    key={edit.edit_id}
                                    className={clsx(
                                        'hover:bg-secondary/60 hover:cursor-pointer',
                                    )}
                                    onClick={() => !go && openEditModal(edit)}
                                >
                                    <th className="w-8 text-neutral">
                                        {edit.edit_id}
                                    </th>
                                    <td>
                                        <div className="flex gap-4">
                                            <div className="w-12">
                                                <BaseCard
                                                    containerClassName="!pt-[100%]"
                                                    poster={edit.author.avatar}
                                                />
                                            </div>
                                            <div className="flex flex-col">
                                                <Link
                                                    className="hover:underline"
                                                    href={`/u/${edit.author.username}`}
                                                    onClick={() => setGo(true)}
                                                >
                                                    {edit.author.username}
                                                </Link>
                                                <p className="opacity-30 text-xs">
                                                    {format(
                                                        edit.created * 1000,
                                                        'd MMM yyyy kk:mm',
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td align="left">
                                        {edit.content_type === 'anime' &&
                                        'title_en' in edit.content ? (
                                            <Link
                                                className="hover:underline"
                                                href={`/anime/${edit.content.slug}`}
                                                onClick={() => setGo(true)}
                                            >
                                                {edit.content.title_ua ||
                                                    edit.content.title_en ||
                                                    edit.content.title_ja}
                                            </Link>
                                        ) : (
                                            'name_ua' in edit.content &&
                                            (edit.content.name_ua ||
                                                edit.content.name_en)
                                        )}
                                    </td>
                                    <td
                                        className=" hidden lg:table-cell"
                                        align="left"
                                    >
                                        <p
                                            className={clsx(
                                                !edit.description &&
                                                    'opacity-30',
                                            )}
                                        >
                                            {edit.description
                                                ? edit.description
                                                : 'Немає опису правки'}
                                        </p>
                                    </td>
                                    <th align="center" className="w-20">
                                        <div className="flex justify-end">
                                            <div
                                                className="rounded-md whitespace-nowrap px-2"
                                                style={{
                                                    backgroundColor:
                                                        EDIT_STATUS[edit.status]
                                                            .color,
                                                }}
                                            >
                                                <p className="text-base font-normal">
                                                    {
                                                        EDIT_STATUS[
                                                            edit.status as Hikka.EditStatus
                                                        ].title_ua
                                                    }
                                                </p>
                                            </div>
                                        </div>
                                    </th>
                                </tr>
                            ))}
                    </tbody>
                </table>
                {!go && <AnimeEditModal edit={edit} setEdit={setEdit} />}
            </div>
            {hasNextPage && (
                <button
                    ref={ref}
                    disabled={isFetchingNextPage}
                    onClick={() => fetchNextPage()}
                    className="btn btn-secondary"
                >
                    {isFetchingNextPage && (
                        <span className="loading loading-spinner"></span>
                    )}
                    Заванатажити ще
                </button>
            )}
        </div>
    );
};

export default Component;
