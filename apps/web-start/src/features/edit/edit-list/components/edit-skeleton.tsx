import { range } from '@antfu/utils';

import Block from '@/components/ui/block';
import { Table, TableBody } from '@/components/ui/table';

import EditHead from './edit-head';
import EntryTableRowSkeleton from './entry-table-row-skeleton';

const EditSkeleton = () => {
    return (
        <Block>
            <Table className="table">
                <EditHead />
                <TableBody>
                    {range(1, 20).map((v) => (
                        <EntryTableRowSkeleton key={v} />
                    ))}
                </TableBody>
            </Table>
        </Block>
    );
};

export default EditSkeleton;
