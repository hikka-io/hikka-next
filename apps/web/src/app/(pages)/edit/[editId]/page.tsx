import { ContentTypeEnum } from '@hikka/client';
import { FC } from 'react';

import { CommentList as Comments } from "@/features/comments";
import Actions from '@/features/edit/edit-actions/edit-actions';
import EditView from '@/features/edit/edit-forms/edit-view-form';

interface Props {
    params: { editId: string };
}

const EditPage: FC<Props> = async (props) => {
    const params = await props.params;

    const { editId } = params;

    return (
        <div className="flex flex-col gap-12">
            <EditView editId={editId} mode="view" />
            <Actions editId={editId} />
            <Comments slug={editId} content_type={ContentTypeEnum.EDIT} />
        </div>
    );
};

export default EditPage;
