import { createFileRoute } from '@tanstack/react-router';

import { EditViewForm as EditView } from '@/features/edit';
import { generateHeadMeta } from '@/utils/metadata';

export const Route = createFileRoute('/_pages/edit/$editId/update')({
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
