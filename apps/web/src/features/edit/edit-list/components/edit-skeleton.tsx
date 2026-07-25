import { range } from '@antfu/utils';

import Block from '@/components/ui/block';
import { Table, TableBody } from '@/components/ui/table';

import EditHead from './edit-head';
import EntryTableRowSkeleton from './entry-table-row-skeleton';

const EditSkeleton = () => {
    return (
        <Block>
            <div className="-mx-4 overflow-hidden rounded-none border border-x-0 surface md:mx-0 md:rounded-lg md:border-x">
                <Table className="max-md:table-fixed max-md:[&_td]:px-2 max-md:[&_th]:px-2 max-md:[&_td:nth-child(2)]:pl-4 max-md:[&_th:nth-child(2)]:pl-4 max-md:[&_td:last-child]:pr-4 max-md:[&_th:last-child]:pr-4">
                    <EditHead />
                    <TableBody>
                        {range(1, 20).map((v) => (
                            <EntryTableRowSkeleton key={v} />
                        ))}
                    </TableBody>
                </Table>
            </div>
        </Block>
    );
};

export default EditSkeleton;
