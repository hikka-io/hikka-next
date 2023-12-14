import { dehydrate } from '@tanstack/query-core';

import RQHydrate from '@/utils/RQHydrate';
import getEditList from '@/utils/api/edit/getEditList';
import getQueryClient from '@/utils/getQueryClient';

import EditList from './_layout/EditList';

const Component = async () => {
    const queryClient = getQueryClient();

    await queryClient.prefetchInfiniteQuery(['editList'], () =>
        getEditList({ page: 1 }),
    );

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
