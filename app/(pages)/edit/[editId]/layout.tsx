import { dehydrate } from '@tanstack/query-core';
import { HydrationBoundary } from '@tanstack/react-query';
import { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import * as React from 'react';
import { FC } from 'react';

import Breadcrumbs from '@/components/navigation/nav-breadcrumbs';
import NavMenu from '@/components/navigation/nav-dropdown';
import Block from '@/components/ui/block';
import Card from '@/components/ui/card';
import Header from '@/components/ui/header';

import Author from '@/features/edit/edit-author';
import Content from '@/features/edit/edit-content/edit-content';
import EditStatus from '@/features/edit/edit-forms/edit-status';
import Moderator from '@/features/edit/edit-moderator';

import getComments from '@/services/api/comments/getComments';
import getEdit from '@/services/api/edit/getEdit';
import { EDIT_NAV_ROUTES } from '@/utils/constants';
import _generateMetadata from '@/utils/generateMetadata';
import getQueryClient from '@/utils/getQueryClient';

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

    const edit = await queryClient.fetchQuery({
        queryKey: ['edit', editId],
        queryFn: ({ meta }) =>
            getEdit({
                params: {
                    edit_id: Number(editId),
                },
            }),
    });

    await queryClient.prefetchInfiniteQuery({
        initialPageParam: 1,
        queryKey: ['comments', editId, 'edit'],
        queryFn: ({ pageParam, meta }) =>
            getComments({
                params: {
                    slug: editId,
                    content_type: 'edit',
                },
                page: pageParam,
            }),
    });

    if (!edit) {
        redirect('/edit');
    }

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
                            variant="h4"
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
