import { dehydrate } from '@tanstack/query-core';
import { HydrationBoundary } from '@tanstack/react-query';

import getQueryClient from '@/utils/getQueryClient';

import List from './_components/list';

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
        <HydrationBoundary state={dehydratedState}>
            <List />
        </HydrationBoundary>
    );
};

export default Component;
