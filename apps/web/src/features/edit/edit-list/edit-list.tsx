import type { FC } from 'react';

import FiltersNotFound from '@/components/filters-not-found';
import PagePagination from '@/components/page-pagination';
import Block from '@/components/ui/block';
import { Table, TableBody } from '@/components/ui/table';
import { useInfiniteList } from '@/utils/api/use-infinite-list';
import { useRouteSearch } from '@/utils/navigation';
import type { EditSearch } from '@/utils/search-schemas';

import { editListOptions } from '../queries';
import EditHead from './components/edit-head';
import EditRow from './components/edit-row';
import EditSkeleton from './components/edit-skeleton';

type Props = {};

const EditList: FC<Props> = () => {
    const search = useRouteSearch<EditSearch>();

    const { list, isLoading, pagination } = useInfiniteList(
        editListOptions(search),
    );

    if (isLoading) {
        return <EditSkeleton />;
    }

    if (!list) return null;

    if (list && list.length === 0) {
        return <FiltersNotFound />;
    }

    return (
        <Block>
            <div className="-mx-4 overflow-hidden rounded-none border border-x-0 surface md:mx-0 md:rounded-lg md:border-x">
                <Table className="max-md:table-fixed max-md:[&_td]:px-2 max-md:[&_th]:px-2 max-md:[&_td:nth-child(2)]:pl-4 max-md:[&_th:nth-child(2)]:pl-4 max-md:[&_td:last-child]:pr-4 max-md:[&_th:last-child]:pr-4">
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
