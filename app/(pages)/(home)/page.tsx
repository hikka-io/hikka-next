import { dehydrate } from '@tanstack/query-core';
import { HydrationBoundary } from '@tanstack/react-query';

import UserCover from '@/components/user-cover';

import Collections from '@/features/home/collections.component';
import Comments from '@/features/home/comments.component';
import History from '@/features/home/history.component';
import Ongoings from '@/features/home/ongoings.component';
import Profile from '@/features/home/profile.component';
import Schedule from '@/features/home/schedule/schedule.component';

import prefetchQueries from '@/app/(pages)/(home)/page.queries';
import getLoggedUserInfo from '@/services/api/user/getLoggedUserInfo';
import getQueryClient from '@/utils/getQueryClient';

const Page = async () => {
    const queryClient = await getQueryClient();

    await queryClient.prefetchQuery({
        queryKey: ['loggedUser'],
        queryFn: ({ meta }) => getLoggedUserInfo({}),
    });

    const loggedUser: API.User | undefined = queryClient.getQueryData([
        'loggedUser',
    ]);

    await prefetchQueries({ queryClient });

    const dehydratedState = dehydrate(queryClient);

    return (
        <HydrationBoundary state={dehydratedState}>
            <div className="flex flex-col gap-16">
                <UserCover />
                <Ongoings />
                {loggedUser && (
                    <div className="grid grid-cols-1 gap-16 lg:grid-cols-2">
                        <Profile />
                        <History />
                    </div>
                )}
                <Schedule />
                <div className="grid grid-cols-1 gap-16 lg:grid-cols-2">
                    <Collections />
                    <Comments />
                </div>
            </div>
        </HydrationBoundary>
    );
};

export default Page;
