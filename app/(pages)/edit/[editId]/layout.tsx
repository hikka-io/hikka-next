import { Metadata } from 'next';
import * as React from 'react';

import Link from 'next/link';
import { redirect } from 'next/navigation';

import { dehydrate } from '@tanstack/query-core';
import { HydrationBoundary } from '@tanstack/react-query';

import Author from '@/app/(pages)/edit/[editId]/components/author';
import Moderator from '@/app/(pages)/edit/[editId]/components/moderator';
import Content from '@/app/(pages)/edit/components/content/content';
import EditStatus from '@/app/(pages)/edit/components/ui/edit-status';
import Breadcrumbs from '@/components/navbar/nav-breadcrumbs';
import SubHeader from '@/components/sub-header';
import getComments from '@/services/api/comments/getComments';
import getEdit from '@/services/api/edit/getEdit';
import { getCookie } from '@/utils/actions';
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
    const edit = await getEdit({ edit_id: Number(params.editId) });

    return _generateMetadata({
        title: `#${params.editId}`,
        description: edit.description,
    });
}

const EditLayout = async ({ params: { editId }, children }: Props) => {
    const queryClient = getQueryClient();
    const auth = await getCookie('auth');

    const edit = await queryClient.fetchQuery({
        queryKey: ['edit', editId],
        queryFn: () => getEdit({ edit_id: Number(editId) }),
    });

    await queryClient.prefetchInfiniteQuery({
        initialPageParam: 1,
        queryKey: ['comments', editId, 'edit', { auth: auth }],
        queryFn: ({ pageParam }) =>
            getComments({
                slug: editId,
                content_type: 'edit',
                page: pageParam,
                auth: auth,
            }),
    });

    if (!edit) {
        redirect('/edit');
    }

    const dehydratedState = dehydrate(queryClient);

    return (
        <HydrationBoundary state={dehydratedState}>
            <>
                <Breadcrumbs>
                    <Link
                        href={'/edit/' + edit.edit_id}
                        className="text-sm font-bold hover:underline"
                    >
                        Правка #{edit.edit_id}
                    </Link>
                </Breadcrumbs>
                <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_25%] lg:gap-16">
                    <div className="flex flex-col gap-8">
                        <SubHeader title={`Правка #${edit.edit_id}`} />
                        {children}
                    </div>
                    <div className="flex flex-col gap-12">
                        <div className="flex flex-col gap-8">
                            <SubHeader
                                title="Деталі"
                                titleClassName="justify-between w-full"
                                variant="h4"
                            >
                                <EditStatus editId={editId} />
                            </SubHeader>
                            <div className="flex flex-col justify-between rounded-lg border border-secondary/60 bg-secondary/30 p-4">
                                {edit.author && <Author editId={editId} />}
                                <Moderator editId={editId} />
                            </div>
                        </div>
                        <Content
                            slug={edit.content.slug as string}
                            content_type={edit.content_type as API.ContentType}
                            content={edit.content}
                        />
                    </div>
                </div>
            </>
        </HydrationBoundary>
    );
};

export default EditLayout;
