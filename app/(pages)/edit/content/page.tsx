import { dehydrate } from '@tanstack/query-core';

import RQHydrate from '@/utils/RQ-hydrate';
import getQueryClient from '@/utils/getQueryClient';

import List from './_layout/list';


const Component = async ({
    searchParams,
}: {
    searchParams?: {
        [key: string]: string | string[] | undefined;
    };
}) => {
    const queryClient = getQueryClient();

    const dehydratedState = dehydrate(queryClient);

    return (
        <RQHydrate state={dehydratedState}>
            <List />
        </RQHydrate>
    );
};

export default Component;