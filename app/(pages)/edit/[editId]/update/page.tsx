import * as React from 'react';
import { FC } from 'react';

import EditView from '@/app/(pages)/edit/components/edit-view';

interface Props {
    params: { editId: string };
}

const EditUpdatePage: FC<Props> = async ({ params: { editId } }) => {
    return (
        <div className="flex flex-col gap-12">
            <EditView editId={editId} mode="update" />
        </div>
    );
};

export default EditUpdatePage;
