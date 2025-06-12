import { UserResponse } from '@hikka/client';
import {
    HydrationBoundary,
    dehydrate,
    getQueryClient,
    queryKeys,
} from '@hikka/react/core';

import CoverImage from '@/components/cover-image';

import Articles from '@/features/home/articles/articles.component';
import Collections from '@/features/home/collections/collections.component';
import Comments from '@/features/home/comments.component';
import Ongoings from '@/features/home/ongoings.component';
import History from '@/features/home/profile/history.component';
import Profile from '@/features/home/profile/profile.component';
import Schedule from '@/features/home/schedule/schedule.component';

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
            <div className="flex flex-col gap-16">
                <CoverImage cover={loggedUser?.cover} />
                <Ongoings />
                {loggedUser && (
                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                        <Profile />
                        <History />
                    </div>
                )}
                <Comments />
                <Articles />

                <Collections />
                <Schedule />
            </div>
        </HydrationBoundary>
    );
};

export default Page;
