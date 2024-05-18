import { dehydrate } from '@tanstack/query-core';
import { HydrationBoundary } from '@tanstack/react-query';

import Ongoings from '@/app/(pages)/(root)/components/ongoings';
import prefetchQueries from '@/app/(pages)/(root)/page.queries';
import UserCover from '@/components/user-cover';
import getLoggedUserInfo from '@/services/api/user/getLoggedUserInfo';
import getQueryClient from '@/utils/getQueryClient';

import Collections from './components/collections';
import Comments from './components/comments';
import History from './components/history';
import Profile from './components/profile';
import Schedule from './components/schedule/schedule';

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
