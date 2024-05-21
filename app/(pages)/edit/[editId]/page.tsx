import { FC } from 'react';

import Comments from '@/features/comments/comment-list/comment-list';
import Actions from '@/features/edit/edit-actions/edit-actions';
import EditView from '@/features/edit/edit-forms/edit-view-form';

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
