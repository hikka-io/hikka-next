import { ContentTypeEnum } from '@hikka/client';
import {
    HydrationBoundary,
    dehydrate,
    getQueryClient,
} from '@hikka/react/core';
import {
    prefetchSearchArticles,
    prefetchSearchCollections,
    prefetchUserActivity,
    prefetchUserFavourites,
    prefetchUserHistory,
} from '@hikka/react/server';
import { FC } from 'react';

import {
    UserCollections as Collections,
    UserFavorites as Favorites,
    UserHistoryProfile as History,
    UserActivity,
    UserArticles,
    UserListStats,
} from '@/features/users';

import { getHikkaClientConfig } from '@/utils/hikka-client';

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
        prefetchUserFavourites({
            username,
            contentType: ContentTypeEnum.ANIME,
            clientConfig,
            queryClient,
        }),
        prefetchUserHistory({ username, clientConfig, queryClient }),
        prefetchUserActivity({ username, clientConfig, queryClient }),
        prefetchSearchArticles({
            args: { author: username },
            paginationArgs: {
                size: 3,
            },
            clientConfig,
            queryClient,
        }),
        prefetchSearchCollections({
            args: {
                author: username,
                sort: ['created:desc'],
                only_public: false,
            },
            clientConfig,
            queryClient,
        }),
    ]);

    const dehydratedState = dehydrate(queryClient);

    return (
        <HydrationBoundary state={dehydratedState}>
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_25%] lg:gap-12">
                <div className="order-2 flex flex-col gap-8 lg:order-1">
                    <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                        <UserListStats />
                        <UserActivity />
                    </div>
                    <Favorites />
                    <UserArticles />
                </div>
                <div className="order-1 flex flex-col gap-8 lg:order-2">
                    <History />
                    <Collections />
                </div>
            </div>
        </HydrationBoundary>
    );
};

export default UserPage;
