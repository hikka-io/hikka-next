import { useQuery } from '@tanstack/react-query';
import { createFileRoute, Outlet } from '@tanstack/react-router';

import { getEditOptions } from '@hikka/api';

import Block from '@/components/ui/block';
import { usePageHeader } from '@/features/app-shell';
import { EditContent, EditTimeline } from '@/features/edit';
import { useTitle } from '@/services/session';
import { ensureOr404 } from '@/utils/api/ensure-or-404';
import { generateHeadMeta } from '@/utils/metadata';
import { usePathname } from '@/utils/navigation';

export const Route = createFileRoute('/_pages/edit/$editId')({
    loader: async ({ params, context: { queryClient, apiClient } }) => {
        const edit = await ensureOr404(() =>
            queryClient.ensureQueryData(
                getEditOptions({
                    path: { edit_id: Number(params.editId) },
                    client: apiClient,
                }),
            ),
        );

        return { edit };
    },
    head: ({ loaderData }) =>
        generateHeadMeta({
            title: loaderData?.edit
                ? `#${loaderData.edit.edit_id} / Правки`
                : 'Правки',
            description: loaderData?.edit
                ? `Правка #${loaderData.edit.edit_id} у системі правок спільноти Hikka`
                : 'Система правок спільноти Hikka',
        }),
    component: EditLayout,
});

function EditLayout() {
    const { editId } = Route.useParams();
    const { data: edit } = useQuery(
        getEditOptions({ path: { edit_id: Number(editId) } }),
    );
    const pathname = usePathname();
    const contentTitle = useTitle(edit?.content);
    const editUrl = `/edit/${editId}`;

    usePageHeader({
        title: `Правка #${edit?.edit_id ?? editId}`,
        subtitle: pathname === editUrl ? contentTitle : 'Редагування',
        parent: pathname === editUrl ? '/edit' : editUrl,
        anchored: true,
    });

    return (
        <div className="grid grid-cols-1 gap-x-10 gap-y-8 lg:grid-cols-[1fr_25%]">
            <Block>
                <Outlet />
            </Block>
            <div className="flex flex-col gap-6 [&>*:first-child]:backdrop-blur">
                <EditTimeline editId={editId} />
                {edit && (
                    <EditContent
                        slug={edit.content.slug as string}
                        content_type={edit.content_type}
                        content={edit.content}
                    />
                )}
            </div>
        </div>
    );
}
