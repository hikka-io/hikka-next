import { createFileRoute } from '@tanstack/react-router';
import { zodValidator } from '@tanstack/zod-adapter';

import {
    AnimeMediaEnum,
    AnimeStatusEnum,
    animeScheduleInfiniteOptions,
    ContentTypeEnum,
    type FeedArgs,
    followingHistoryInfiniteOptions,
    followStatsOptions,
    paginationPageParam,
    profileQueryKey,
    searchAnimeInfiniteOptions,
    type UserResponse,
    userReadStatsOptions,
    userWatchListInfiniteOptions,
    userWatchStatsOptions,
    WatchStatusEnum,
} from '@hikka/api';

import CoverImage from '@/components/cover-image';
import { useSession } from '@/features/auth/hooks/use-session';
import { getOngoingsSort } from '@/features/filters/sort';
import { FeedLayout } from '@/features/home';
import { feedInfiniteOptions } from '@/features/home/widgets/feed-widget/feed-infinite-options';
import { generateHeadMeta } from '@/utils/metadata';
import { feedSearchSchema } from '@/utils/search-schemas';
import { getCurrentSeason } from '@/utils/season';

const FEED_TYPE_TO_CONTENT_TYPE: Record<string, FeedArgs['content_type']> = {
    comments: ContentTypeEnum.COMMENT,
    articles: ContentTypeEnum.ARTICLE,
    collections: ContentTypeEnum.COLLECTION,
    all: undefined,
};

export const Route = createFileRoute('/_pages/')({
    validateSearch: zodValidator(feedSearchSchema),
    loaderDeps: ({ search }) => ({ type: search.type }),
    head: () =>
        generateHeadMeta({
            title: 'Hikka - енциклопедія аніме, манґи та ранобе українською',
            url: 'https://hikka.io',
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
            queryClient.ensureInfiniteQueryData(
                feedInfiniteOptions(
                    {
                        content_type: FEED_TYPE_TO_CONTENT_TYPE[type ?? 'all'],
                    },
                    { client: apiClient },
                ),
            ),
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
                ...searchAnimeInfiniteOptions({
                    body: {
                        season: [season],
                        media_type: [AnimeMediaEnum.TV],
                        years: [year, year],
                        genres: ['-ecchi', '-hentai'],
                        status: [AnimeStatusEnum.ONGOING],
                        sort: getOngoingsSort(),
                    },
                    query: { size: 5 },
                    client: apiClient,
                }),
                ...paginationPageParam(),
            }),
        );

        await Promise.allSettled(promises);
    },
    component: HomePage,
});

function HomePage() {
    const { user: loggedUser } = useSession();

    return (
        <>
            <CoverImage cover={loggedUser?.cover} />
            <FeedLayout />
        </>
    );
}
