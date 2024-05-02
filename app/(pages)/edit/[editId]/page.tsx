import * as React from 'react';
import { FC } from 'react';

import Actions from '@/app/(pages)/edit/[editId]/components/actions';
import EditView from '@/app/(pages)/edit/components/edit-view';
import Comments from '@/components/comments/comments';

interface Props {
    params: { editId: string };
}

const EditPage: FC<Props> = async ({ params: { editId } }) => {
    return (
        <div className="flex flex-col gap-12">
            <EditView editId={editId} mode="view" />
            <Actions editId={editId} />
            <Comments slug={editId} content_type="edit" />
        </div>
    );
};

export default EditPage;
