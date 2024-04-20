'use client';

import * as React from 'react';

import EditHead from '@/app/(pages)/edit/components/edit-list/components/edit-head';
import EditRow from '@/app/(pages)/edit/components/edit-list/components/edit-row';
import EditSkeleton from '@/app/(pages)/edit/components/edit-list/components/edit-skeleton';
import FiltersNotFound from '@/components/filters/components/filters-not-found';
import PagePagination from '@/components/page-pagination';
import Block from '@/components/ui/block';
import { Table, TableBody } from '@/components/ui/table';
import useEditList from '@/services/hooks/edit/useEditList';

interface Props {
    page: string;
}

const EditList = ({ page }: Props) => {
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
