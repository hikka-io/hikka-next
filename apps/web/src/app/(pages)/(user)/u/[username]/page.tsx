import { dehydrate } from '@tanstack/query-core';
import { HydrationBoundary } from '@tanstack/react-query';
import { FC } from 'react';

import UserArticles from '@/features/users/user-profile/user-articles/user-articles.component';
import Collections from '@/features/users/user-profile/user-collections/user-collections.component';
import Favorites from '@/features/users/user-profile/user-favorites/user-favorites.component';
import History from '@/features/users/user-profile/user-history/user-history.component';
import Statistics from '@/features/users/user-profile/user-statistics/user-statistics.component';
import { prefetchArticles } from '@/services/hooks/articles/use-articles';
import { prefetchFavorites } from '@/services/hooks/favorite/use-favorites';
import { prefetchUserHistory } from '@/services/hooks/history/use-user-history';
import { prefetchUserActivity } from '@/services/hooks/user/use-user-activity';
import { prefetchUserCollections } from '@/services/hooks/user/use-user-collections';
import getQueryClient from '@/utils/get-query-client';

interface Props {
    params: {
        username: string;
    };
}

const UserPage: FC<Props> = async (props) => {
    const params = await props.params;

    const { username } = params;

    const queryClient = await getQueryClient();

    await Promise.all([
        await prefetchFavorites({ username, content_type: 'anime' }),
        await prefetchUserHistory({ username }),
        await prefetchUserActivity({ username }),
        await prefetchArticles({ author: username }),
        await prefetchUserCollections({ author: username, sort: 'created' }),
    ]);

    const dehydratedState = dehydrate(queryClient);

    return (
        <HydrationBoundary state={dehydratedState}>
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_25%] lg:gap-16">
                <div className="order-2 flex flex-col gap-12 lg:order-1 lg:gap-16">
                    <Statistics />
                    <Favorites />
                    <UserArticles />
                </div>
                <div className="order-1 flex flex-col gap-12 lg:order-2 lg:gap-16">
                    <History />
                    <Collections />
                </div>
            </div>
        </HydrationBoundary>
    );
};

export default UserPage;
