import {
    AnimeMediaEnum,
    AnimeStatusEnum,
    ContentStatusEnum,
    ContentTypeEnum,
    FeedContentType,
    UserResponse,
    WatchStatusEnum,
} from '@hikka/client';
import { useSession } from '@hikka/react';
import { queryKeys } from '@hikka/react/core';
import {
    feedOptions,
    followingHistoryOptions,
    readStatsOptions,
    searchAnimeScheduleOptions,
    searchAnimesOptions,
    searchUserWatchesOptions,
    userFollowStatsOptions,
    userWatchStatsOptions,
} from '@hikka/react/options';
import { createFileRoute } from '@tanstack/react-router';
import { zodValidator } from '@tanstack/zod-adapter';

import CoverImage from '@/components/cover-image';

import { FeedLayout, FeedList } from '@/features/feed';

import { generateHeadMeta } from '@/utils/metadata';
import { feedSearchSchema } from '@/utils/search-schemas';
import { getCurrentSeason } from '@/utils/season';

const FEED_TYPE_TO_CONTENT_TYPE: Record<string, FeedContentType | undefined> = {
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
    loader: async ({ context: { queryClient, hikkaClient }, deps }) => {
        const { type } = deps;
        const season = getCurrentSeason()!;
        const year = Number(new Date().getFullYear());

        const loggedUser: UserResponse | undefined = queryClient.getQueryData(
            queryKeys.user.me(),
        );

        const promises: Promise<unknown>[] = [];

        if (loggedUser) {
            promises.push(
                queryClient.ensureInfiniteQueryData(
                    searchUserWatchesOptions(hikkaClient, {
                        username: loggedUser.username,
                        args: {
                            watch_status: WatchStatusEnum.WATCHING,
                            sort: ['watch_updated:desc'],
                        },
                    }),
                ),
                queryClient.ensureInfiniteQueryData(
                    followingHistoryOptions(hikkaClient),
                ),
                queryClient.ensureQueryData(
                    userWatchStatsOptions(hikkaClient, {
                        username: loggedUser.username,
                    }),
                ),
                queryClient.ensureQueryData(
                    readStatsOptions(hikkaClient, {
                        contentType: ContentTypeEnum.MANGA,
                        username: loggedUser.username,
                    }),
                ),
                queryClient.ensureQueryData(
                    readStatsOptions(hikkaClient, {
                        contentType: ContentTypeEnum.NOVEL,
                        username: loggedUser.username,
                    }),
                ),
                queryClient.ensureQueryData(
                    userFollowStatsOptions(hikkaClient, {
                        username: loggedUser.username,
                    }),
                ),
            );
        }

        promises.push(
            queryClient.ensureInfiniteQueryData(
                feedOptions(hikkaClient, {
                    args: {
                        content_type: FEED_TYPE_TO_CONTENT_TYPE[type ?? 'all'],
                    },
                }),
            ),
        );

        promises.push(
            queryClient.ensureInfiniteQueryData(
                searchAnimeScheduleOptions(hikkaClient, {
                    args: {
                        airing_season: [season, year],
                        status: [
                            ContentStatusEnum.ONGOING,
                            ContentStatusEnum.ANNOUNCED,
                        ],
                    },
                }),
            ),
        );

        promises.push(
            queryClient.ensureInfiniteQueryData(
                searchAnimesOptions(hikkaClient, {
                    args: {
                        season: [season],
                        media_type: [AnimeMediaEnum.TV],
                        years: [year, year],
                        genres: ['-ecchi', '-hentai'],
                        status: [AnimeStatusEnum.ONGOING],
                        sort: [
                            'scored_by:desc',
                            'score:desc',
                            'native_scored_by:desc',
                            'native_score:desc',
                        ],
                    },
                    paginationArgs: {
                        size: 5,
                    },
                }),
            ),
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
            <FeedLayout>
                <FeedList />
            </FeedLayout>
        </>
    );
}
