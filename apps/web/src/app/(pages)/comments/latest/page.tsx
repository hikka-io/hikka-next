import {
    HydrationBoundary,
    dehydrate,
    getQueryClient,
} from '@hikka/react/core';
import { prefetchLatestComments } from '@hikka/react/server';
import { Metadata } from 'next';
import { FC } from 'react';

import Comments from '@/features/comments/latest-comments.component';

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

    await prefetchLatestComments({ clientConfig });

    const dehydratedState = dehydrate(queryClient);

    return (
        <HydrationBoundary state={dehydratedState}>
            <div className="flex flex-col gap-12">
                <Comments />
            </div>
        </HydrationBoundary>
    );
};

export default LatestCommentsPage;
