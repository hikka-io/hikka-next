import EditList from './_layout/EditList';
import getQueryClient from '@/utils/getQueryClient';
import RQHydrate from '@/utils/RQHydrate';
import { dehydrate } from '@tanstack/query-core';
import getEditList from '@/utils/api/edit/getEditList';

const Component = async () => {
    const queryClient = getQueryClient();

    await queryClient.prefetchInfiniteQuery(['editList'], () =>
        getEditList({ page: 1 }),
    );

    const dehydratedState = dehydrate(queryClient);

    return (
        <RQHydrate state={dehydratedState}>
            <div className="grid grid-cols-1 lg:gap-16 gap-12">
                <EditList />
            </div>
        </RQHydrate>
    );
};

export default Component;
