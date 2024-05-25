'use client';

import { FC } from 'react';

import FiltersNotFound from '@/components/filters-not-found';
import PagePagination from '@/components/page-pagination';
import Block from '@/components/ui/block';
import { Table, TableBody } from '@/components/ui/table';

import EditHead from '@/features/edit/edit-list/edit-head';
import EditRow from '@/features/edit/edit-list/edit-row';
import EditSkeleton from '@/features/edit/edit-list/edit-skeleton';

import useEditList from '@/services/hooks/edit/use-edit-list';

interface Props {
    page: string;
}

const EditList: FC<Props> = ({ page }) => {
    const { data: edits, isLoading } = useEditList({ page: Number(page) });

    if (isLoading) {
        return <EditSkeleton />;
    }

    if (!edits) return null;

    if (edits.list.length === 0) {
        return <FiltersNotFound />;
    }

    return (
        <Block>
            <Table className="table">
                <EditHead />
                <TableBody>
                    {edits.list.map((edit) => (
                        <EditRow key={edit.edit_id} edit={edit} />
                    ))}
                </TableBody>
            </Table>
            <PagePagination pagination={edits.pagination} />
        </Block>
    );
};

export default EditList;
