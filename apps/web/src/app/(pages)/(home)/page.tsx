import { UserResponse } from '@hikka/client';
import {
    HydrationBoundary,
    dehydrate,
    getQueryClient,
    queryKeys,
} from '@hikka/react/core';

import CoverImage from '@/components/cover-image';
import Block from '@/components/ui/block';
import {
    Header,
    HeaderContainer,
    HeaderNavButton,
    HeaderTitle,
} from '@/components/ui/header';

import Collections from '@/features/home/collections.component';
import Comments from '@/features/home/comments.component';
import History from '@/features/home/history.component';
import Ongoings from '@/features/home/ongoings.component';
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
                    <Block>
                        <Header href={`/u/${loggedUser?.username}`}>
                            <HeaderContainer>
                                <HeaderTitle>Профіль</HeaderTitle>
                            </HeaderContainer>
                            <HeaderNavButton />
                        </Header>
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
