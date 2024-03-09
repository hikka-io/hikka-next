import * as React from 'react';

import Comments from '@/components/comments/comments';

import EditView from '../_components/edit-view';
import Actions from './_components/actions';

interface Props {
    params: { editId: string };
}

const Component = async ({ params: { editId } }: Props) => {
    return (
        <div className="flex flex-col gap-12">
            <EditView editId={editId} mode="view" />
            <Actions editId={editId} />
            <Comments slug={editId} content_type="edit" />
        </div>
    );
};

export default Component;
