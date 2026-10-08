import { createFileRoute } from '@tanstack/react-router';

import { getEditOptions } from '@hikka/api';

import { Header, HeaderContainer, HeaderTitle } from '@/components/ui/header';
import { usePageTitleAnchor } from '@/features/app-shell';
import { EditViewForm } from '@/features/edit';
import { retryOnCancel } from '@/utils/api/retry-on-cancel';
import { requireOwner } from '@/utils/auth';
import { generateHeadMeta } from '@/utils/metadata';

export const Route = createFileRoute('/_pages/edit/$editId/update')({
    beforeLoad: async ({ params, context: { queryClient, apiClient } }) => {
        const edit = await retryOnCancel(() =>
            queryClient.fetchQuery({
                ...getEditOptions({
                    path: { edit_id: Number(params.editId) },
                    client: apiClient,
                }),
                // biome-ignore lint/plugin/no-query-policy: the editor seeds its form once from this snapshot, so a cached copy must be revalidated
                staleTime: 0,
            }),
        ).catch(() => undefined);

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
    const titleAnchor = usePageTitleAnchor();

    return (
        <div className="flex flex-col gap-6">
            <Header>
                <HeaderContainer>
                    <HeaderTitle ref={titleAnchor}>
                        Редагування правки #{editId}
                    </HeaderTitle>
                </HeaderContainer>
            </Header>
            <EditViewForm editId={editId} mode="update" />
        </div>
    );
}
