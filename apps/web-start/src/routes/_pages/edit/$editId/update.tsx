import { createFileRoute } from '@tanstack/react-router';

import { type GetEditResponse, getEditQueryKey } from '@hikka/api';

import { EditViewForm as EditView } from '@/features/edit';
import { requireOwner } from '@/utils/auth';
import { generateHeadMeta } from '@/utils/metadata';

export const Route = createFileRoute('/_pages/edit/$editId/update')({
    beforeLoad: async ({ params, context: { queryClient } }) => {
        const edit = queryClient.getQueryData<GetEditResponse>(
            getEditQueryKey({ path: { edit_id: Number(params.editId) } }),
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
