import { dehydrate } from '@tanstack/query-core';
import { HydrationBoundary } from '@tanstack/react-query';
import { Metadata } from 'next';
import { FC } from 'react';

import Comments from '../../../../features/comments/latest-comments.component';
import { prefetchGlobalComments } from '../../../../services/hooks/comments/use-global-comments';
import _generateMetadata from '../../../../utils/generate-metadata';
import getQueryClient from '../../../../utils/get-query-client';

export const metadata: Metadata = _generateMetadata({
    title: 'Останні коментарі',
});

interface Props {
    searchParams: Record<string, any>;
}

const FollowingHistoryPage: FC<Props> = async (props) => {
    const searchParams = await props.searchParams;
    const queryClient = await getQueryClient();

    await prefetchGlobalComments();

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
