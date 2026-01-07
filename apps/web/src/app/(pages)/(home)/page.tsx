import { UserResponse } from '@hikka/client';
import {
    HydrationBoundary,
    dehydrate,
    getQueryClient,
    queryKeys,
} from '@hikka/react/core';

import CoverImage from '@/components/cover-image';

import {
    HomeArticles as Articles,
    HomeCollections as Collections,
    HomeComments as Comments,
    HomeHistory as History,
    HomeOngoings as Ongoings,
    HomeProfile as Profile,
    HomeSchedule as Schedule,
} from '@/features/home';

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
                    <div className="flex flex-col gap-8">
                        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                            <Profile />
                            <History />
                        </div>
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
