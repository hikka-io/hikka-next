import { FC } from 'react';

import Comments from '@/features/comments/comment-list.component';
import Actions from '@/features/edit/edit-actions/edit-actions.component';
import EditView from '@/features/edit/edit-forms/edit-view-form.component';

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
