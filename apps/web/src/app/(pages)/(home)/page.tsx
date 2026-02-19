import { UserResponse } from '@hikka/client';
import {
    HydrationBoundary,
    dehydrate,
    getQueryClient,
    queryKeys,
} from '@hikka/react/core';

import CoverImage from '@/components/cover-image';

import {
    FeedLayout,
    FeedList,
    FeedSidebar,
    FeedWidgets,
} from '@/features/feed';

import prefetchQueries from './page.queries';

const Page = async () => {
    const queryClient = getQueryClient();

    await prefetchQueries({ queryClient });

    const loggedUser: UserResponse | undefined = queryClient.getQueryData(
        queryKeys.user.me(),
    );

    const dehydratedState = dehydrate(queryClient);

    return (
        <HydrationBoundary state={dehydratedState}>
            <CoverImage cover={loggedUser?.cover} />
            <FeedLayout
                sidebar={loggedUser ? <FeedSidebar /> : undefined}
                widgets={<FeedWidgets />}
            >
                <FeedList />
            </FeedLayout>
        </HydrationBoundary>
    );
};

export default Page;
