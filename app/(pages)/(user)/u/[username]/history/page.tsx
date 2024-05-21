import { dehydrate } from '@tanstack/query-core';
import { HydrationBoundary } from '@tanstack/react-query';
import { Metadata } from 'next';
import { FC } from 'react';

import History from '@/features/users/user-history/user-history';

import getFollowingHistory from '@/services/api/history/getFollowingHistory';
import { getCookie } from '@/utils/cookies';
import _generateMetadata from '@/utils/generateMetadata';
import getQueryClient from '@/utils/getQueryClient';

export const metadata: Metadata = _generateMetadata({
    title: 'Активність',
});

interface Props {
    searchParams: Record<string, any>;
}

const FollowingHistoryPage: FC<Props> = async ({ searchParams }) => {
    const queryClient = await getQueryClient();
    const auth = await getCookie('auth');

    auth &&
        (await queryClient.prefetchInfiniteQuery({
            initialPageParam: 1,
            queryKey: ['followingHistory'],
            queryFn: ({ pageParam, meta }) =>
                getFollowingHistory({
                    page: pageParam,
                }),
        }));

    const dehydratedState = dehydrate(queryClient);

    return (
        <HydrationBoundary state={dehydratedState}>
            <div className="flex flex-col gap-12">
                <History />
            </div>
        </HydrationBoundary>
    );
};

export default FollowingHistoryPage;
