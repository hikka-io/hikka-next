import AnimeEditView from './_layout/AnimeEditView';
import getQueryClient from '@/utils/getQueryClient';
import RQHydrate from '@/utils/RQHydrate';
import { dehydrate } from '@tanstack/query-core';
import getEdit from '@/utils/api/edit/getEdit';
import Author from './_layout/Author';
import Actions from './_layout/Actions';
import Moderator from '@/app/edit/[editId]/_layout/Moderator';
import AnimeContent from '@/app/edit/[editId]/_layout/AnimeContent';
import SubHeader from '@/app/_components/SubHeader';
import * as React from 'react';
import EditStatus from '@/app/edit/_components/EditStatus';

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
            <div className="grid lg:grid-cols-[1fr_25%] grid-cols-1 lg:gap-16 gap-12">
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
                            <Author />
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
