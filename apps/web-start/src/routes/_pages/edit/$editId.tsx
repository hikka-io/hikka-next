import { ContentTypeEnum, EditContentType } from '@hikka/client';
import {
    contentCommentsOptions,
    editOptions,
} from '@hikka/react/options';
import { Outlet, createFileRoute, redirect } from '@tanstack/react-router';
import Link from '@/components/ui/link';

import Breadcrumbs from '@/features/common/nav-breadcrumbs';
import Block from '@/components/ui/block';
import Card from '@/components/ui/card';
import { Header, HeaderContainer, HeaderTitle } from '@/components/ui/header';
import {
    EditAuthor as Author,
    EditContent as Content,
    EditStatus,
    EditModerator as Moderator,
} from '@/features/edit';

export const Route = createFileRoute('/_pages/edit/$editId')({
    loader: async ({
        params,
        context: { queryClient, hikkaClient },
    }) => {
        const editId = Number(params.editId);

        const edit = await queryClient.ensureQueryData(
            editOptions(hikkaClient, { editId }),
        );

        if (!edit) throw redirect({ to: '/_pages/edit/' });

        await queryClient.prefetchInfiniteQuery(
            contentCommentsOptions(hikkaClient, {
                contentType: ContentTypeEnum.EDIT,
                slug: params.editId,
            }) as any,
        );

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
                    to={'/edit/' + edit.edit_id}
                    className="text-sm font-bold hover:underline"
                >
                    Правка #{edit.edit_id}
                </Link>
            </Breadcrumbs>
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_25%] lg:gap-12">
                <Block>
                    <Outlet />
                </Block>
                <div className="flex flex-col gap-12">
                    <Block>
                        <Header>
                            <HeaderContainer>
                                <HeaderTitle className="w-full justify-between">
                                    Деталі
                                </HeaderTitle>
                            </HeaderContainer>
                            <EditStatus editId={editId} />
                        </Header>
                        <Card className="justify-between">
                            {edit.author && <Author editId={editId} />}
                            <Moderator editId={editId} />
                        </Card>
                    </Block>
                    <Content
                        slug={edit.content.slug as string}
                        content_type={edit.content_type as EditContentType}
                        content={edit.content}
                    />
                </div>
            </div>
        </>
    );
}
