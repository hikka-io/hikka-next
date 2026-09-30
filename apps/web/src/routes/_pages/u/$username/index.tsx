import { createFileRoute } from '@tanstack/react-router';

import {
    ContentTypeEnum,
    paginationPageParam,
    serviceUserActivityOptions,
    serviceUserStatsOptions,
    userWatchStatsOptions,
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
    userFavouritesPreviewOptions,
    userHistoryPreviewOptions,
} from '@/features/users/queries';
import { retryOnCancel } from '@/utils/api/retry-on-cancel';

export const Route = createFileRoute('/_pages/u/$username/')({
    loader: async ({ params, context: { queryClient, apiClient } }) => {
        const { username } = params;
        const path = { username };

        await Promise.allSettled([
            queryClient.prefetchQuery(
                userWatchStatsOptions({ path, client: apiClient }),
            ),
            queryClient.prefetchQuery(
                serviceUserStatsOptions({ path, client: apiClient }),
            ),
            queryClient.prefetchQuery(
                serviceUserActivityOptions({ path, client: apiClient }),
            ),
            retryOnCancel(() =>
                queryClient.ensureInfiniteQueryData({
                    ...userFavouritesPreviewOptions(
                        username,
                        ContentTypeEnum.ANIME,
                        apiClient,
                    ),
                    ...paginationPageParam(),
                }),
            ),
            retryOnCancel(() =>
                queryClient.ensureInfiniteQueryData({
                    ...userHistoryPreviewOptions(username, apiClient),
                    ...paginationPageParam(),
                }),
            ),
            retryOnCancel(() =>
                queryClient.ensureInfiniteQueryData({
                    ...userArticlesPreviewOptions(username, apiClient),
                    ...paginationPageParam(),
                }),
            ),
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
