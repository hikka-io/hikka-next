import { Metadata } from 'next';
import * as React from 'react';
import { FC } from 'react';



import { dehydrate } from '@tanstack/query-core';
import { HydrationBoundary } from '@tanstack/react-query';



import getGlobalComments from '@/services/api/comments/getGlobalComments';
import getFollowingHistory from '@/services/api/history/getFollowingHistory';
import { getCookie } from '@/utils/cookies';
import _generateMetadata from '@/utils/generateMetadata';
import getQueryClient from '@/utils/getQueryClient';



import Comments from './components/comments';


export const metadata: Metadata = _generateMetadata({
    title: 'Активність',
});

interface Props {
    searchParams: Record<string, any>;
}

const FollowingHistoryPage: FC<Props> = async ({ searchParams }) => {
    const queryClient = await getQueryClient();

    await queryClient.prefetchInfiniteQuery({
        initialPageParam: 1,
        queryKey: ['globalComments'],
        queryFn: ({ pageParam, meta }) =>
            getGlobalComments({
                page: pageParam,
                auth: meta?.auth,
            }),
    })

    const dehydratedState = dehydrate(queryClient);

    return (
        <HydrationBoundary state={dehydratedState}>
            <div className="flex flex-col gap-12">
                <Comments />
            </div>
        </HydrationBoundary>
    );
};

export default FollowingHistoryPage;
