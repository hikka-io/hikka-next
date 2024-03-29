'use client';

import * as React from 'react';

import EditHead from '@/app/(pages)/edit/components/edit-list/components/edit-head';
import FiltersNotFound from '@/components/filters/components/filters-not-found';
import PagePagination from '@/components/page-pagination';
import { Table, TableBody } from '@/components/ui/table';
import useEditList from '@/services/hooks/edit/useEditList';

import EditRow from '@/app/(pages)/edit/components/edit-list/components/edit-row';
import EditSkeleton from '@/app/(pages)/edit/components/edit-list/components/edit-skeleton';

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
        <div className="flex flex-col gap-8">
            <div className="overflow-x-auto">
                <Table className="table">
                    <EditHead />
                    <TableBody>
                        {edits.list.map((edit) => (
                            <EditRow key={edit.edit_id} edit={edit} />
                        ))}
                    </TableBody>
                </Table>
            </div>
            <PagePagination pagination={edits.pagination} />
        </div>
    );
};

export default EditList;
