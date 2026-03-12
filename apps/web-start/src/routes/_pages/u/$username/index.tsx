import { ContentTypeEnum } from '@hikka/client';
import { prefetchInfiniteQuery } from '@hikka/react/core';
import {
    searchArticlesOptions,
    searchCollectionsOptions,
    userActivityOptions,
    userFavouritesOptions,
    userHistoryOptions,
} from '@hikka/react/options';
import { createFileRoute } from '@tanstack/react-router';

import {
    UserCollections as Collections,
    UserFavorites as Favorites,
    UserHistoryProfile as History,
    UserActivity,
    UserArticles,
    UserListStats,
} from '@/features/users';

export const Route = createFileRoute('/_pages/u/$username/')({
    loader: async ({ params, context: { queryClient, hikkaClient } }) => {
        const { username } = params;

        await Promise.allSettled([
            prefetchInfiniteQuery(
                queryClient,
                userFavouritesOptions(hikkaClient, {
                    username,
                    contentType: ContentTypeEnum.ANIME,
                }),
            ),
            prefetchInfiniteQuery(
                queryClient,
                userHistoryOptions(hikkaClient, { username }),
            ),
            queryClient.prefetchQuery(
                userActivityOptions(hikkaClient, { username }),
            ),
            prefetchInfiniteQuery(
                queryClient,
                searchArticlesOptions(hikkaClient, {
                    args: { author: username },
                    paginationArgs: { size: 3 },
                }),
            ),
            prefetchInfiniteQuery(
                queryClient,
                searchCollectionsOptions(hikkaClient, {
                    args: {
                        author: username,
                        sort: ['created:desc'],
                        only_public: false,
                    },
                }),
            ),
        ]);
    },
    component: UserPage,
});

function UserPage() {
    return (
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_25%] lg:gap-12">
            <div className="contents lg:flex lg:flex-col lg:gap-8">
                <div className="order-1 grid grid-cols-1 gap-8 md:grid-cols-2 lg:order-0">
                    <UserListStats />
                    <UserActivity />
                </div>
                <div className="order-3 lg:order-0">
                    <Favorites />
                </div>
                <div className="order-4 lg:order-0">
                    <UserArticles />
                </div>
            </div>
            <div className="contents lg:flex lg:flex-col lg:gap-8">
                <div className="order-2 lg:order-0">
                    <History />
                </div>
                <div className="order-2 lg:order-0">
                    <Collections />
                </div>
            </div>
        </div>
    );
}
