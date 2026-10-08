import { range } from '@antfu/utils';

import { EDIT_LIST_PAGE_SIZE } from '../../queries';
import EntryTableRowSkeleton from './entry-table-row-skeleton';

const EditSkeleton = () => {
    return range(0, EDIT_LIST_PAGE_SIZE).map((index) => (
        <EntryTableRowSkeleton key={index} />
    ));
};

export default EditSkeleton;
