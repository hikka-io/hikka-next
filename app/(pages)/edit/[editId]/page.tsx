import * as React from 'react';

import Comments from '@/components/comments/comments';

import EditView from '../_components/edit-view';
import Actions from './_components/actions';
import { getCookie } from '@/app/actions';

interface Props {
    params: { editId: string };
}

const Component = async ({ params: { editId } }: Props) => {
    const auth = await getCookie('auth');

    return (
        <div className="flex flex-col gap-12">
            <EditView editId={editId} mode="view" />
            <Actions editId={editId} />
            <Comments auth={auth} slug={editId} content_type="edit" />
        </div>
    );
};

export default Component;
