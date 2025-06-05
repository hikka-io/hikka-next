import { range } from '@antfu/utils';

import EntryTableRow from '@/components/skeletons/entry-table-row';
import Block from '@/components/ui/block';
import { Table, TableBody } from '@/components/ui/table';
import EditHead from './edit-head';

const EditSkeleton = () => {
    return (
        <Block>
            <Table className="table">
                <EditHead />
                <TableBody>
                    {range(1, 20).map((v) => (
                        <EntryTableRow key={v} />
                    ))}
                </TableBody>
            </Table>
        </Block>
    );
};

export default EditSkeleton;
