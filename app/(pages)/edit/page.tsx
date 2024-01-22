import { dehydrate } from '@tanstack/query-core';

import RQHydrate from '@/utils/RQ-hydrate';
import getEditList from '@/utils/api/edit/getEditList';
import getQueryClient from '@/utils/getQueryClient';

import EditList from './_layout/editlist';


const Component = async ({
    searchParams,
}: {
    searchParams?: {
        [key: string]: string | string[] | undefined;
    };
}) => {
    const queryClient = getQueryClient();
    const page = Number(searchParams?.page) || 1;


    await queryClient.prefetchQuery({
        queryKey: ['editList', page],
        queryFn: () => getEditList({ page }),
    });

    const dehydratedState = dehydrate(queryClient);

    return (
        <RQHydrate state={dehydratedState}>
            <div className="grid grid-cols-1 gap-12 lg:gap-16">
                <EditList />
            </div>
        </RQHydrate>
    );
};

export default Component;