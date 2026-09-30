import { createFileRoute } from '@tanstack/react-router';
import { zodValidator } from '@tanstack/zod-adapter';

import {
    AnimeStatusEnum,
    animeScheduleInfiniteOptions,
    feedPageParam,
    followStatsOptions,
    getFeedInfiniteOptions,
    paginationPageParam,
    profileQueryKey,
    type UserResponse,
    userWatchListInfiniteOptions,
    WatchStatusEnum,
} from '@hikka/api';

import { CoverImage, usePageHeader } from '@/features/app-shell';
import { FeedLayout, HomeHeaderActions } from '@/features/home';
import {
    feedHasWidget,
    followingHistoryPreviewOptions,
    HOME_ARTICLES_NEWEST_SORT,
    homeArticlesOptions,
    initialFeedArgs,
    ongoingsOptions,
} from '@/features/home/queries';
import { useSession } from '@/services/session';
import { generateHeadMeta } from '@/utils/metadata';
import { feedSearchSchema } from '@/utils/search-schemas';
import { getCurrentSeason } from '@/utils/season';
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
        const season = getCurrentSeason()!;
        const year = Number(new Date().getFullYear());

        const loggedUser = queryClient.getQueryData(profileQueryKey()) as
            | (UserResponse & { username: string })
            | undefined;

        const promises: Promise<unknown>[] = [];

        if (loggedUser) {
            promises.push(
                queryClient.ensureInfiniteQueryData({
                    ...userWatchListInfiniteOptions({
                        path: { username: loggedUser.username },
                        body: {
                            watch_status: WatchStatusEnum.WATCHING,
                            sort: ['watch_updated:desc'],
                        },
                        client: apiClient,
                    }),
                    ...paginationPageParam(),
                }),
                queryClient.ensureInfiniteQueryData({
                    ...followingHistoryPreviewOptions({ client: apiClient }),
                    ...paginationPageParam(),
                }),
                queryClient.ensureQueryData(
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
                queryClient.ensureInfiniteQueryData({
                    ...getFeedInfiniteOptions({
                        body: feedArgs,
                        client: apiClient,
                    }),
                    ...feedPageParam(),
                }),
            );
        }

        promises.push(
            queryClient.ensureInfiniteQueryData({
                ...animeScheduleInfiniteOptions({
                    body: {
                        airing_season: [season, year],
                        status: [
                            AnimeStatusEnum.ONGOING,
                            AnimeStatusEnum.ANNOUNCED,
                        ],
                    },
                    client: apiClient,
                }),
                ...paginationPageParam(),
            }),
        );

        promises.push(
            queryClient.ensureInfiniteQueryData({
                ...ongoingsOptions({ size: 5, client: apiClient }),
                ...paginationPageParam(),
            }),
        );

        if (feedHasWidget(queryClient, 'articles')) {
            promises.push(
                queryClient.ensureInfiniteQueryData({
                    ...homeArticlesOptions({
                        body: { sort: HOME_ARTICLES_NEWEST_SORT },
                        client: apiClient,
                    }),
                    ...paginationPageParam(),
                }),
            );
        }

        await Promise.allSettled(promises);
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
