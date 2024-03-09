import * as React from 'react';

import EditView from '../../_components/edit-view';

interface Props {
    params: { editId: string };
}

const Component = async ({ params: { editId } }: Props) => {
    return (
        <div className="flex flex-col gap-12">
            <EditView
                editId={editId}
                mode="edit"
            />
        </div>
    );
};

export default Component;
