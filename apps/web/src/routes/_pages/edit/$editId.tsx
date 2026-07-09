import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';

import {
    type CommentContentTypeEnum as CommentsContentType,
    getContentsListInfiniteOptions,
    getEditOptions,
    paginationPageParam,
} from '@hikka/api';

import Block from '@/components/ui/block';
import Link from '@/components/ui/link';
import Breadcrumbs from '@/features/app-shell/nav-breadcrumbs';
import { EditContent as Content, EditTimeline } from '@/features/edit';

export const Route = createFileRoute('/_pages/edit/$editId')({
    loader: async ({ params, context: { queryClient, apiClient } }) => {
        const editId = Number(params.editId);

        const edit = await queryClient.ensureQueryData(
            getEditOptions({ path: { edit_id: editId }, client: apiClient }),
        );

        if (!edit) throw redirect({ to: '/edit' });

        await queryClient.prefetchInfiniteQuery({
            ...getContentsListInfiniteOptions({
                path: {
                    content_type: 'edit' as CommentsContentType,
                    slug: params.editId,
                },
                client: apiClient,
            }),
            ...paginationPageParam(),
        });

        return { edit };
    },
    head: ({ loaderData }) => ({
        meta: [
            {
                title: loaderData?.edit
                    ? `#${loaderData.edit.edit_id} / Правки / Hikka`
                    : 'Правки / Hikka',
            },
        ],
    }),
    component: EditLayout,
});

function EditLayout() {
    const { editId } = Route.useParams();
    const { edit } = Route.useLoaderData();

    return (
        <>
            <Breadcrumbs>
                <Link
                    to={`/edit/${edit.edit_id}`}
                    className="font-bold text-sm hover:underline"
                >
                    Правка #{edit.edit_id}
                </Link>
            </Breadcrumbs>
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_25%]">
                <Block>
                    <Outlet />
                </Block>
                <div className="flex flex-col gap-6">
                    <EditTimeline editId={editId} />
                    <Content
                        slug={edit.content.slug as string}
                        content_type={edit.content_type}
                        content={edit.content}
                    />
                </div>
            </div>
        </>
    );
}
