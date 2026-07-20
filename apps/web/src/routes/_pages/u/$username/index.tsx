import { createFileRoute } from '@tanstack/react-router';

import {
    ContentTypeEnum,
    favouriteListInfiniteOptions,
    getArticlesInfiniteOptions,
    getCollectionsInfiniteOptions,
    paginationPageParam,
    serviceUserActivityOptions,
    serviceUserStatsOptions,
    userHistoryInfiniteOptions,
} from '@hikka/api';

import {
    UserCollections as Collections,
    UserFavorites as Favorites,
    UserHistoryProfile as History,
    UserActivity,
    UserArticles,
    UserListStats,
} from '@/features/users';

export const Route = createFileRoute('/_pages/u/$username/')({
    loader: async ({ params, context: { queryClient, apiClient } }) => {
        const { username } = params;

        await Promise.allSettled([
            queryClient.ensureInfiniteQueryData({
                ...favouriteListInfiniteOptions({
                    path: {
                        username,
                        content_type: ContentTypeEnum.ANIME,
                    },
                    client: apiClient,
                }),
                ...paginationPageParam(),
            }),
            queryClient.ensureInfiniteQueryData({
                ...userHistoryInfiniteOptions({
                    path: { username },
                    client: apiClient,
                }),
                ...paginationPageParam(),
            }),
            queryClient.prefetchQuery(
                serviceUserActivityOptions({
                    path: { username },
                    client: apiClient,
                }),
            ),
            queryClient.prefetchQuery(
                serviceUserStatsOptions({
                    path: { username },
                    client: apiClient,
                }),
            ),
            queryClient.ensureInfiniteQueryData({
                ...getArticlesInfiniteOptions({
                    body: { author: username },
                    query: { size: 3 },
                    client: apiClient,
                }),
                ...paginationPageParam(),
            }),
            queryClient.ensureInfiniteQueryData({
                ...getCollectionsInfiniteOptions({
                    body: {
                        author: username,
                        sort: ['created:desc'],
                        only_public: false,
                    },
                    client: apiClient,
                }),
                ...paginationPageParam(),
            }),
        ]);
    },
    component: UserPage,
});

function UserPage() {
    return (
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_25%] lg:gap-12">
            <div
                className="contents lg:flex lg:flex-col lg:gap-8"
                id="profile-left-side"
            >
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
            <div
                className="contents lg:flex lg:flex-col lg:gap-8"
                id="profile-right-side"
            >
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
