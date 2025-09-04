'use client';

import { EditContentType, EditStatusEnum } from '@hikka/client';
import { useEditList } from '@hikka/react';
import { useSearchParams } from 'next/navigation';
import { FC } from 'react';

import FiltersNotFound from '@/components/filters-not-found';
import PagePagination from '@/components/page-pagination';
import Block from '@/components/ui/block';
import { Table, TableBody } from '@/components/ui/table';

import EditHead from './components/edit-list/edit-head';
import EditRow from './components/edit-list/edit-row';
import EditSkeleton from './components/edit-list/edit-skeleton';

interface Props {}

const EditList: FC<Props> = () => {
    const searchParams = useSearchParams();

    const page = searchParams.get('page') || '1';
    const content_type =
        (searchParams.get('content_type') as EditContentType) || undefined;
    const order = searchParams.get('order') || 'desc';
    const sort = searchParams.get('sort') || 'edit_id';
    const edit_status =
        (searchParams.get('edit_status') as EditStatusEnum) || undefined;
    const author = searchParams.get('author');
    const moderator = searchParams.get('moderator');

    const { list, isLoading, pagination } = useEditList({
        args: {
            content_type,
            sort: [`${sort}:${order}`],
            status: edit_status,
            author,
            moderator,
        },
        paginationArgs: {
            page: Number(page),
        },
    });

    if (isLoading) {
        return <EditSkeleton />;
    }

    if (!list) return null;

    if (list && list.length === 0) {
        return <FiltersNotFound />;
    }

    return (
        <Block>
            <Table className="table">
                <EditHead />
                <TableBody>
                    {list.map((edit) => (
                        <EditRow key={edit.edit_id} edit={edit} />
                    ))}
                </TableBody>
            </Table>
            {pagination && <PagePagination pagination={pagination} />}
        </Block>
    );
};

export default EditList;
