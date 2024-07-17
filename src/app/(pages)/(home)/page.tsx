import { dehydrate } from '@tanstack/query-core';
import { HydrationBoundary } from '@tanstack/react-query';

import Block from '@/components/ui/block';
import Header from '@/components/ui/header';
import UserCover from '@/components/user-cover';

import Collections from '@/features/home/collections.component';
import Comments from '@/features/home/comments.component';
import History from '@/features/home/history.component';
import Ongoings from '@/features/home/ongoings.component';
import Profile from '@/features/home/profile/profile.component';
import Schedule from '@/features/home/schedule/schedule.component';

import prefetchQueries from '@/app/(pages)/(home)/page.queries';
import { key } from '@/services/hooks/auth/use-session';
import getQueryClient from '@/utils/get-query-client';

const Page = async () => {
    const queryClient = getQueryClient();

    await prefetchQueries();

    const loggedUser: API.User | undefined = queryClient.getQueryData(key());

    const dehydratedState = dehydrate(queryClient);

    return (
        <HydrationBoundary state={dehydratedState}>
            <div className="flex flex-col gap-16">
                <UserCover />
                <Ongoings />
                {loggedUser && (
                    <Block>
                        <Header
                            title="Профіль"
                            href={`/u/${loggedUser?.username}`}
                        />

                        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                            <Profile />
                            <History />
                        </div>
                    </Block>
                )}
                <Comments />

                <Collections />
                <Schedule />
            </div>
        </HydrationBoundary>
    );
};

export default Page;
