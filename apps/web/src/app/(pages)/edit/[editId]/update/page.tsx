import { FC } from 'react';

import EditView from '@/features/edit/edit-forms/edit-view-form.component';

interface Props {
    params: { editId: string };
}

const EditUpdatePage: FC<Props> = async (props) => {
    const params = await props.params;

    const { editId } = params;

    return (
        <div className="flex flex-col gap-12">
            <EditView editId={editId} mode="update" />
        </div>
    );
};

export default EditUpdatePage;
