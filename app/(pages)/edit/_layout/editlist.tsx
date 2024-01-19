'use client';

import clsx from 'clsx';
import { format } from 'date-fns';
import * as React from 'react';
import { useCallback, useEffect, useState } from 'react';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';

import { useQuery } from '@tanstack/react-query';

import BaseCard from '@/app/_components/base-card';
import Pagination from '@/app/_components/pagination';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/app/_components/ui/table';
import AnimeEditModal from '@/app/_layout/anime-edit-modal';
import getEditList from '@/utils/api/edit/getEditList';
import { useSettingsContext } from '@/utils/providers/settings-provider';
import useRouter from '@/utils/useRouter';

import EditStatus from '../_components/edit-status';


const Component = () => {
    const { titleLanguage } = useSettingsContext();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const page = searchParams.get('page');
    const [selectedPage, setSelectedPage] = useState(page ? Number(page) : 1);

    const [go, setGo] = useState(false);
    const [edit, setEdit] = useState<Hikka.Edit | undefined>();
    const router = useRouter();

    const { data } = useQuery<
        { list: Hikka.Edit[]; pagination: Hikka.Pagination },
        Error
    >({
        queryKey: ['editList', selectedPage],
        queryFn: () =>
            getEditList({
                page: selectedPage,
            }),
    });

    const createQueryString = useCallback(
        (name: string, value: string | null) => {
            const params = new URLSearchParams(searchParams);

            if (value) {
                params.set(name, value);
            } else {
                params.delete(name);
            }

            return params.toString();
        },
        [searchParams],
    );

    useEffect(() => {
        const query = createQueryString('page', String(selectedPage));
        router.push(`${pathname}?${query}`, { scroll: true });
    }, [selectedPage]);

    useEffect(() => {
        if (page) {
            setSelectedPage(Number(page));
        }
    }, [page]);

    return (
        <div className="flex flex-col gap-8">
            <div className="overflow-x-auto">
                <Table className="table">
                    <TableHeader className="overflow-hidden rounded-lg bg-secondary/30">
                        <TableRow>
                            <TableHead className="w-8">#</TableHead>
                            <TableHead>Автор</TableHead>
                            <TableHead align="left">Контент</TableHead>
                            <TableHead
                                className=" hidden lg:table-cell"
                                align="left"
                            >
                                Опис
                            </TableHead>
                            <TableHead align="center" className="w-20">
                                Статус
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data &&
                            data.list.map((edit) => (
                                <TableRow
                                    key={edit.edit_id}
                                    className={clsx(
                                        'hover:cursor-pointer hover:bg-secondary/60',
                                    )}
                                    onClick={() =>
                                        !go &&
                                        router.push('/edit/' + edit.edit_id)
                                    }
                                >
                                    <TableHead className="label-text w-8">
                                        {edit.edit_id}
                                    </TableHead>
                                    <TableCell>
                                        <div className="flex gap-4">
                                            <div className="w-10 h-10">
                                                <BaseCard
                                                    containerClassName="!pt-[100%]"
                                                    poster={edit.author!.avatar}
                                                />
                                            </div>
                                            <div className="flex flex-col">
                                                <Link
                                                    className="hover:underline"
                                                    href={`/u/${
                                                        edit.author!.username
                                                    }`}
                                                    onClick={() => setGo(true)}
                                                >
                                                    {edit.author!.username}
                                                </Link>
                                                <p className="label-text-alt opacity-60">
                                                    {format(
                                                        edit.created * 1000,
                                                        'd MMM yyyy kk:mm',
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell align="left">
                                        <div className="flex gap-4">
                                            {edit.content_type === 'anime' &&
                                            'title_en' in edit.content ? (
                                                <Link
                                                    className="hover:underline"
                                                    href={`/anime/${edit.content.slug}`}
                                                    onClick={() => setGo(true)}
                                                >
                                                    {edit.content[
                                                        titleLanguage!
                                                    ] ||
                                                        edit.content.title_ua ||
                                                        edit.content.title_en ||
                                                        edit.content.title_ja}
                                                </Link>
                                            ) : (
                                                'name_ua' in edit.content &&
                                                (edit.content.name_ua ||
                                                    edit.content.name_en)
                                            )}
                                        </div>
                                        <p className="label-text-alt opacity-60">
                                            {edit.content_type === 'anime'
                                                ? 'Аніме'
                                                : 'Автор'}
                                        </p>
                                    </TableCell>
                                    <TableCell
                                        className=" hidden lg:table-cell"
                                        align="left"
                                    >
                                        <p
                                            className={clsx(
                                                'label-text',
                                                !edit.description &&
                                                    'opacity-60',
                                            )}
                                        >
                                            {edit.description
                                                ? edit.description
                                                : 'Немає опису правки'}
                                        </p>
                                    </TableCell>
                                    <TableCell align="center" className="w-20">
                                        <div className="flex justify-end">
                                            <EditStatus status={edit.status} />
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
                {!go && <AnimeEditModal edit={edit} setEdit={setEdit} />}
            </div>
            {data && data.pagination.pages > 1 && (
                <Pagination
                    page={selectedPage}
                    pages={data.pagination.pages}
                    setPage={setSelectedPage}
                />
            )}
        </div>
    );
};

export default Component;