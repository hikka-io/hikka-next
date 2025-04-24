import {
    HydrationBoundary,
    dehydrate,
    getQueryClient,
    prefetchFollowingHistory,
} from '@hikka/react';
import { Metadata } from 'next';
import { FC } from 'react';

import History from '@/features/users/user-history/user-history.component';

import _generateMetadata from '@/utils/generate-metadata';
import getHikkaClientConfig from '@/utils/get-hikka-client-config';

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
        (await prefetchFollowingHistory({ clientConfig }));

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
