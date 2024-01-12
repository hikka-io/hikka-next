import * as React from 'react';

import Link from 'next/link';

import { dehydrate } from '@tanstack/query-core';

import AnimeContent from '@/app/(pages)/edit/[editId]/_layout/AnimeContent';
import Moderator from '@/app/(pages)/edit/[editId]/_layout/Moderator';
import EditStatus from '@/app/(pages)/edit/_components/EditStatus';
import Breadcrumbs from '@/app/_components/Breadcrumbs';
import SubHeader from '@/app/_components/SubHeader';
import RQHydrate from '@/utils/RQHydrate';
import getEdit from '@/utils/api/edit/getEdit';
import { RELEASE_STATUS } from '@/utils/constants';
import getQueryClient from '@/utils/getQueryClient';

import Actions from './_layout/Actions';
import AnimeEditView from './_layout/AnimeEditView';
import Author from './_layout/Author';

interface Props {
    params: { editId: string };
}

const Component = async ({ params: { editId } }: Props) => {
    const queryClient = getQueryClient();

    await queryClient.prefetchQuery(['edit', editId], () =>
        getEdit({ edit_id: Number(editId) }),
    );

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
                    </div>
                </div>
                <div className="flex flex-col gap-12">
                    <div className="flex flex-col gap-8">
                        <SubHeader
                            title="Деталі"
                            titleClassName="justify-between w-full"
                            variant="h4"
                        >
                            <EditStatus status={edit?.status} />
                        </SubHeader>
                        <div className="flex flex-col justify-between">
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
