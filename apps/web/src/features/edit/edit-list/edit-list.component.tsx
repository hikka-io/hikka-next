'use client';

import { EditContentType, EditStatusEnum } from '@hikka/client';
import { useEditList } from '@hikka/react';
import { useSearchParams } from 'next/navigation';
import { FC } from 'react';

import FiltersNotFound from '@/components/filters-not-found';
import PagePagination from '@/components/page-pagination';
import Block from '@/components/ui/block';
import { Table, TableBody } from '@/components/ui/table';

import EditHead from './edit-head';
import EditRow from './edit-row';
import EditSkeleton from './edit-skeleton';

interface Props {
    page: string;
}

const EditList: FC<Props> = ({ page }) => {
    const searchParams = useSearchParams();

    const content_type =
        (searchParams.get('content_type') as EditContentType) || undefined;
    const order = searchParams.get('order') || 'desc';
    const sort = searchParams.get('sort') || 'edit_id';
    const edit_status =
        (searchParams.get('edit_status') as EditStatusEnum) || undefined;
    const author = searchParams.get('author');
    const moderator = searchParams.get('moderator');

    const { data: edits, isLoading } = useEditList({
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

    if (!edits) return null;

    if (
        edits.pages[Number(page) - 1] &&
        edits.pages[Number(page) - 1].list.length === 0
    ) {
        return <FiltersNotFound />;
    }

    return (
        <Block>
            <Table className="table">
                <EditHead />
                <TableBody>
                    {edits.pages[Number(page) - 1].list.map((edit) => (
                        <EditRow key={edit.edit_id} edit={edit} />
                    ))}
                </TableBody>
            </Table>
            <PagePagination
                pagination={edits.pages[Number(page) - 1].pagination}
            />
        </Block>
    );
};

export default EditList;
