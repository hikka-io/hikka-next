import { EditResponse } from '@hikka/client';
import { queryKeys } from '@hikka/react/core';
import { createFileRoute } from '@tanstack/react-router';

import { EditViewForm as EditView } from '@/features/edit';

import { requireOwner } from '@/utils/auth';
import { generateHeadMeta } from '@/utils/metadata';

export const Route = createFileRoute('/_pages/edit/$editId/update')({
    beforeLoad: async ({ params, context: { queryClient } }) => {
        const edit = queryClient.getQueryData<EditResponse>(
            queryKeys.edit.byId(Number(params.editId)),
        );

        requireOwner(
            queryClient,
            edit?.author?.username ?? '',
            `/edit/${params.editId}`,
        );
    },
    head: () =>
        generateHeadMeta({
            title: 'Редагувати правку',
            robots: { index: false },
        }),
    component: EditUpdatePage,
});

function EditUpdatePage() {
    const { editId } = Route.useParams();

    return (
        <div className="flex flex-col gap-12">
            <EditView editId={editId} mode="update" />
        </div>
    );
}
