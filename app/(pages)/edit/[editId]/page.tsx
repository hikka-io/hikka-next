import * as React from 'react';

import Link from 'next/link';

import { dehydrate } from '@tanstack/query-core';

import AnimeContent from '@/app/(pages)/edit/[editId]/_layout/anime-content';
import Moderator from '@/app/(pages)/edit/[editId]/_layout/moderator';
import EditStatus from '@/app/(pages)/edit/_components/edit-status';
import Breadcrumbs from '@/app/_components/breadcrumbs';
import SubHeader from '@/app/_components/sub-header';
import RQHydrate from '@/utils/RQ-hydrate';
import getEdit from '@/utils/api/edit/getEdit';
import getQueryClient from '@/utils/getQueryClient';

import Actions from './_layout/actions';
import AnimeEditView from './_layout/anime-edit-view';
import Author from './_layout/author';
import Comments from '@/app/(pages)/edit/[editId]/_layout/comments';


interface Props {
    params: { editId: string };
}

const Component = async ({ params: { editId } }: Props) => {
    const queryClient = getQueryClient();

    await queryClient.prefetchQuery({
        queryKey: ['edit', editId],
        queryFn: () => getEdit({ edit_id: Number(editId) }),
    });

    const edit: Hikka.Edit | undefined = queryClient.getQueryData([
        'edit',
        editId,
    ]);

    const dehydratedState = dehydrate(queryClient);

    return (
        <RQHydrate state={dehydratedState}>
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
                        <AnimeEditView />
                        <Actions />
                        <Comments />
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

                    <AnimeContent />
                </div>
            </div>
        </RQHydrate>
    );
};

export default Component;