'use client';

import { FC } from 'react';

import PagePagination from '@/components/page-pagination';
import Block from '@/components/ui/block';
import { Table, TableBody } from '@/components/ui/table';

import EditHead from '@/features/edit/edit-list/edit-head';
import EditRow from '@/features/edit/edit-list/edit-row';
import EditSkeleton from '@/features/edit/edit-list/edit-skeleton';
import FiltersNotFound from '@/features/filters/filters-not-found';

import useEditList from '@/services/hooks/edit/useEditList';

interface Props {
    page: string;
}

const EditList: FC<Props> = ({ page }) => {
    const { data: edits, isLoading } = useEditList({ page: page });

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
