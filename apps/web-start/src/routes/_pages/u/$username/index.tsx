import { ContentTypeEnum } from '@hikka/client';
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
    loader: async ({
        params,
        context: { queryClient, hikkaClient },
    }) => {
        const { username } = params;

        await Promise.all([
            queryClient.prefetchInfiniteQuery(
                userFavouritesOptions(hikkaClient, {
                    username,
                    contentType: ContentTypeEnum.ANIME,
                }) as any,
            ),
            queryClient.prefetchInfiniteQuery(
                userHistoryOptions(hikkaClient, { username }) as any,
            ),
            queryClient.prefetchQuery(
                userActivityOptions(hikkaClient, { username }),
            ),
            queryClient.prefetchInfiniteQuery(
                searchArticlesOptions(hikkaClient, {
                    args: { author: username },
                    paginationArgs: { size: 3 },
                }) as any,
            ),
            queryClient.prefetchInfiniteQuery(
                searchCollectionsOptions(hikkaClient, {
                    args: {
                        author: username,
                        sort: ['created:desc'],
                        only_public: false,
                    },
                }) as any,
            ),
        ]);
    },
    component: UserPage,
});

function UserPage() {
    return (
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
    );
}
