import { ContentTypeEnum, EditContentType } from '@hikka/client';
import {
    HydrationBoundary,
    dehydrate,
    getHikkaClient,
    getQueryClient,
} from '@hikka/react/core';
import { prefetchContentComments, prefetchEdit } from '@hikka/react/server';
import { Metadata } from 'next';
import Link from 'next/link';
import { permanentRedirect } from 'next/navigation';
import * as React from 'react';
import { FC } from 'react';

import Breadcrumbs from '@/components/navigation/nav-breadcrumbs';
import Block from '@/components/ui/block';
import Card from '@/components/ui/card';
import { Header, HeaderContainer, HeaderTitle } from '@/components/ui/header';

import {
    EditAuthor as Author,
    EditContent as Content,
    EditStatus,
    EditModerator as Moderator,
} from '@/features/edit';

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

    const edit = await prefetchEdit({
        editId: Number(editId),
        clientConfig,
        queryClient,
    });

    if (!edit) {
        permanentRedirect('/edit');
    }

    await prefetchContentComments({
        contentType: ContentTypeEnum.EDIT,
        slug: editId,
        clientConfig,
        queryClient,
    });

    const dehydratedState = dehydrate(queryClient);

    return (
        <HydrationBoundary state={dehydratedState}>
            <Breadcrumbs>
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
