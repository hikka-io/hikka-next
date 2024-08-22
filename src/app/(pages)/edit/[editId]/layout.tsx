import { dehydrate } from '@tanstack/query-core';
import { HydrationBoundary } from '@tanstack/react-query';
import { Metadata } from 'next';
import Link from 'next/link';
import { permanentRedirect } from 'next/navigation';
import * as React from 'react';
import { FC } from 'react';

import Breadcrumbs from '@/components/navigation/nav-breadcrumbs';
import NavMenu from '@/components/navigation/nav-dropdown';
import Block from '@/components/ui/block';
import Card from '@/components/ui/card';
import Header from '@/components/ui/header';

import Author from '@/features/edit/edit-author.component';
import Content from '@/features/edit/edit-content/edit-content.component';
import Moderator from '@/features/edit/edit-moderator.component';
import EditStatus from '@/features/edit/edit-status.component';

import getEdit from '@/services/api/edit/getEdit';
import { prefetchComments } from '@/services/hooks/comments/use-comments';
import { key, prefetchEdit } from '@/services/hooks/edit/use-edit';
import { EDIT_NAV_ROUTES } from '@/utils/constants/navigation';
import _generateMetadata from '@/utils/generate-metadata';
import getQueryClient from '@/utils/get-query-client';

interface Props {
    params: { editId: string };
    searchParams: { [key: string]: string | string[] | undefined };
    children: React.ReactNode;
}

export async function generateMetadata({
    params,
}: {
    params: {
        editId: string;
    };
}): Promise<Metadata> {
    const edit = await getEdit({
        params: {
            edit_id: Number(params.editId),
        },
    });

    return _generateMetadata({
        title: `#${params.editId}`,
        description: edit.description,
    });
}

const EditLayout: FC<Props> = async ({ params: { editId }, children }) => {
    const queryClient = await getQueryClient();

    await prefetchEdit({ edit_id: Number(editId) });

    const edit: API.Edit | undefined = queryClient.getQueryData(
        key({ edit_id: Number(editId) }),
    );

    if (!edit) {
        permanentRedirect('/edit');
    }

    await prefetchComments({ slug: editId, content_type: 'edit' });

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
                        <Header
                            title="Деталі"
                            titleClassName="justify-between w-full"
                        >
                            <EditStatus editId={editId} />
                        </Header>
                        <Card className="justify-between">
                            {edit.author && <Author editId={editId} />}
                            <Moderator editId={editId} />
                        </Card>
                    </Block>
                    <Content
                        slug={edit.content.slug as string}
                        content_type={edit.content_type as API.ContentType}
                        content={edit.content}
                    />
                </div>
            </div>
        </HydrationBoundary>
    );
};

export default EditLayout;
