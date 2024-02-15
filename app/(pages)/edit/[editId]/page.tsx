import * as React from 'react';

import Link from 'next/link';
import { redirect } from 'next/navigation';

import { dehydrate } from '@tanstack/query-core';
import { HydrationBoundary } from '@tanstack/react-query';

import EditView from '@/app/(pages)/edit/[editId]/_components/edit-view';
import Breadcrumbs from '@/components/breadcrumbs';
import Comments from '@/components/comments/comments';
import SubHeader from '@/components/sub-header';
import getEdit from '@/services/api/edit/getEdit';
import getQueryClient from '@/utils/getQueryClient';

import Content from '../_components/ui/content';
import EditStatus from '../_components/ui/edit-status';
import Actions from './_components/actions';
import Author from './_components/author';
import EditUpdate from './_components/edit-update';
import Moderator from './_components/moderator';


interface Props {
    params: { editId: string };
    searchParams: { [key: string]: string | string[] | undefined };
}

const Component = async ({
    params: { editId },
    searchParams: { mode },
}: Props) => {
    if (!mode) {
        redirect(`/edit/${editId}/?mode=view`);
    }

    const queryClient = getQueryClient();

    await queryClient.prefetchQuery({
        queryKey: ['edit', editId],
        queryFn: () => getEdit({ edit_id: Number(editId) }),
    });

    const edit: Hikka.Edit | undefined = queryClient.getQueryData([
        'edit',
        editId,
    ]);

    if (!edit) {
        redirect('/edit');
    }

    const dehydratedState = dehydrate(queryClient);

    return (
        <HydrationBoundary state={dehydratedState}>
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_25%] lg:gap-16">
                <Breadcrumbs>
                    <Link
                        href={'/edit/' + edit?.edit_id}
                        className="text-sm font-bold hover:underline"
                    >
                        Правка #{edit?.edit_id}
                    </Link>
                </Breadcrumbs>
                <div className="flex flex-col gap-8">
                    <SubHeader title={`Правка #` + editId} />
                    <div className="flex flex-col gap-12">
                        {mode === 'update' && (
                            <EditUpdate content_type={edit?.content_type} />
                        )}
                        {mode === 'view' && (
                            <>
                                <EditView content_type={edit?.content_type} />
                                <Actions />
                                <Comments slug={editId} content_type="edit" />
                            </>
                        )}
                    </div>
                </div>
                <div className="flex flex-col gap-12">
                    <div className="flex flex-col gap-8">
                        <SubHeader
                            title="Деталі"
                            titleClassName="justify-between w-full"
                            variant="h4"
                        >
                            <EditStatus />
                        </SubHeader>
                        <div className="flex flex-col justify-between rounded-lg border border-secondary/60 bg-secondary/30 p-4">
                            {edit?.author && <Author />}
                            <Moderator />
                        </div>
                    </div>
                    <Content
                        slug={edit.content.slug as string}
                        content_type={edit.content_type as Hikka.ContentType}
                        content={edit.content}
                    />
                </div>
            </div>
        </HydrationBoundary>
    );
};

export default Component;
