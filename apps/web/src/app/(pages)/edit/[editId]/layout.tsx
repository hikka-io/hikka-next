import { ContentTypeEnum, EditContentType, EditResponse } from '@hikka/client';
import {
    HydrationBoundary,
    dehydrate,
    getHikkaClient,
    getQueryClient,
    prefetchContentComments,
    prefetchEdit,
    queryKeys,
} from '@hikka/react';
import { Metadata } from 'next';
import Link from 'next/link';
import { permanentRedirect } from 'next/navigation';
import * as React from 'react';
import { FC } from 'react';

import Breadcrumbs from '@/components/navigation/nav-breadcrumbs';
import NavMenu from '@/components/navigation/nav-dropdown';
import Block from '@/components/ui/block';
import Card from '@/components/ui/card';
import { Header, HeaderContainer, HeaderTitle } from '@/components/ui/header';

import Author from '@/features/edit/edit-author.component';
import Content from '@/features/edit/edit-content/edit-content.component';
import Moderator from '@/features/edit/edit-moderator.component';
import EditStatus from '@/features/edit/edit-status.component';

import { EDIT_NAV_ROUTES } from '@/utils/constants/navigation';
import _generateMetadata from '@/utils/generate-metadata';
import getHikkaClientConfig from '@/utils/get-hikka-client-config';

interface Props {
    params: { editId: string };
    searchParams: { [key: string]: string | string[] | undefined };
    children: React.ReactNode;
}

export async function generateMetadata(props: {
    params: Promise<{
        editId: string;
    }>;
}): Promise<Metadata> {
    const params = await props.params;
    const client = await getHikkaClient();
    const edit = await client.edit.getEdit(Number(params.editId));

    return _generateMetadata({
        title: `#${params.editId}`,
        description: edit.description,
    });
}

const EditLayout: FC<Props> = async (props) => {
    const params = await props.params;
    const { editId } = params;
    const { children } = props;

    const queryClient = await getQueryClient();
    const clientConfig = await getHikkaClientConfig();

    await prefetchEdit({ editId: Number(editId), clientConfig });

    const edit: EditResponse | undefined = queryClient.getQueryData(
        queryKeys.edit.byId(editId),
    );

    if (!edit) {
        permanentRedirect('/edit');
    }

    await prefetchContentComments({
        contentType: ContentTypeEnum.EDIT,
        slug: editId,
        clientConfig,
    });

    const dehydratedState = dehydrate(queryClient);

    return (
        <HydrationBoundary state={dehydratedState}>
            <Breadcrumbs>
                <NavMenu routes={EDIT_NAV_ROUTES} urlPrefix="/edit" />
                <Link
                    href={'/edit/' + edit.edit_id}
                    className="text-sm font-bold hover:underline"
                >
                    Правка #{edit.edit_id}
                </Link>
            </Breadcrumbs>
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_25%] lg:gap-16">
                <Block>{children}</Block>
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
        </HydrationBoundary>
    );
};

export default EditLayout;
