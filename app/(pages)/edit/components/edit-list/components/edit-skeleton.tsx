import * as React from 'react';

import { range } from '@antfu/utils';

import EditHead from '@/app/(pages)/edit/components/edit-list/components/edit-head';
import EntryTableRow from '@/components/skeletons/entry-table-row';
import Block from '@/components/ui/block';
import { Table, TableBody } from '@/components/ui/table';

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
