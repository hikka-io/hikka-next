import { createFileRoute } from '@tanstack/react-router';

import {
    ContentTypeEnum,
    favouriteListInfiniteOptions,
    paginationPageParam,
    serviceUserActivityOptions,
    userHistoryInfiniteOptions,
} from '@hikka/api';

import {
    UserActivity,
    UserArticles,
    UserCollections,
    UserFavorites,
    UserHistory,
    UserListStats,
} from '@/features/users';
import {
    userArticlesPreviewOptions,
    userCollectionsPreviewOptions,
} from '@/features/users/queries';

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
            queryClient.ensureInfiniteQueryData({
                ...userArticlesPreviewOptions(username, apiClient),
                ...paginationPageParam(),
            }),
            queryClient.ensureInfiniteQueryData({
                ...userCollectionsPreviewOptions(username, apiClient),
                ...paginationPageParam(),
            }),
        ]);
    },
    component: UserPage,
});

function UserPage() {
    return (
        <div className="grid grid-cols-1 gap-x-10 gap-y-8 lg:grid-cols-[1fr_25%]">
            <div
                className="contents lg:flex lg:flex-col lg:gap-8"
                id="profile-left-side"
            >
                <div className="order-1 grid grid-cols-1 gap-8 md:grid-cols-2 lg:order-0">
                    <UserListStats />
                    <UserActivity />
                </div>
                <div className="order-3 lg:order-0">
                    <UserFavorites />
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
                    <UserHistory />
                </div>
                <div className="order-2 lg:order-0">
                    <UserCollections />
                </div>
            </div>
        </div>
    );
}
