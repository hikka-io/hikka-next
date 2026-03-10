import { createFileRoute } from '@tanstack/react-router';

import { EditViewForm as EditView } from '@/features/edit';

export const Route = createFileRoute('/_pages/edit/$editId/update')({
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
