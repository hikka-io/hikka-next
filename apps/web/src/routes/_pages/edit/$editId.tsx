import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';

import {
    type CommentContentTypeEnum as CommentsContentType,
    getCommentsListInfiniteOptions,
    getEditOptions,
    paginationPageParam,
} from '@hikka/api';

import Block from '@/components/ui/block';
import { usePageHeader } from '@/features/app-shell';
import { useTitle } from '@/features/auth/hooks/use-title';
import { getCommentSort } from '@/features/comments/utils/comment-sort';
import { EditContent as Content, EditTimeline } from '@/features/edit';
import { usePathname } from '@/utils/navigation';

export const Route = createFileRoute('/_pages/edit/$editId')({
    loader: async ({ params, context: { queryClient, apiClient } }) => {
        const editId = Number(params.editId);

        const edit = await queryClient.ensureQueryData(
            getEditOptions({ path: { edit_id: editId }, client: apiClient }),
        );

        if (!edit) throw redirect({ to: '/edit' });

        await queryClient.prefetchInfiniteQuery({
            ...getCommentsListInfiniteOptions({
                path: {
                    content_type: 'edit' as CommentsContentType,
                    slug: params.editId,
                },
                body: { comment_type: 'all', sort: getCommentSort() },
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
    const pathname = usePathname();
    const contentTitle = useTitle(edit.content);
    const editUrl = `/edit/${editId}`;

    usePageHeader({
        title: `Правка #${edit.edit_id}`,
        subtitle: pathname === editUrl ? contentTitle : 'Редагування',
        parent: pathname === editUrl ? '/edit' : editUrl,
    });

    return (
        <div className="grid grid-cols-1 gap-x-10 gap-y-8 lg:grid-cols-[1fr_25%]">
            <Block>
                <Outlet />
            </Block>
            <div className="flex flex-col gap-6 [&>*:first-child]:backdrop-blur">
                <EditTimeline editId={editId} />
                <Content
                    slug={edit.content.slug as string}
                    content_type={edit.content_type}
                    content={edit.content}
                />
            </div>
        </div>
    );
}
