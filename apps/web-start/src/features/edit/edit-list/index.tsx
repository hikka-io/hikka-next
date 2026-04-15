'use client';

import { EditContentType, EditStatusEnum } from '@hikka/client';
import { useEditList } from '@hikka/react';
import { FC } from 'react';

import FiltersNotFound from '@/components/filters-not-found';
import PagePagination from '@/components/page-pagination';
import Block from '@/components/ui/block';
import { Table, TableBody } from '@/components/ui/table';

import { useFilterSearch } from '@/features/filters/hooks/use-filter-search';
import { expandSort } from '@/features/filters/sort';

import type { EditSearch } from '@/utils/search-schemas';

import EditHead from './components/edit-head';
import EditRow from './components/edit-row';
import EditSkeleton from './components/edit-skeleton';

interface Props {}

const EditList: FC<Props> = () => {
    const search = useFilterSearch<EditSearch>();

    const page = search.page || 1;
    const content_type = (search.content_type as EditContentType) || undefined;
    const edit_status = (search.edit_status as EditStatusEnum) || undefined;
    const author = search.author;
    const moderator = search.moderator;

    const { list, isLoading, pagination } = useEditList({
        args: {
            content_type,
            sort: expandSort('edit', search.sort, search.order),
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
            <div className="overflow-hidden rounded-lg border">
                <Table>
                    <EditHead />
                    <TableBody>
                        {list.map((edit) => (
                            <EditRow key={edit.edit_id} edit={edit} />
                        ))}
                    </TableBody>
                </Table>
            </div>
            {pagination && <PagePagination pagination={pagination} />}
        </Block>
    );
};

export default EditList;
