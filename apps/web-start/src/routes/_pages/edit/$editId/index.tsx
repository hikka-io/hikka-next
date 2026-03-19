import { ContentTypeEnum } from '@hikka/client';
import { createFileRoute } from '@tanstack/react-router';

import { CommentList as Comments } from '@/features/comments';
import {
    EditActions as Actions,
    EditViewForm as EditView,
} from '@/features/edit';

export const Route = createFileRoute('/_pages/edit/$editId/')({
    component: EditPage,
});

function EditPage() {
    const { editId } = Route.useParams();

    return (
        <div className="flex flex-col gap-12">
            <EditView editId={editId} mode="view" />
            <Actions editId={editId} />
            <Comments slug={editId} content_type={ContentTypeEnum.EDIT} />
        </div>
    );
}
