import * as React from 'react';

import Comments from '@/components/comments/comments';

import EditView from '@/app/(pages)/edit/components/edit-view';
import Actions from '@/app/(pages)/edit/[editId]/components/actions';
import { getCookie } from '@/utils/actions';

interface Props {
    params: { editId: string };
}

const EditPage = async ({ params: { editId } }: Props) => {
    const auth = await getCookie('auth');

    return (
        <div className="flex flex-col gap-12">
            <EditView editId={editId} mode="view" />
            <Actions editId={editId} />
            <Comments auth={auth} slug={editId} content_type="edit" />
        </div>
    );
};

export default EditPage;
