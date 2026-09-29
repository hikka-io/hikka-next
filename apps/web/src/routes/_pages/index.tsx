import { createFileRoute } from '@tanstack/react-router';
import { zodValidator } from '@tanstack/zod-adapter';

import {
    AnimeStatusEnum,
    animeScheduleInfiniteOptions,
    ContentTypeEnum,
    type FeedArgs,
    feedPageParam,
    followingHistoryInfiniteOptions,
    followStatsOptions,
    getFeedInfiniteOptions,
    paginationPageParam,
    profileQueryKey,
    type UserResponse,
    userReadStatsOptions,
    userWatchListInfiniteOptions,
    userWatchStatsOptions,
    WatchStatusEnum,
} from '@hikka/api';

import { CoverImage, usePageHeader } from '@/features/app-shell';
import { useSession } from '@/features/auth/hooks/use-session';
import { FeedLayout, HomeHeaderActions } from '@/features/home';
import { ongoingsOptions } from '@/features/home/queries';
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

const FEED_TYPE_TO_CONTENT_TYPE: Record<
    string,
    FeedArgs['feed_content_types']
> = {
    comments: [ContentTypeEnum.COMMENT],
    articles: [ContentTypeEnum.ARTICLE],
    collections: [ContentTypeEnum.COLLECTION],
    all: undefined,
};

export const Route = createFileRoute('/_pages/')({
    validateSearch: zodValidator(feedSearchSchema),
    loaderDeps: ({ search }) => ({ type: search.type }),
    head: () =>
        generateHeadMeta({
            title: 'Hikka - енциклопедія аніме, манґи та ранобе українською',
            url: SITE_ORIGIN,
        }),
    loader: async ({ context: { queryClient, apiClient }, deps }) => {
        const { type } = deps;
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
                    ...followingHistoryInfiniteOptions({ client: apiClient }),
                    ...paginationPageParam(),
                }),
                queryClient.ensureQueryData(
                    userWatchStatsOptions({
                        path: { username: loggedUser.username },
                        client: apiClient,
                    }),
                ),
                queryClient.ensureQueryData(
                    userReadStatsOptions({
                        path: {
                            content_type: ContentTypeEnum.MANGA,
                            username: loggedUser.username,
                        },
                        client: apiClient,
                    }),
                ),
                queryClient.ensureQueryData(
                    userReadStatsOptions({
                        path: {
                            content_type: ContentTypeEnum.NOVEL,
                            username: loggedUser.username,
                        },
                        client: apiClient,
                    }),
                ),
                queryClient.ensureQueryData(
                    followStatsOptions({
                        path: { username: loggedUser.username },
                        client: apiClient,
                    }),
                ),
            );
        }

        promises.push(
            queryClient.ensureInfiniteQueryData({
                ...getFeedInfiniteOptions({
                    body: {
                        feed_content_types:
                            FEED_TYPE_TO_CONTENT_TYPE[type ?? 'all'],
                    },
                    client: apiClient,
                }),
                ...feedPageParam(),
            }),
        );

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
