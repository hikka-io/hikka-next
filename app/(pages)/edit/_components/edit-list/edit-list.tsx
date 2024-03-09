'use client';

import * as React from 'react';

import PagePagination from '@/components/page-pagination';
import {
    Table,
    TableBody,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import useEditList from '@/services/hooks/edit/useEditList';

import EditRow from './_components/edit-row';

interface Props {
    page: string;
}

const Component = ({ page }: Props) => {
    const { data: edits } = useEditList({ page: page });

    if (!edits) return null;

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
