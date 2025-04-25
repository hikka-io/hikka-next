import { ContentTypeEnum } from '@hikka/client';
import {
    HydrationBoundary,
    dehydrate,
    getQueryClient,
    prefetchCollectionsList,
    prefetchFavouriteList,
    prefetchSearchArticles,
    prefetchUserActivity,
    prefetchUserHistory,
} from '@hikka/react';
import { FC } from 'react';

import UserArticles from '@/features/users/user-profile/user-articles/user-articles.component';
import Collections from '@/features/users/user-profile/user-collections/user-collections.component';
import Favorites from '@/features/users/user-profile/user-favorites/user-favorites.component';
import History from '@/features/users/user-profile/user-history/user-history.component';
import Statistics from '@/features/users/user-profile/user-statistics/user-statistics.component';

import getHikkaClientConfig from '@/utils/get-hikka-client-config';

interface Props {
    params: {
        username: string;
    };
}

const UserPage: FC<Props> = async (props) => {
    const params = await props.params;

    const { username } = params;

    const queryClient = await getQueryClient();
    const clientConfig = await getHikkaClientConfig();

    await Promise.all([
        await prefetchFavouriteList({
            username,
            contentType: ContentTypeEnum.ANIME,
            clientConfig,
        }),
        await prefetchUserHistory({ username, clientConfig }),
        await prefetchUserActivity({ username, clientConfig }),
        await prefetchSearchArticles({
            args: { author: username },
            clientConfig,
        }),
        await prefetchCollectionsList({
            args: { author: username, sort: ['created:desc'] },
            clientConfig,
        }),
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
