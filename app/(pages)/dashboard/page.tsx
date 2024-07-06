import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { FC } from 'react';

import Block from '@/components/ui/block';
import UserCover from '@/components/user-cover';

import Edits from '@/features/dashboard/edits.component';
import Moderation from '@/features/dashboard/moderation.component';

import { key, prefetchSession } from '@/services/hooks/auth/use-session';
import { prefetchTodoAnime } from '@/services/hooks/edit/todo/use-todo-anime';
import { prefetchEditList } from '@/services/hooks/edit/use-edit-list';
import { EDIT_STATUSES } from '@/utils/constants';
import getQueryClient from '@/utils/get-query-client';

interface Props {}

const DashboardPage: FC<Props> = async () => {
    const queryClient = await getQueryClient();

    await prefetchSession();

    const loggedUser: API.User = queryClient.getQueryData(key())!;

    (Object.keys(EDIT_STATUSES) as API.EditStatus[]).map(async (status) => {
        await prefetchEditList({ status });
    });
    await prefetchEditList({ author: loggedUser.username });

    // await prefetchEditList({ status: ['accepted', 'denied'] });

    await prefetchTodoAnime({ param: 'title_ua' });
    await prefetchTodoAnime({ param: 'synopsis_ua' });

    const dehydratedState = dehydrate(queryClient);

    return (
        <HydrationBoundary state={dehydratedState}>
            <div className="flex flex-col gap-12">
                <UserCover />
                <Block className="flex flex-row">
                    <Edits />
                    <Moderation />
                </Block>
            </div>
        </HydrationBoundary>
    );
};

export default DashboardPage;
