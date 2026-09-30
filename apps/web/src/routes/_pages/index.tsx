import { createFileRoute } from '@tanstack/react-router';
import { zodValidator } from '@tanstack/zod-adapter';

import {
    feedPageParam,
    followStatsOptions,
    getFeedInfiniteOptions,
    profileQueryKey,
    type UserResponse,
} from '@hikka/api';

import { CoverImage, usePageHeader } from '@/features/app-shell';
import { FeedLayout, HomeHeaderActions } from '@/features/home';
import {
    feedHasWidget,
    followingHistoryPreviewOptions,
    HOME_ARTICLES_NEWEST_SORT,
    homeArticlesOptions,
    homeScheduleOptions,
    homeWatchingOptions,
    initialFeedArgs,
    ongoingsOptions,
} from '@/features/home/queries';
import { useSession } from '@/services/session';
import { generateHeadMeta } from '@/utils/metadata';
import { feedSearchSchema } from '@/utils/search-schemas';
import { SITE_ORIGIN } from '@/utils/url';

const HeaderWordmark = () => (
    <span
        role="img"
        aria-label="Hikka"
        className="logo-full h-4 w-14 shrink-0 bg-left"
    />
);

export const Route = createFileRoute('/_pages/')({
    validateSearch: zodValidator(feedSearchSchema),
    head: () =>
        generateHeadMeta({
            title: 'Hikka - енциклопедія аніме, манґи та ранобе українською',
            url: SITE_ORIGIN,
        }),
    loader: async ({ context: { queryClient, apiClient } }) => {
        const loggedUser = queryClient.getQueryData(profileQueryKey()) as
            | (UserResponse & { username: string })
            | undefined;

        const promises: Promise<unknown>[] = [];

        if (loggedUser) {
            promises.push(
                queryClient.prefetchInfiniteQuery(
                    homeWatchingOptions(loggedUser.username, apiClient),
                ),
                queryClient.prefetchInfiniteQuery(
                    followingHistoryPreviewOptions(apiClient),
                ),
                queryClient.prefetchQuery(
                    followStatsOptions({
                        path: { username: loggedUser.username },
                        client: apiClient,
                    }),
                ),
            );
        }

        const feedArgs = initialFeedArgs(queryClient);

        if (feedArgs) {
            promises.push(
                queryClient.prefetchInfiniteQuery({
                    ...getFeedInfiniteOptions({
                        body: feedArgs,
                        client: apiClient,
                    }),
                    ...feedPageParam(),
                }),
            );
        }

        promises.push(
            queryClient.prefetchInfiniteQuery(
                homeScheduleOptions(false, apiClient),
            ),
            queryClient.prefetchInfiniteQuery(ongoingsOptions(apiClient)),
        );

        if (feedHasWidget(queryClient, 'articles')) {
            promises.push(
                queryClient.prefetchInfiniteQuery(
                    homeArticlesOptions(
                        { sort: HOME_ARTICLES_NEWEST_SORT },
                        apiClient,
                    ),
                ),
            );
        }

        await Promise.all(promises);
    },
    component: HomePage,
});

function HomePage() {
    const { user: loggedUser } = useSession();

    usePageHeader({
        title: 'Головна',
        titleComponent: HeaderWordmark,
        actionsComponent: HomeHeaderActions,
        hideBack: true,
    });

    return (
        <>
            <CoverImage cover={loggedUser?.cover} />
            <FeedLayout />
        </>
    );
}
