import * as React from 'react';

import Link from 'next/link';
import { redirect } from 'next/navigation';

import { dehydrate } from '@tanstack/query-core';
import { HydrationBoundary } from '@tanstack/react-query';

import Content from '@/app/(pages)/edit/_components/content/content';
import Breadcrumbs from '@/components/breadcrumbs';
import SubHeader from '@/components/sub-header';
import getEdit from '@/services/api/edit/getEdit';
import getQueryClient from '@/utils/getQueryClient';

import EditStatus from '../_components/ui/edit-status';
import Author from './_components/author';
import Moderator from './_components/moderator';


interface Props {
    params: { editId: string };
    searchParams: { [key: string]: string | string[] | undefined };
    children: React.ReactNode;
}

const Component = async ({ params: { editId }, children }: Props) => {
    const queryClient = getQueryClient();

    const edit = await queryClient.fetchQuery({
        queryKey: ['edit', editId],
        queryFn: () => getEdit({ edit_id: Number(editId) }),
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

export default Component;
