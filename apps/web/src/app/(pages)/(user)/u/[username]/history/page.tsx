import {
    HydrationBoundary,
    dehydrate,
    getQueryClient,
} from '@hikka/react/core';
import { prefetchFollowingHistory } from '@hikka/react/server';
import { Metadata } from 'next';
import { FC } from 'react';

import { UserHistory as History } from '@/features/users';

import { getHikkaClientConfig } from '@/utils/hikka-client';
import { generateMetadata as _generateMetadata } from '@/utils/metadata';

export const metadata: Metadata = _generateMetadata({
    title: 'Активність',
});

interface Props {
    searchParams: Record<string, any>;
}

const FollowingHistoryPage: FC<Props> = async (props) => {
    const queryClient = getQueryClient();
    const clientConfig = await getHikkaClientConfig();

    clientConfig.authToken &&
        (await prefetchFollowingHistory({ clientConfig, queryClient }));

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
