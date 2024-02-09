import { redirect } from 'next/navigation';

import { dehydrate } from '@tanstack/query-core';
import { HydrationBoundary } from '@tanstack/react-query';

import getEditList from '@/services/api/edit/getEditList';
import getQueryClient from '@/utils/getQueryClient';

import EditList from './_components/editlist';


const Component = async ({
    searchParams: { page },
}: {
    searchParams: { [key: string]: string | string[] | undefined };
}) => {
    if (!page) {
        redirect('/edit?page=1');
    }

    const queryClient = getQueryClient();

    await queryClient.prefetchQuery({
        queryKey: ['editList', page],
        queryFn: () => getEditList({ page: Number(page) }),
    });

    const dehydratedState = dehydrate(queryClient);

    return (
        <HydrationBoundary state={dehydratedState}>
            <div className="grid grid-cols-1 gap-12 lg:gap-16">
                <EditList />
            </div>
        </HydrationBoundary>
    );
};

export default Component;