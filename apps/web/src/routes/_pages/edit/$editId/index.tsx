import { createFileRoute } from '@tanstack/react-router';

import { ContentTypeEnum } from '@hikka/api';

import { Header, HeaderContainer, HeaderTitle } from '@/components/ui/header';
import { usePageTitleAnchor } from '@/features/app-shell';
import { CommentList } from '@/features/comments';
import { commentListOptions } from '@/features/comments/queries';
import { EditActions, EditViewForm } from '@/features/edit';

export const Route = createFileRoute('/_pages/edit/$editId/')({
    loader: async ({ params, context: { queryClient, apiClient } }) => {
        await queryClient.prefetchInfiniteQuery(
            commentListOptions(
                ContentTypeEnum.EDIT,
                params.editId,
                {},
                apiClient,
            ),
        );
    },
    component: EditPage,
});

function EditPage() {
    const { editId } = Route.useParams();
    const titleAnchor = usePageTitleAnchor();

    return (
        <div className="flex flex-col gap-12">
            <div className="flex flex-col gap-6">
                <Header>
                    <HeaderContainer>
                        <HeaderTitle ref={titleAnchor}>
                            Правка #{editId}
                        </HeaderTitle>
                    </HeaderContainer>
                </Header>
                <EditViewForm editId={editId} mode="view" />
            </div>
            <EditActions editId={editId} />
            <CommentList slug={editId} content_type={ContentTypeEnum.EDIT} />
        </div>
    );
}
