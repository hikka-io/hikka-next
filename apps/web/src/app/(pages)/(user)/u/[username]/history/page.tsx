import { dehydrate } from '@tanstack/query-core';
import { HydrationBoundary } from '@tanstack/react-query';
import { Metadata } from 'next';
import { FC } from 'react';

import History from '@/features/users/user-history/user-history.component';
import { prefetchFollowingHistory } from '@/services/hooks/history/use-following-history';
import { getCookie } from '@/utils/cookies';
import _generateMetadata from '@/utils/generate-metadata';
import getQueryClient from '@/utils/get-query-client';

export const metadata: Metadata = _generateMetadata({
    title: 'Активність',
});

interface Props {
    searchParams: Record<string, any>;
}

const FollowingHistoryPage: FC<Props> = async (props) => {
    const searchParams = await props.searchParams;
    const queryClient = getQueryClient();
    const auth = await getCookie('auth');

    auth && (await prefetchFollowingHistory());

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
