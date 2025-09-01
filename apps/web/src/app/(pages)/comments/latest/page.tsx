import {
    HydrationBoundary,
    dehydrate,
    getQueryClient,
} from '@hikka/react/core';
import { prefetchCommentList } from '@hikka/react/server';
import { Metadata } from 'next';
import { FC } from 'react';

import { LatestComments } from '@/features/comments';

import _generateMetadata from '@/utils/generate-metadata';
import getHikkaClientConfig from '@/utils/get-hikka-client-config';

export const metadata: Metadata = _generateMetadata({
    title: 'Останні коментарі',
});

interface Props {
    searchParams: Record<string, any>;
}

const LatestCommentsPage: FC = async () => {
    const queryClient = await getQueryClient();
    const clientConfig = await getHikkaClientConfig();

    await prefetchCommentList({ clientConfig, queryClient });

    const dehydratedState = dehydrate(queryClient);

    return (
        <HydrationBoundary state={dehydratedState}>
            <div className="flex flex-col gap-12">
                <LatestComments />
            </div>
        </HydrationBoundary>
    );
};

export default LatestCommentsPage;
