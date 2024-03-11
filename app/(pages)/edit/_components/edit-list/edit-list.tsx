'use client';

import * as React from 'react';

import { range } from '@antfu/utils';

import EditHead from '@/app/(pages)/edit/_components/edit-list/_components/edit-head';
import PagePagination from '@/components/page-pagination';
import EntryTableRow from '@/components/skeletons/entry-table-row';
import { Table, TableBody } from '@/components/ui/table';
import useEditList from '@/services/hooks/edit/useEditList';

import EditRow from './_components/edit-row';

interface Props {
    page: string;
}

const Component = ({ page }: Props) => {
    const { data: edits, isLoading } = useEditList({ page: page });

    if (isLoading) {
        return (
            <div className="flex flex-col gap-8">
                <div className="overflow-x-auto">
                    <Table className="table">
                        <EditHead />
                        <TableBody>
                            {range(1, 20).map((v) => (
                                <EntryTableRow key={v} />
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        );
    }

    if (!edits) return null;

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

export default Component;
