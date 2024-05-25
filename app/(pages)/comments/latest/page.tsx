import { dehydrate } from '@tanstack/query-core';
import { HydrationBoundary } from '@tanstack/react-query';
import { Metadata } from 'next';
import { FC } from 'react';

import Comments from '@/features/comments/latest-comments.component';

import getGlobalComments from '@/services/api/comments/getGlobalComments';
import _generateMetadata from '@/utils/generateMetadata';
import getQueryClient from '@/utils/getQueryClient';

export const metadata: Metadata = _generateMetadata({
    title: 'Останні коментарі',
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
            }),
    });

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
